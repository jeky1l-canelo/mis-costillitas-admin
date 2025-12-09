import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core'; // 1. Importar Inject y PLATFORM_ID
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common'; // 2. Importar isPlatformBrowser

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private apiUrl = 'Mis-costillitas-backend-env.eba-pweqgjah.us-east-2.elasticbeanstalk.com/api/auth';
  private tokenKey = 'token'; 

  isLoggedInSignal = signal<boolean>(false);
  currentUserSignal = signal<string | null>(null);
  currentRoleSignal = signal<string | null>(null);

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object // 3. Inyectar el ID de la plataforma
  ) { 
    this.checkToken();
  }

  login(credentials: {usernameOrEmail: string, password: string}): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          // 4. Solo guardar si estamos en el navegador
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.tokenKey, response.token);
          }
          this.processToken(response.token);
        }
      })
    );
  }

  logout(): void {
    // 5. Solo borrar si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
    this.isLoggedInSignal.set(false);
    this.currentUserSignal.set(null);
    this.currentRoleSignal.set(null);
  }

  private checkToken(): void {
    // 6. Solo chequear si estamos en el navegador
    // ¡ESTA ES LA LÍNEA QUE TE ESTABA DANDO ERROR!
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(this.tokenKey);
      if (token) {
        this.processToken(token);
      } else {
        this.logout(); 
      }
    }
  }

  private processToken(token: string) {
    try {
      const payload = this.decodeToken(token);
      
      this.isLoggedInSignal.set(true);
      this.currentUserSignal.set(payload.sub); 
      this.currentRoleSignal.set(payload.role || payload.authorities || 'USER');
      
    } catch (error) {
      console.error('Error procesando token:', error);
      this.logout();
    }
  }

  private decodeToken(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }
  
  getRole(): string | null {
    return this.currentRoleSignal();
  }
}