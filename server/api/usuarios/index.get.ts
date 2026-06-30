// server/api/usuarios/index.get.ts
export default defineEventHandler(async () => {
    return await prisma.usuario.findMany({
        orderBy: { email: 'asc' },
        include: { 
            perfil: true,
            arriendos: {          // <--- Incluye los arriendos
                include: {
                    vehiculo: true // <--- Incluye el vehículo relacionado a cada arriendo
                }
            }
        }
    })
})