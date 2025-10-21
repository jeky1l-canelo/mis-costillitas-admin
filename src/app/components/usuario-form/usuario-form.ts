import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core'; // Import necessary decorators/interfaces
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario'; // Or usuario
// import { UsuarioRequest } from '../../dto/usuario-request'; // Optional DTO

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.css'
})
export class UsuarioFormComponent implements OnInit { // Implement OnInit

  // --- Inputs/Outputs (for potential editing later) ---
  @Input() userIdToEdit: number | null = null; // Receive ID if editing
  @Output() formSaved = new EventEmitter<void>(); // Notify parent when saved
  @Output() formCancelled = new EventEmitter<void>(); // Notify parent if cancelled

  // --- Form Data ---
  userData: any = { // Replace 'any' with UsuarioRequest if using DTOs
    username: '',
    nombre: '',
    email: '',
    password: '', // Password will be required for new, optional for edit
    rolNombre: 'ROLE_PERSONAL' // Default role
  };
  isEditMode: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  // Roles available (could fetch from backend later if needed)
  roles: string[] = ['ROLE_ADMIN', 'ROLE_ENCARGADO', 'ROLE_PERSONAL'];

  constructor(private usuarioService: UsuarioService) {} // Or Usuario

  ngOnInit(): void {
    // If an ID was passed, it's edit mode. Fetch user data.
    if (this.userIdToEdit) {
      this.isEditMode = true;
      this.isLoading = true;
      this.usuarioService.getUsuario(this.userIdToEdit).subscribe({
        next: (user) => {
          // Populate form (don't load password)
          this.userData = { ...user, password: '' }; // Use spread operator to copy fields
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Error al cargar datos del usuario.';
          this.isLoading = false;
        }
      });
    } else {
      this.isEditMode = false;
    }
  }

  // --- Save Method ---
  saveUser(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Prepare data (remove password if empty during edit)
    let dataToSend = { ...this.userData };
    if (this.isEditMode && !dataToSend.password) {
      delete dataToSend.password; // Don't send empty password on update
    }

    // Determine if creating or updating
    const saveOperation = this.isEditMode
      ? this.usuarioService.actualizarUsuario(this.userIdToEdit!, dataToSend)
      : this.usuarioService.crearUsuario(dataToSend);

    saveOperation.subscribe({
      next: () => {
        this.isLoading = false;
        this.formSaved.emit(); // Notify parent component
      },
      error: (err) => {
        console.error('Error guardando usuario:', err);
        this.isLoading = false;
        if (err.error && typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else if (err.error && typeof err.error === 'object') {
           const errors = Object.values(err.error).join(', ');
           this.errorMessage = errors;
        } else {
          this.errorMessage = `Error al ${this.isEditMode ? 'actualizar' : 'crear'} el usuario.`;
        }
      }
    });
  }

  // --- Cancel Method ---
  cancel(): void {
    this.formCancelled.emit(); // Notify parent component
  }
}