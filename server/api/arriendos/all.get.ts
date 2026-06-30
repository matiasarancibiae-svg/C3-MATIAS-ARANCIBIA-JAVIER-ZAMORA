export default defineEventHandler(async (event) => {
    return await prisma.arriendo.findMany({
        include: { 
            vehiculo: true 
        },
        // Si el campo se llama distinto, verifícalo aquí
        orderBy: { fechaInicio: 'desc' }
    });
});