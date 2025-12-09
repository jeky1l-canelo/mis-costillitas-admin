import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MesaService } from '../../services/mesa'; 
import { Reserva } from '../../services/reserva'; 

@Component({
  selector: 'app-reserva-manual',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reserva-manual.html',
  styleUrls: ['./reserva-manual.css']
})
export class ReservaManualComponent implements OnInit {

  // Datos del Formulario
  fecha: string = '';
  hora: string = '';
  cantidadPersonas: number = 1;
  nombreCliente: string = '';
  telefonoCliente: string = '';
  
  // --- Estado del Mapa ---
  todasLasMesas: any[] = []; // Copia maestra de todas las mesas (sin filtrar)
  
  // Diccionario para agrupar: "Salon Central" -> [Mesa 1, Mesa 2...]
  mesasPorSalon: Map<string, any[]> = new Map();
  
  // Lista ordenada de salones para mostrarlos en orden
  salonesOrdenados: string[] = ['Salón Ventanal', 'Salón Central', 'Salón Interior', 'Salón Terraza'];

  mesasOcupadasIds: number[] = [];
  mesaSeleccionadaIds: number[] = [];
  
  isLoading: boolean = false;
  busquedaRealizada: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  today: string = new Date().toISOString().split('T')[0];

  constructor(
    @Inject(MesaService) private mesaService: MesaService,
    private reservaService: Reserva,
    private router: Router
  ) {
    this.fecha = this.today;
    const now = new Date();
    now.setHours(now.getHours() + 1, 0, 0, 0);
    this.hora = now.toTimeString().substring(0, 5);
  }

  ngOnInit(): void {
    this.cargarMapaBase();
  }

  cargarMapaBase(): void {
    this.mesaService.getTodas().subscribe({
      next: (data) => {
        // Guardamos la lista maestra
        this.todasLasMesas = data;
        // Organizamos el mapa inicial
        this.actualizarMapaVisual();
      },
      error: (err) => console.error('Error cargando mesas', err)
    });
  }

  // --- ¡MAGIA NUEVA! Agrupa y Filtra ---
  actualizarMapaVisual(): void {
    // 1. Limpiamos el mapa actual
    this.mesasPorSalon.clear();

    // 2. Filtramos: Solo mesas donde quepan las personas
    // (Si pones 8, las de 4 desaparecen)
    const mesasFiltradas = this.todasLasMesas.filter(mesa => 
      mesa.capacidad >= this.cantidadPersonas
    );

    // 3. Agrupamos por Salón (Ubicación)
    mesasFiltradas.forEach(mesa => {
      const salon = mesa.ubicacion || 'Otros';
      
      if (!this.mesasPorSalon.has(salon)) {
        this.mesasPorSalon.set(salon, []);
      }
      this.mesasPorSalon.get(salon)!.push(mesa);
    });

    // 4. Ordenamos las mesas dentro de cada salón por número
    this.mesasPorSalon.forEach((listaMesas) => {
      listaMesas.sort((a, b) => a.numeroMesa - b.numeroMesa);
    });
  }
  
  // Este método ayuda al HTML a iterar sobre el mapa
  get salonesDisponibles() {
    // Filtramos para mostrar solo los salones que tienen mesas visibles
    return this.salonesOrdenados.filter(salon => this.mesasPorSalon.has(salon));
  }

  // --- DISPONIBILIDAD (Backend) ---
  verificarDisponibilidad(): void {
    if (!this.fecha || !this.hora) {
      this.errorMessage = 'Selecciona fecha y hora.';
      return;
    }

    this.isLoading = true;
    this.busquedaRealizada = false;
    this.mesaSeleccionadaIds = []; 
    this.errorMessage = '';

    const fechaHoraISO = `${this.fecha}T${this.hora}:00`;

    // Pedimos disponibilidad para 1 persona (truco para recibir TODO lo libre)
    // Luego nosotros filtraremos visualmente con 'actualizarMapaVisual'
    this.mesaService.getMesasDisponibles(fechaHoraISO, 1).subscribe({ 
      next: (disponiblesData) => {
        const idsLibres = new Set<number>();
        disponiblesData.forEach((opcion: any) => {
           opcion.mesas.forEach((m: any) => idsLibres.add(m.id));
        });

        // Calculamos ocupadas
        this.mesasOcupadasIds = this.todasLasMesas
          .filter(m => !idsLibres.has(m.id))
          .map(m => m.id);

        this.isLoading = false;
        this.busquedaRealizada = true;
        
        // ¡IMPORTANTE! Refrescamos el mapa visual
        this.actualizarMapaVisual();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al consultar disponibilidad.';
        this.isLoading = false;
      }
    });
  }

  toggleMesa(mesa: any): void {
    if (this.isOcupada(mesa.id)) return; 

    const index = this.mesaSeleccionadaIds.indexOf(mesa.id);
    if (index >= 0) {
      this.mesaSeleccionadaIds.splice(index, 1); 
    } else {
      this.mesaSeleccionadaIds.push(mesa.id); 
    }
  }

  isOcupada(id: number): boolean {
    return this.mesasOcupadasIds.includes(id);
  }

  isSelected(id: number): boolean {
    return this.mesaSeleccionadaIds.includes(id);
  }

  crearReservaManual(): void {
    if (this.mesaSeleccionadaIds.length === 0) {
      alert('Debes seleccionar al menos una mesa.');
      return;
    }
    if (!this.nombreCliente || !this.telefonoCliente) {
      alert('Faltan datos del cliente.');
      return;
    }

    const datos = {
      fechaHora: `${this.fecha}T${this.hora}:00`,
      cantidadPersonas: this.cantidadPersonas,
      mesaIds: this.mesaSeleccionadaIds,
      nombreReserva: this.nombreCliente,
      telefonoReserva: this.telefonoCliente, 
      tipoReserva: 'TELEFONO'
    };

    this.reservaService.crearReservaPersonal(datos).subscribe({
      next: (resp) => {
        this.successMessage = `Reserva creada #${resp.id}`;
        setTimeout(() => {
            this.router.navigate(['/admin/reservas']);
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = 'Error: ' + (err.error?.message || 'Desconocido');
      }
    });
  }
}