import type { Usuario } from "~~/generated/prisma/client"

export interface Perfil{
    nombre: string,
    usuario: Usuario[]
}
