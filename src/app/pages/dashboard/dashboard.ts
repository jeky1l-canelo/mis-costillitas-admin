import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router'; // <-- Importante para los accesos rápidos
import { Auth } from '../../services/auth';
import { UsuarioService } from '../../services/usuario';
import { Reserva } from '../../services/reserva';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink], // <-- Añadimos RouterLink
  providers: [DatePipe], 
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  rolUsuario: string | null = null;
  isLoading: boolean = true;

  // Contadores
  totalUsuarios: number = 0;
  totalReservas: number = 0;
  reservasHoy: number = 0;
  reservasConfirmadas: number = 0;
  reservasCanceladas: number = 0;
  
  // --- NUEVO: Variables para los gráficos ---
  pctConfirmadas: number = 0;
  pctCanceladas: number = 0;

  listaReservas: any[] = [];

  constructor(
    public authService: Auth,
    private usuarioService: UsuarioService,
    private reservaService: Reserva,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.rolUsuario = this.authService.getRole();
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.isLoading = true;

    if (this.isAdmin()) {
      this.usuarioService.getUsuarios().subscribe({
        next: (data) => this.totalUsuarios = data.length,
        error: (err) => console.error('Error usuarios', err)
      });
    }

    this.reservaService.getTodasLasReservas().subscribe({
      next: (data) => {
        this.listaReservas = data;
        this.calcularEstadisticas(data);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error reservas', err);
        this.isLoading = false;
      }
    });
  }

  calcularEstadisticas(reservas: any[]): void {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    this.totalReservas = reservas.length;

    this.reservasHoy = reservas.filter(r => {
      const fechaR = new Date(r.fechaHora);
      return fechaR >= hoy && fechaR < manana && r.estado !== 'Cancelada';
    }).length;

    this.reservasConfirmadas = reservas.filter(r => r.estado === 'Confirmada').length;
    this.reservasCanceladas = reservas.filter(r => r.estado === 'Cancelada').length;

    // --- NUEVO: Cálculo de Porcentajes para Gráficos ---
    if (this.totalReservas > 0) {
      this.pctConfirmadas = (this.reservasConfirmadas / this.totalReservas) * 100;
      this.pctCanceladas = (this.reservasCanceladas / this.totalReservas) * 100;
    }
  }

  generarReportePDF(): void {
    const doc = new jsPDF();
    const fechaImpresion = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();

    doc.setFontSize(20);
    doc.setTextColor(192, 57, 43);
    doc.text('Mis Costillitas - Reporte de Reservas', 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generado por: ${this.authService.currentUserSignal() || 'Sistema'}`, 14, 30);
    doc.text(`Fecha: ${fechaImpresion}`, 14, 35);

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Total Reservas: ${this.totalReservas}`, 14, 45);
    doc.text(`Confirmadas: ${this.reservasConfirmadas}`, 70, 45);
    doc.text(`Canceladas: ${this.reservasCanceladas}`, 130, 45);

    const cuerpoTabla = this.listaReservas.map(reserva => [
      reserva.id,
      this.datePipe.transform(reserva.fechaHora, 'dd/MM/yyyy HH:mm'),
      reserva.nombreReserva || reserva.clienteEmail || 'N/A',
      reserva.telefonoReserva || '-',
      reserva.cantidadPersonas,
      reserva.estado
    ]);

    autoTable(doc, {
      head: [['ID', 'Fecha', 'Cliente', 'Teléfono', 'Pers.', 'Estado']],
      body: cuerpoTabla,
      startY: 50,
      theme: 'grid',
      headStyles: { fillColor: [192, 57, 43] },
      styles: { fontSize: 9 }
    });

    doc.save(`Reporte_Reservas_${new Date().getTime()}.pdf`);
  }

  isAdmin(): boolean {
    return this.rolUsuario === 'ROLE_ADMIN';
  }
  
  canDownloadReport(): boolean {
      return this.rolUsuario === 'ROLE_ADMIN' || this.rolUsuario === 'ROLE_ENCARGADO';
  }
}