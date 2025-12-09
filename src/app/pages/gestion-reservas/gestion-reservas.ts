import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router'; // <-- ¡IMPORTANTE! Para routerLink
import { Reserva } from '../../services/reserva';
import { Auth } from '../../services/auth'; // <-- ¡IMPORTANTE! Para saber el rol

@Component({
  selector: 'app-gestion-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // <-- Añadimos RouterModule
  templateUrl: './gestion-reservas.html',
  styleUrls: ['./gestion-reservas.css']
})
export class GestionReservasComponent implements OnInit {

  todasLasReservas: any[] = []; 
  reservasFiltradas: any[] = []; 
  
  isLoading: boolean = true;
  filtroActual: string = 'proximas';

  constructor(
    private reservaService: Reserva,
    public authService: Auth // <-- ¡PÚBLICO para usarlo en el HTML!
  ) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.isLoading = true;
    this.reservaService.getTodasLasReservas().subscribe({
      next: (data) => {
        console.log('Reservas Admin:', data);
        this.todasLasReservas = data;
        this.aplicarFiltro(this.filtroActual); 
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  aplicarFiltro(filtro: string): void {
    this.filtroActual = filtro;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); 
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1); 

    this.reservasFiltradas = this.todasLasReservas.filter(reserva => {
      const fechaReserva = new Date(reserva.fechaHora);
      const estado = reserva.estado.toUpperCase();
      const esCancelada = estado === 'CANCELADA';

      if (filtro === 'canceladas') return esCancelada;
      if (esCancelada) return false;

      if (filtro === 'hoy') return fechaReserva >= hoy && fechaReserva < manana;
      if (filtro === 'proximas') return fechaReserva >= hoy;
      if (filtro === 'historial') return fechaReserva < hoy;

      return true; 
    });
    
    this.reservasFiltradas.sort((a, b) => {
      const dateA = new Date(a.fechaHora).getTime();
      const dateB = new Date(b.fechaHora).getTime();
      return filtro === 'historial' ? dateB - dateA : dateA - dateB;
    });
  }

  cambiarEstado(reserva: any, nuevoEstado: string): void {
    if (!confirm(`¿Cambiar estado de la reserva a "${nuevoEstado}"?`)) return;

    this.reservaService.actualizarEstado(reserva.id, nuevoEstado).subscribe({
      next: () => {
        reserva.estado = nuevoEstado;
        this.aplicarFiltro(this.filtroActual);
      },
      error: (err) => console.error('Error al cambiar estado', err)
    });
  }
}