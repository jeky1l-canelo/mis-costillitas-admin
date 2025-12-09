import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { authTokenInterceptor } from './core/auth-token-interceptor'; 

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideRouter(routes),

    // Configura HttpClient y REGISTRA el interceptor
    provideHttpClient(withFetch(), withInterceptors([
      authTokenInterceptor
    ]))

  ]
};