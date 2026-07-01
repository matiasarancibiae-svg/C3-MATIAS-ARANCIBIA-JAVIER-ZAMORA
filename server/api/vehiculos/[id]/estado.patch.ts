export default defineEventHandler(async (event) => {
  const vehiculoId = getRouterParam(event, 'id');
  const body = await readBody(event);
  const idNum = Number(vehiculoId);

  // 1. ACTUALIZACIÓN DE ESTADO (Siempre se ejecuta)
  // Esto permite cambiar el estado del vehículo sin depender de arriendos.
  if (body.estado) {
    await prisma.vehiculo.update({
      where: { id: idNum },
      data: { estado: body.estado }
    });
  }

  // 2. ACTUALIZACIÓN DE ARRIENDO (Solo si se envían datos de entrega o recepción)
  if (body.fechaEntrega || body.fechaRecepccion) {
    const arriendo = await prisma.arriendo.findFirst({
      where: { vehiculoId: idNum, estado: 'vigente' }
    });

    if (arriendo) {
      const dataToUpdate: any = {};
      if (body.fechaRecepccion) {
        dataToUpdate.fechaRecepccion = new Date(body.fechaRecepccion);
        dataToUpdate.fotosRecepccion = body.fotosRecepccion;
        dataToUpdate.estado = 'finalizado';
      } else {
        dataToUpdate.fechaEntrega = new Date(body.fechaEntrega);
        dataToUpdate.fotosEntrega = body.fotosEntrega;
      }

      await prisma.arriendo.update({
        where: { id: arriendo.id },
        data: dataToUpdate
      });
    } else {
      // Opcional: lanzar error solo si SÍ intentamos registrar una entrega
      throw createError({ statusCode: 404, statusMessage: 'No se encontró un arriendo vigente.' });
    }
  }

  return { success: true };
});
