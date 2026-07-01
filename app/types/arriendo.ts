// types/arriendo.ts
import type { Vehiculo } from './vehiculo'; // Asegúrate de importar el tipo Vehiculo

export interface Arriendo {
    id: number;
    fechaInicio: Date | string;
    fechaFin: Date | string;
    usuarioEmail: string;
    vehiculoId: number;
    estado: string;
    vehiculo?: Vehiculo; // <--- Esta línea es la que permite que no marque error
    arriendos: Arriendo[];
    nombre: string;
}