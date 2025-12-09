import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../services/auth'; // Tu servicio de Auth

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ CommonModule, RouterLink, RouterLinkActive ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent {

  constructor(
    @Inject(Auth) public authService: Auth, // Público para usarlo en el HTML
    private router: Router
  ) {}

  logout(): void {
    if(confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}