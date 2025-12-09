import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plato } from '../core/models/plato';
import { PedidoRequest } from '../core/models/pedido-request';
import { EstadoRequest } from '../core/models/estado-request';

@Injectable({
  providedIn: 'root'
})
export class Reserva {

  // --- CAMBIO IMPORTANTE ---
  // URL base limpia, sin '/reservas'
  private apiUrl = 'Mis-costillitas-backend-env.eba-pweqgjah.us-east-2.elasticbeanstalk.com/api';

  constructor(private http: HttpClient) { }

  // --- MÉTODOS DE CLIENTE ---
  getMisReservas(): Observable<any[]> {
    // Añadimos /reservas aquí
    return this.http.get<any[]>(`${this.apiUrl}/reservas/mis-reservas`);
  }

  crearReservaCliente(datosReserva: any): Observable<any> { 
    return this.http.post<any>(`${this.apiUrl}/reservas`, datosReserva);
  }
 
  cancelarReserva(id: number): Observable<void> { 
    return this.http.delete<void>(`${this.apiUrl}/reservas/${id}`);
  }

  getMenuDisponible(): Observable<Plato[]> {
    // Este usa /platos, así que está bien que la base sea solo /api
    return this.http.get<Plato[]>(`${this.apiUrl}/platos`);
  }

  agregarPlatoAReserva(reservaId: number, pedido: PedidoRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/reservas/${reservaId}/platos`, pedido);
  }
  
  getReservaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reservas/${id}`);
  }

  modificarReservaCliente(id: number, datosReserva: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/reservas/${id}`, datosReserva);
  }

  // --- MÉTODOS PARA ADMIN / ENCARGADO ---

  /**
   * Obtiene TODAS las reservas del sistema
   */
  getTodasLasReservas(): Observable<any[]> {
    // --- AQUÍ ESTABA EL ERROR DE DUPLICADO ---
    // Correcto: /api + /reservas/todas
    return this.http.get<any[]>(`${this.apiUrl}/reservas/todas`);
  }

  /**
   * Cambia el estado de una reserva
   */
  actualizarEstado(id: number, nuevoEstado: string): Observable<any> {
    const body: EstadoRequest = { estado: nuevoEstado };
    return this.http.patch<any>(`${this.apiUrl}/reservas/${id}/estado`, body);
  }
  
  /**
   * Crea una reserva manual
   */
  crearReservaPersonal(datosReserva: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reservas/personal`, datosReserva);
  }
}