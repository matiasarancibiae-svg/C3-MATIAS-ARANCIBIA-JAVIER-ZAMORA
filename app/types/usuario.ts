import type { Arriendo } from './arriendo';
export interface Usuario{
    nombreCompleto: string
    rol: string
    activo: boolean
    email: string
    arriendos?: Arriendo[]
}