import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// Import your DTOs if you create them in Angular
// import { UsuarioResponse } from '../dto/usuario-response';
// import { UsuarioRequest } from '../dto/usuario-request';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:8080/api/usuarios'; // Base URL for users API

  constructor(private http: HttpClient) { }

  /**
   * Gets all staff users from the backend.
   * Token is added automatically by the interceptor.
   */
  getUsuarios(): Observable<any[]> { // Replace any[] with UsuarioResponse[]
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * Gets a single staff user by ID.
   */
  getUsuario(id: number): Observable<any> { // Replace any with UsuarioResponse
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Creates a new staff user.
   */
  crearUsuario(usuarioData: any): Observable<any> { // Replace any with UsuarioRequest/UsuarioResponse
    return this.http.post<any>(this.apiUrl, usuarioData);
  }

  /**
   * Updates an existing staff user.
   */
  actualizarUsuario(id: number, usuarioData: any): Observable<any> { // Replace any with UsuarioRequest/UsuarioResponse
    return this.http.put<any>(`${this.apiUrl}/${id}`, usuarioData);
  }

  /**
   * Deletes a staff user by ID.
   */
  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}