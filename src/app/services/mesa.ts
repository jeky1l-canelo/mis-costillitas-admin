import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MesaService { // (Debería ser MesaService)

  // 1. ¡Asegúrate de que esto apunte a /api/mesas!
  // (NO a /api/reservas)
  private apiUrl = 'http://Mis-costillitas-backend-env.eba-pweqgjah.us-east-2.elasticbeanstalk.com/api/mesas'; 

  constructor(private http: HttpClient) { }

  // --- MÉTODOS (Cliente/Admin) ---
  
  /**
   * Busca mesas disponibles.
   * La URL final debe ser: http://localhost:8080/api/mesas/disponibles
   */
  getMesasDisponibles(fecha: string, personas: number): Observable<any[]> {
    let params = new HttpParams()
      .set('fecha', fecha)
      .set('personas', personas.toString());
    
    // Al usar 'this.apiUrl' (que es .../mesas) + '/disponibles',
    // la petición irá al controlador correcto.
    return this.http.get<any[]>(`${this.apiUrl}/disponibles`, { params }); 
  }

  // ... (Tus otros métodos: getTodas, crearMesa, etc.)
  
  getTodas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearMesa(mesa: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, mesa);
  }

  actualizarMesa(id: number, mesa: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, mesa);
  }

  eliminarMesa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}