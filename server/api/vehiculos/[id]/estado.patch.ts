export default defineEventHandler(async (event) => {
  const vehiculoId = getRouterParam(event, 'id');
  const body = await readBody(event);
  const idNum = Number(vehiculoId);

  // LOG de control para depurar en tu consola de VS Code
  console.log("Payload recibido:", body);

  // 1. ACTUALIZACIÓN DE ESTADO DEL VEHÍCULO (Opcional, si envías el estado)
  if (body.estado) {
    await prisma.vehiculo.update({
      where: { id: idNum },
      data: { estado: body.estado }
    });
  }

  // 2. ACTUALIZACIÓN DE ARRIENDO
  // Buscamos el último arriendo para evitar el error 404
  if (body.fechaEntrega || body.fechaRecepcion) {
    const arriendo = await prisma.arriendo.findFirst({
      where: { vehiculoId: idNum },
      orderBy: { id: 'desc' } // Siempre tomamos el último registro relacionado
    });

    if (!arriendo) {
      throw createError({ 
        statusCode: 404, 
        statusMessage: 'No se encontró un arriendo asociado a este vehículo.' 
      });
    }

    const dataToUpdate: any = {};
    const ahora = new Date(); // Hora actual para evitar 00:00:00

    // LÓGICA DE RECEPCIÓN
    if (body.fechaRecepcion) {
      const fechaRec = new Date(body.fechaRecepcion);
      fechaRec.setHours(ahora.getHours(), ahora.getMinutes(), ahora.getSeconds());
      
      dataToUpdate.fechaRecepcion = fechaRec;
      dataToUpdate.fotosRecepcion = body.fotosRecepcion;
      dataToUpdate.estado = 'finalizado';
      
      // Liberar vehículo
      await prisma.vehiculo.update({
        where: { id: idNum },
        data: { estado: 'disponible' }
      });
    } 
    // LÓGICA DE ENTREGA
    else if (body.fechaEntrega) {
      const fechaEnt = new Date(body.fechaEntrega);
      fechaEnt.setHours(ahora.getHours(), ahora.getMinutes(), ahora.getSeconds());
      
      dataToUpdate.fechaEntrega = fechaEnt;
      dataToUpdate.fotosEntrega = body.fotosEntrega;
      dataToUpdate.estado = 'vigente';
    }

    // Ejecutar actualización
    await prisma.arriendo.update({
      where: { id: arriendo.id },
      data: dataToUpdate
    });
  }

  return { success: true };
});