import type { Vehiculo } from "~~/generated/prisma/client";

export interface TipoVehiculo {
    id: number;
    nombre: string;
    vehiculos?: Vehiculo[]; // Opcional, por si haces un include en el futuro
}