// server/api/usuarios/[id].get.ts
export default defineEventHandler(async (event) => {
    const email = getRouterParam(event, 'id');

    return await prisma.usuario.findUnique({
        where: { email: email },
        include: {
            arriendos: {
                include: { vehiculo: true },
                orderBy: { fechaInicio: 'desc' }
            }
        }
    });
});