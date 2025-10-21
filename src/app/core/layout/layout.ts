import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // Para el <router-outlet>
import { SidebarComponent } from '../sidebar/sidebar'; // ¡Importa el Sidebar!

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent // ¡Añádelo aquí!
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class LayoutComponent { }