export interface Plato {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  disponible: boolean;
  imagenUrl?: string; // El ? significa que es opcional
}