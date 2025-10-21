import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth'; // Asegúrate que esta ruta a tu servicio Auth sea correcta

// ¡Este es el guardia que añade el token!
export const authTokenInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(Auth); // Obtiene el servicio Auth
  const authToken = authService.getToken(); // Pide el token guardado

  // Si hay token...
  if (authToken) {
    // Clona la petición y añade la cabecera Authorization
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
    // Envía la petición clonada
    return next(authReq);
  }

  // Si no hay token, envía la petición original
  return next(req);
};