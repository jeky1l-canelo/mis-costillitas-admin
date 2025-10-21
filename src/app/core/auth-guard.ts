import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth'; // ¡Importa el servicio Auth!

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth); // Usa el servicio
  const router = inject(Router);

  // Revisa la señal del servicio
  if (authService.isLoggedInSignal()) {
    return true; // Sí puede pasar
  } else {
    // No está logueado, redirige a /login
    router.navigate(['/login']);
    return false; // No puede pasar
  }
};