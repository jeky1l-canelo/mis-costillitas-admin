import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario';
// Asegúrate de importar tu componente hijo
import { UsuarioFormComponent } from '../../components/usuario-form/usuario-form'; 

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [ CommonModule, UsuarioFormComponent ], // Importamos el componente del formulario
  templateUrl: './gestion-usuarios.html',
  styleUrl: './gestion-usuarios.css'
})
export class GestionUsuariosComponent implements OnInit {

  usuarios: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  deleteSuccessMessage: string = ''; 
  deleteErrorMessage: string = ''; 
  generalSuccessMessage: string = '';

  // Variables para controlar el formulario hijo
  showForm: boolean = false; 
  userIdToEdit: number | null = null; 

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    // ... (Tu código de cargarUsuarios igual que antes)
    this.isLoading = true;
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al cargar usuarios.';
        this.isLoading = false;
      }
    });
  }

  borrarUsuario(id: number, nombre: string): void {
    // ... (Tu código de borrar igual que antes)
     if (!confirm(`¿Eliminar a ${nombre}?`)) return;
     this.usuarioService.eliminarUsuario(id).subscribe({
         next: () => {
             this.deleteSuccessMessage = 'Usuario eliminado.';
             this.cargarUsuarios();
         },
         error: (err) => console.error(err)
     });
  }

  // --- MÉTODOS DEL FORMULARIO ---

  // 1. Abrir para CREAR (Limpio)
  openCreateForm(): void {
    this.generalSuccessMessage = '';
    this.userIdToEdit = null; // null significa "Crear Nuevo"
    this.showForm = true;     
  }

  // 2. Abrir para EDITAR (Con ID) -> ¡ESTE ES EL QUE FALTABA!
  openEditForm(id: number): void {
    this.generalSuccessMessage = '';
    this.userIdToEdit = id;   // Pasamos el ID al hijo para que cargue los datos
    this.showForm = true;     
  }

  // 3. Cuando el hijo avisa que guardó
  handleFormSaved(): void {
    this.showForm = false;    
    this.userIdToEdit = null; 
    this.cargarUsuarios();    // Recargamos la lista para ver los cambios
    this.generalSuccessMessage = 'Operación realizada con éxito.';
    setTimeout(() => this.generalSuccessMessage = '', 3000);
  }

  // 4. Cuando el hijo avisa que canceló
  handleFormCancelled(): void {
    this.showForm = false;
    this.userIdToEdit = null;
  }
}