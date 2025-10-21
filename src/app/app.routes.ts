import { Routes } from '@angular/router';

// Asegúrate de que estos nombres coincidan EXACTAMENTE con tus clases
import { LoginComponent } from './pages/login/login';
import { LayoutComponent } from './core/layout/layout';
import { DashboardComponent } from './pages/dashboard/dashboard'; // O Dashboard si se llama así
import { GestionUsuariosComponent } from './pages/gestion-usuarios/gestion-usuarios'; // O GestionUsuarios

// Importa el guardia
import { authGuard } from './core/auth-guard';
export const routes: Routes = [
  // --- Ruta de Login (pública) ---
  {
    path: 'login',
    component: LoginComponent
  },

  // --- Rutas DENTRO del Layout (protegidas) ---
  {
    path: '', // Ruta padre del layout
    component: LayoutComponent,
    canActivate: [authGuard], // <-- ¡Protege todo lo que está dentro!
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent // O Dashboard
      },
      // --- ¡Ruta de Usuarios DESCOMENTADA y correcta! ---
      {
        path: 'usuarios',
        component: GestionUsuariosComponent // O GestionUsuarios
      },
      // --- Fin ruta usuarios ---

      // Redirige la raíz a /dashboard SI YA ESTÁS DENTRO del layout
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Si no encuentra ninguna ruta, va al login
  { path: '**', redirectTo: '/login' }
];