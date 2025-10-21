import { Injectable, Inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; // <-- La librería para leer el token

// (Opcional) Define una interfaz para lo que esperamos dentro del token
interface DecodedToken {
  sub: string; // "Subject" - este es el username o email que puso el backend
}

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private apiUrl = 'http://localhost:8080/api/auth';
  private tokenKey = 'mis_costillitas_token';
  private isBrowser: boolean;

  // Señal para saber si está logueado (true/false)
  isLoggedInSignal = signal<boolean>(false);
  // ¡NUEVA SEÑAL para guardar el nombre/email del usuario!
  currentUserSignal = signal<string | null>(null);

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    // Al iniciar la app, revisamos si ya existe un token
    if (this.isBrowser) {
      const token = this.getToken();
      if (token) {
        this.isLoggedInSignal.set(true);
        // Si hay token, lo leemos y guardamos el nombre de usuario
        this.decodeAndStoreUser(token);
      }
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  saveToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.tokenKey, token);
      // Actualizamos la señal de login
      this.isLoggedInSignal.set(true);
      // Leemos el token que acabamos de guardar y extraemos el nombre
      this.decodeAndStoreUser(token);
    }
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  isLoggedIn(): boolean {
    // Este método ya casi no lo usaremos, pero es bueno tenerlo
    return this.isLoggedInSignal();
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
      // Reseteamos ambas señales
      this.isLoggedInSignal.set(false);
      this.currentUserSignal.set(null);
    }
  }

  // --- ¡NUEVO MÉTODO PRIVADO! ---
  /**
   * Decodifica el token y guarda el 'subject' (username/email) en la señal.
   */
  private decodeAndStoreUser(token: string): void {
    try {
      const decodedToken: DecodedToken = jwtDecode(token);
      // Guardamos el 'sub' (subject) como el nombre de usuario actual
      this.currentUserSignal.set(decodedToken.sub);
    } catch (error) {
      console.error("Error decodificando el token:", error);
      // Si el token es inválido, reseteamos el nombre
      this.currentUserSignal.set(null);
    }
  }
}