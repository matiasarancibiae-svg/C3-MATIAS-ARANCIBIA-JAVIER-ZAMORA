import type { TipoVehiculo } from "~~/generated/prisma/client";

export interface Vehiculo {
    id: number;
    modelo: string;
    precio: number;        // Cambiado de string a number (coincide con Int de Prisma)
    estado: string;
    tipoVehiculoId: number; // El ID es un número
    tipo?: TipoVehiculo;    // El objeto relacionado, opcional según el query
    descripcion: string;
    imagen?: string | null;
}