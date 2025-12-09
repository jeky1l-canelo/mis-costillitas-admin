import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatoService } from '../../services/plato'; // Asegúrate de crear/tener este servicio
import { PlatoFormComponent } from '../../components/plato-form/plato-form';
import { Plato } from '../../core/models/plato';

@Component({
  selector: 'app-gestion-platos',
  standalone: true,
  imports: [ CommonModule, PlatoFormComponent ],
  templateUrl: './gestion-platos.html',
  styleUrls: ['./gestion-platos.css']
})
export class GestionPlatosComponent implements OnInit {

  platos: Plato[] = [];
  isLoading: boolean = true;
  showForm: boolean = false;
  platoIdToEdit: number | null = null;

  // Mensajes
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private platoService: PlatoService) {}

  ngOnInit(): void {
    this.cargarPlatos();
  }

  cargarPlatos(): void {
    this.isLoading = true;
    // ¡OJO! Usamos el método de ADMIN que trae todos (incluso los ocultos)
    // Tendrás que asegurarte de que tu PlatoService tenga este método llamando a /api/platos/admin/todos
    this.platoService.getTodosLosPlatosAdmin().subscribe({
      next: (data) => {
        this.platos = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  borrarPlato(id: number): void {
    if(!confirm('¿Estás seguro de eliminar este plato?')) return;
    
    this.platoService.eliminarPlato(id).subscribe({
      next: () => {
        this.successMessage = 'Plato eliminado.';
        this.cargarPlatos();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => console.error(err)
    });
  }

  // --- Control del Formulario ---
  openCreateForm(): void {
    this.platoIdToEdit = null;
    this.showForm = true;
  }

  openEditForm(id: number): void {
    this.platoIdToEdit = id;
    this.showForm = true;
  }

  handleFormSaved(): void {
    this.showForm = false;
    this.platoIdToEdit = null;
    this.cargarPlatos();
    this.successMessage = 'Plato guardado correctamente.';
    setTimeout(() => this.successMessage = '', 3000);
  }

  handleFormCancelled(): void {
    this.showForm = false;
    this.platoIdToEdit = null;
  }
}