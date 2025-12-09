import { Routes } from '@angular/router';

// Asegúrate de que estos nombres coincidan EXACTAMENTE con tus clases
import { LoginComponent } from './pages/login/login'; 
import { LayoutComponent } from './core/layout/layout'; 
import { DashboardComponent } from './pages/dashboard/dashboard'; 
import { GestionUsuariosComponent } from './pages/gestion-usuarios/gestion-usuarios'; 
import { GestionPlatosComponent } from './pages/gestion-platos/gestion-platos'; 
import { GestionReservasComponent } from './pages/gestion-reservas/gestion-reservas';
import { ReservaManualComponent } from './pages/reserva-manual/reserva-manual';
import { GestionMesasComponent } from './pages/gestion-mesas/gestion-mesas';

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
    path: 'admin', // <--- ¡AQUÍ ESTÁ EL CAMBIO! Añadimos el prefijo 'admin'
    component: LayoutComponent,
    canActivate: [authGuard], 
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent 
      },
      {
        path: 'usuarios',
        component: GestionUsuariosComponent 
      },
      {
        path: 'platos',
        component: GestionPlatosComponent
      },
      {
        path: 'reservas',
        component: GestionReservasComponent
      },
      {
        path: 'reserva-manual',
        component: ReservaManualComponent
      },
      {
        path: 'mesas',
        component: GestionMesasComponent
      },

      // Redirige la raíz de /admin a /admin/dashboard
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // --- Redirección de la raíz del sitio ---
  // Si entran a localhost:4200/, los mandamos a /admin/dashboard
  // (El guardia los detendrá si no están logueados)
  {
    path: '',
    redirectTo: 'admin/dashboard',
    pathMatch: 'full'
  },
  

  // Si no encuentra ninguna ruta, va al login
  { path: '**', redirectTo: '/login' }
];