import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plato } from '../core/models/plato'; // Asegúrate de importar la interfaz correcta

@Injectable({
  providedIn: 'root'
})
export class PlatoService {

  // URL base de tu backend (ajusta el puerto si es necesario)
  private apiUrl = 'Mis-costillitas-backend-env.eba-pweqgjah.us-east-2.elasticbeanstalk.com/api/platos';

  constructor(private http: HttpClient) { }

  // --- MÉTODOS PÚBLICOS (Para el cliente) ---

  /**
   * Obtiene solo los platos disponibles (para el menú del cliente)
   * GET /api/platos
   */
  getMenuDisponible(): Observable<Plato[]> {
    return this.http.get<Plato[]>(this.apiUrl);
  }

  // --- MÉTODOS DE ADMIN (Para el panel de gestión) ---

  /**
   * Obtiene TODOS los platos (incluidos los ocultos/no disponibles)
   * Requiere rol ADMIN
   * GET /api/platos/admin/todos
   */
  getTodosLosPlatosAdmin(): Observable<Plato[]> {
    return this.http.get<Plato[]>(`${this.apiUrl}/admin/todos`);
  }

  /**
   * Obtiene un plato por su ID (para editarlo)
   * GET /api/platos/{id}
   */
  getPlatoById(id: number): Observable<Plato> {
    return this.http.get<Plato>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo plato
   * POST /api/platos
   */
  crearPlato(plato: Plato): Observable<Plato> {
    return this.http.post<Plato>(this.apiUrl, plato);
  }

  /**
   * Actualiza un plato existente
   * PUT /api/platos/{id}
   */
  actualizarPlato(id: number, plato: Plato): Observable<Plato> {
    return this.http.put<Plato>(`${this.apiUrl}/${id}`, plato);
  }

  /**
   * Elimina un plato
   * DELETE /api/platos/{id}
   */
  eliminarPlato(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}