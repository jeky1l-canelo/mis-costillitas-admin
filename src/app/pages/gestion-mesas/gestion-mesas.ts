import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MesaService } from '../../services/mesa'; // Tu servicio de mesas
import { Auth } from '../../services/auth'; // Para verificar rol

@Component({
  selector: 'app-gestion-mesas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-mesas.html',
  styleUrls: ['./gestion-mesas.css']
})
export class GestionMesasComponent implements OnInit {

  mesas: any[] = [];
  isLoading: boolean = true;
  
  // Datos para el formulario de crear/editar
  nuevaMesa: any = {
    numeroMesa: null,
    capacidad: 4,
    ubicacion: 'Salon Central', // Valor por defecto
    estado: 'Disponible'
  };
  
  // Opciones de ubicación (puedes añadir más)
  ubicaciones: string[] = ['Salon Ventanal', 'Salon Central', 'Salon Interior', 'Terraza'];

  editandoId: number | null = null; // Si es null, estamos creando. Si tiene ID, editando.
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private mesaService: MesaService,
    public authService: Auth // Para usarlo en el HTML si queremos ocultar botones
  ) {}

  ngOnInit(): void {
    this.cargarMesas();
  }

  cargarMesas(): void {
    this.isLoading = true;
    this.mesaService.getTodas().subscribe({
      next: (data) => {
        // Ordenamos por número de mesa para que se vea ordenado
        this.mesas = data.sort((a, b) => a.numeroMesa - b.numeroMesa);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando mesas', err);
        this.errorMessage = 'No se pudo cargar la lista de mesas.';
        this.isLoading = false;
      }
    });
  }

  // --- Guardar (Crear o Editar) ---
  guardarMesa(): void {
    if (!this.nuevaMesa.numeroMesa || !this.nuevaMesa.capacidad) {
      alert('Por favor, completa el número y la capacidad.');
      return;
    }
    
    this.errorMessage = '';
    this.successMessage = '';

    if (this.editandoId) {
      // MODO EDICIÓN
      this.mesaService.actualizarMesa(this.editandoId, this.nuevaMesa).subscribe({
        next: () => {
          this.successMessage = 'Mesa actualizada correctamente.';
          this.cancelarEdicion();
          this.cargarMesas();
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Error al actualizar mesa. (Quizás el número ya existe)';
        }
      });
    } else {
      // MODO CREACIÓN
      this.mesaService.crearMesa(this.nuevaMesa).subscribe({
        next: () => {
          this.successMessage = 'Mesa creada correctamente.';
          this.cancelarEdicion(); // Limpia el form
          this.cargarMesas();
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Error al crear mesa. (Quizás el número ya existe)';
        }
      });
    }
  }

  // --- Borrar ---
  borrarMesa(id: number): void {
    if(!confirm('¿Estás seguro de borrar esta mesa? Esto podría afectar reservas pasadas.')) {
      return;
    }
    
    this.mesaService.eliminarMesa(id).subscribe({
      next: () => {
        this.successMessage = 'Mesa eliminada.';
        this.cargarMesas();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'No se pudo eliminar la mesa.';
      }
    });
  }

  // --- Helpers del Formulario ---
  cargarParaEditar(mesa: any): void {
    this.editandoId = mesa.id;
    this.nuevaMesa = { ...mesa }; // Copia para no editar la tabla en vivo
    window.scrollTo(0, 0); // Subir para ver el formulario
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.nuevaMesa = {
      numeroMesa: null,
      capacidad: 4,
      ubicacion: 'Salon Central',
      estado: 'Disponible'
    };
    this.errorMessage = '';
    this.successMessage = '';
  }
  
  // Helper para verificar si es Admin
  isAdmin(): boolean {
      return this.authService.getRole() === 'ROLE_ADMIN';
  }
}