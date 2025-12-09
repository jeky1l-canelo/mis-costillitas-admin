import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario'; 

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-form.html', // Asegúrate que el nombre coincida
  styleUrl: './usuario-form.css'
})
export class UsuarioFormComponent implements OnInit {

  // --- Inputs/Outputs para comunicarse con el Padre (GestionUsuarios) ---
  @Input() userIdToEdit: number | null = null; // Si llega algo aquí, es EDITAR
  @Output() onSave = new EventEmitter<void>(); // Avisar al padre que guardamos
  @Output() onCancel = new EventEmitter<void>(); // Avisar al padre que cancelamos

  // --- Datos del Formulario ---
  userData: any = {
    username: '',
    nombre: '',
    email: '',
    password: '', 
    rolNombre: 'ROLE_PERSONAL' // Valor por defecto
  };
  
  isEditMode: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  // Roles disponibles (Deben coincidir con tu BD)
  roles: string[] = ['ROLE_ADMIN', 'ROLE_ENCARGADO', 'ROLE_PERSONAL'];

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    // Detectamos si estamos editando o creando
    if (this.userIdToEdit) {
      this.isEditMode = true;
      this.cargarDatosUsuario(this.userIdToEdit);
    } else {
      this.isEditMode = false;
      this.resetForm();
    }
  }

  cargarDatosUsuario(id: number): void {
    this.isLoading = true;
    
    // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
    // Usamos 'getUsuario' que es como se llama en tu servicio
    this.usuarioService.getUsuario(id).subscribe({ 
      next: (user: any) => {
        // Rellenamos el formulario
        // IMPORTANTE: Ponemos password vacío para no sobreescribirlo por accidente
        this.userData = { 
          ...user, 
          password: '',
          rolNombre: user.rolNombre || user.rol // Ajuste por si el backend devuelve objeto o string
        }; 
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al cargar los datos del usuario.';
        this.isLoading = false;
      }
    });
  }

  saveUser(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Copia de datos para no ensuciar el formulario
    let dataToSend = { ...this.userData };

    // Si estamos editando y la contraseña está vacía, la quitamos del envío
    // (Para que el backend no la cambie a vacío)
    if (this.isEditMode && !dataToSend.password) {
      delete dataToSend.password; 
    }

    // Decidimos si llamar a CREAR o ACTUALIZAR
    const request = this.isEditMode
      ? this.usuarioService.actualizarUsuario(this.userIdToEdit!, dataToSend)
      : this.usuarioService.crearUsuario(dataToSend);

    request.subscribe({
      next: () => {
        this.isLoading = false;
        this.onSave.emit(); // ¡Éxito! Avisamos al padre
      },
      error: (err) => {
        console.error('Error guardando usuario:', err);
        this.isLoading = false;
        // Manejo de error bonito
        if (err.error && typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else if (err.error && err.error.message) {
           this.errorMessage = err.error.message;
        } else {
          this.errorMessage = `Error al ${this.isEditMode ? 'actualizar' : 'crear'} el usuario.`;
        }
      }
    });
  }

  cancel(): void {
    this.onCancel.emit(); // Avisamos al padre que cierre
  }
  
  private resetForm() {
      this.userData = {
        username: '',
        nombre: '',
        email: '',
        password: '',
        rolNombre: 'ROLE_PERSONAL'
      };
  }
}