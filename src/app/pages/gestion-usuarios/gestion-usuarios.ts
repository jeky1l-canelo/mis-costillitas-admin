import { Component, OnInit } from '@angular/core'; // ¡Importa OnInit!
import { CommonModule } from '@angular/common'; // ¡Para *ngIf y *ngFor!
import { UsuarioService } from '../../services/usuario'; // ¡Importa el servicio!
import { UsuarioFormComponent } from '../../components/usuario-form/usuario-form';
@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [ CommonModule, UsuarioFormComponent ], // ¡Importa CommonModule!
  templateUrl: './gestion-usuarios.html',
  styleUrl: './gestion-usuarios.css'
})
export class GestionUsuariosComponent implements OnInit { // O GestionUsuarios

  usuarios: any[] = []; // Array para guardar la lista de usuarios
  isLoading: boolean = true;
  errorMessage: string = '';
  deleteSuccessMessage: string = ''; // Mensaje éxito borrado
  deleteErrorMessage: string = '';   // Mensaje error borrado
showForm: boolean = false; // Controla si el formulario se muestra
  userIdToEdit: number | null = null; // Para saber si estamos editando (lo usaremos después)
generalSuccessMessage: string = ''; // Mensaje éxito general

  // Inyecta el UsuarioService
  constructor(private usuarioService: UsuarioService) {}

  // Se ejecuta al cargar la página
  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.deleteSuccessMessage = ''; // Limpia mensajes al recargar
    this.deleteErrorMessage = '';
    this.generalSuccessMessage = '';

    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.isLoading = false;
        console.log('Usuarios cargados:', this.usuarios);
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
        this.errorMessage = 'No se pudieron cargar los usuarios.';
        // Podríamos añadir manejo específico para 403 (Forbidden) si no es Admin
        this.isLoading = false;
      }
    });
  }
  // --- ¡MÉTODO NUEVO PARA BORRAR! ---
  borrarUsuario(id: number, nombre: string): void {
    // Pide confirmación
    if (!confirm(`¿Estás seguro de que deseas eliminar al usuario "${nombre}" (ID: ${id})?`)) {
      return;
    }

    this.deleteSuccessMessage = '';
    this.deleteErrorMessage = '';
    this.generalSuccessMessage = '';

    this.usuarioService.eliminarUsuario(id).subscribe({
      next: () => {
        // ¡Éxito!
        this.deleteSuccessMessage = `Usuario "${nombre}" eliminado correctamente.`;
        // Recarga la lista para que desaparezca el usuario
        this.cargarUsuarios();
      },
      error: (err) => {
        // ¡Error!
        console.error('Error al eliminar usuario', err);
        if (err.status === 403) {
            this.deleteErrorMessage = 'No tienes permiso para eliminar usuarios.';
        } else {
            this.deleteErrorMessage = `Error al eliminar el usuario "${nombre}". Inténtalo de nuevo.`;
        }
      }
    });
  }
  // --- ¡NUEVOS MÉTODOS para manejar el formulario! ---
  openCreateForm(): void {
    this.generalSuccessMessage = '';
    this.userIdToEdit = null; // Asegura que no estemos en modo edición
    this.showForm = true;     // Muestra el formulario
  }

  handleFormSaved(): void {
    this.showForm = false;     // Oculta el formulario
    this.userIdToEdit = null; // Resetea el ID de edición
    this.cargarUsuarios();     // Recarga la lista de usuarios
    // Podrías añadir un mensaje de éxito general aquí
    this.generalSuccessMessage = 'Usuario guardado con éxito.';
    // (Opcional) Oculta el mensaje después de unos segundos
    setTimeout(() => {
      this.generalSuccessMessage = '';
    }, 3000); // Oculta después de 3 segundos
  }

  handleFormCancelled(): void {
    this.generalSuccessMessage = '';
    this.showForm = false;     // Oculta el formulario
    this.userIdToEdit = null; // Resetea el ID de edición
  }

  // (Añadiremos openEditForm(id) después)
}
