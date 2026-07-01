export default defineEventHandler(async (event) => {
  const vehiculoId = getRouterParam(event, 'id');
  const body = await readBody(event);
  
  // 1. CAMBIO IMPORTANTE: Buscamos el último arriendo del vehículo, 
  // no solo los 'vigentes'. Si quieres ser más específico, podrías filtrar 
  // por el que no tenga fecha de recepción.
  const arriendo = await prisma.arriendo.findFirst({
    where: { 
        vehiculoId: Number(vehiculoId) 
    },
    orderBy: { id: 'desc' } // Traemos el más reciente
  });

  if (!arriendo) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No se encontró ningún arriendo para este vehículo.'
    });
  }

  // 2. Preparamos los datos
  const dataToUpdate: any = {};
  if (body.fechaRecepccion) {
    dataToUpdate.fechaRecepccion = new Date(body.fechaRecepccion);
    dataToUpdate.fotosRecepccion = body.fotosRecepccion;
    dataToUpdate.estado = 'finalizado';
  } else if (body.fechaEntrega) {
    dataToUpdate.fechaEntrega = new Date(body.fechaEntrega);
    dataToUpdate.fotosEntrega = body.fotosEntrega;
    dataToUpdate.estado = 'vigente'; // Marcamos como vigente al entregar
  }

  // 3. Actualizamos
  return await prisma.arriendo.update({
    where: { id: arriendo.id },
    data: dataToUpdate
  });
});