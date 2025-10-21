import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 

import { Auth } from '../../services/auth'; // Usa tu clase Auth

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent { // Ojo: Asegúrate que el nombre de clase sea este

  credentials = { usernameOrEmail: '', password: '' };
  errorMessage = '';

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = ''; 

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Login exitoso (Admin)!', response.token);
        this.authService.saveToken(response.token); 
        // --- ¡CAMBIO AQUÍ! Redirige al Dashboard ---
        this.router.navigate(['/dashboard']); 
      },
      error: (err) => {
        console.error('Error en el login (Admin)', err);
        if (err.status === 400 || err.status === 403) {
          this.errorMessage = 'Usuario o contraseña incorrectos.';
        } else {
          this.errorMessage = 'Error de conexión. Inténtalo más tarde.';
        }
      }
    });
  }
}