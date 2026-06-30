export default defineEventHandler(async (event) => {
    return await prisma.tipoVehiculo.findMany({
        orderBy: { nombre: 'asc' }
    });
})