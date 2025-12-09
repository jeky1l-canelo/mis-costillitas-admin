import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlatoService } from '../../services/plato';

@Component({
  selector: 'app-plato-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plato-form.html',
  styleUrls: ['./plato-form.css'] // Puedes usar el mismo CSS que usuario-form
})
export class PlatoFormComponent implements OnInit {

  @Input() platoId: number | null = null;
  @Output() onSave = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  platoData: any = {
    nombre: '',
    descripcion: '',
    precio: 0,
    categoria: 'Entrada',
    imagenUrl: '',
    disponible: true
  };

  categorias: string[] = [
    'Entrada', 'Plato de la Carta', 'Parrilla para Compartir', 
    'Adicional', 'Postre', 'Menu de Niño', 'Bebida'
  ];

  isEditMode: boolean = false;
  isLoading: boolean = false;

  constructor(private platoService: PlatoService) {}

  ngOnInit(): void {
    if (this.platoId) {
      this.isEditMode = true;
      this.isLoading = true;
      this.platoService.getPlatoById(this.platoId).subscribe({
        next: (data) => {
          this.platoData = data;
          this.isLoading = false;
        },
        error: (err) => this.isLoading = false
      });
    }
  }

  save(): void {
    this.isLoading = true;
    const request = this.isEditMode 
      ? this.platoService.actualizarPlato(this.platoId!, this.platoData)
      : this.platoService.crearPlato(this.platoData);

    request.subscribe({
      next: () => {
        this.isLoading = false;
        this.onSave.emit();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        alert('Error al guardar');
      }
    });
  }
}