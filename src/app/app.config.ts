import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

// Importaciones necesarias para HttpClient y el Interceptor
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

// Importa tu interceptor (asegúrate que la ruta sea correcta)
import { authTokenInterceptor } from './core/auth-token-interceptor'; // O './services/...'

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideRouter(routes),

    // Configura HttpClient y REGISTRA el interceptor
    provideHttpClient(withFetch(), withInterceptors([
      authTokenInterceptor
    ]))

    // ¡FormsModule NO va aquí!
  ]
};