import { inject, PLATFORM_ID } from '@angular/core'; // 1. Importar PLATFORM_ID
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth'; 
import { isPlatformBrowser } from '@angular/common'; // 2. Importar isPlatformBrowser

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID); // 3. Inyectar platformId

  // Verificamos si la señal dice que está logueado
  if (authService.isLoggedInSignal()) {
    return true; 
  }

  // 4. Solo verificar localStorage si estamos en el NAVEGADOR
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token');
    if (token) {
      return true; 
    }
  }

  // Si no hay nada, pafuera
  // (Nota: En el servidor esto redirigirá, lo cual es correcto para rutas protegidas)
  router.navigate(['/login']);
  return false;
};