import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  credentials = {
    usernameOrEmail: '', 
    password: ''
  };

  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  login(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (response: any) => {
        const token = response.token;
        
        // 1. Decodificamos para saber quién eres
        const datosToken = this.decodificarToken(token);
        
        // Buscamos el campo "role" 
        const rolReal = datosToken.role || datosToken.authorities || 'USER';
        
        console.log('✅ Login exitoso! Rol detectado:', rolReal); 

        // 2. LÓGICA DE PROTECCIÓN (Admin / Cliente)
        
        // CASO A: Eres Personal Autorizado (Admin o Encargado)
        if (rolReal === 'ROLE_ADMIN' || rolReal === 'ROLE_ENCARGADO') {
          this.isLoading = false;
          this.router.navigate(['/admin/dashboard']);
        } 
        
        // CASO B: Eres Cliente (no admin)
        else {
          console.warn('⛔ Acceso Denegado: Cliente intentando entrar al panel Admin');
          this.isLoading = false;
          
          // A) Mostrar la alerta CLARA
          alert('⛔ ACCESO DENEGADO: Estas credenciales son de Cliente. Por favor ingresa en la Web de Reservas.');
          
          // B) IMPORTANTE: Cerrar la sesión inmediatamente para borrar el token
          this.authService.logout();
          
          // C) Mensaje visual en el formulario (opcional)
          this.errorMessage = 'Esta cuenta no tiene permisos de administrador.';
        }
      },
      error: (err) => {
        console.error('Error en login:', err);
        this.isLoading = false;
        if (err.status === 401 || err.status === 403 || err.status === 400) {
          this.errorMessage = 'Credenciales incorrectas. Inténtalo de nuevo.';
        } else {
          this.errorMessage = 'Error de conexión con el servidor.';
        }
      }
    });
  }

  // --- Helper para leer el JWT sin librerías ---
  private decodificarToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('No se pudo decodificar el token', e);
      return {};
    }
  }
}