import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router'; // <-- ¡CRUCIAL! Sin esto, no carga nada dentro
import { SidebarComponent } from '../sidebar/sidebar'; // <-- Importa tu Sidebar

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,     // <-- ¡NECESARIO!
    SidebarComponent  // <-- ¡NECESARIO!
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class LayoutComponent {
  // No necesita lógica extra por ahora, solo ser el contenedor
}