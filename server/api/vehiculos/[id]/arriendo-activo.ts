export default defineEventHandler(async (event) => {
  const vehiculoId = getRouterParam(event, 'id');
  
  // Buscamos el último arriendo
  return await prisma.arriendo.findFirst({
    where: { vehiculoId: Number(vehiculoId) },
    orderBy: { id: 'desc' },
    include: { usuario: true } // Opcional: trae datos del cliente
  });
});