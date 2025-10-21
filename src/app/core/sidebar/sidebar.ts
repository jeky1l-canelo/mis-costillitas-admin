import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // ¡Importa RouterLink!
import { CommonModule } from '@angular/common'; // Para usar *ngIf (si lo necesitas después)

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule, // Añade CommonModule por si acaso
    RouterLink   // ¡Añade RouterLink!
  ],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent { // O SidebarComponent
  // Por ahora, no necesita lógica extra aquí
}