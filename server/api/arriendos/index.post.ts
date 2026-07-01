// server/api/arriendos/index.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  // Imprime el body completo para ver qué llega desde el frontend
  console.log("Datos recibidos en el servidor:", body);

  const userEmail = body.usuarioEmail;
  const vehiculoId = Number(body.vehiculoId);
  // Aquí capturamos el valor. Si no viene, el servidor está ciego.
  const valor = Number(body.valor); 
  const userName = body.nombre; // Capturamos el nombre enviado desde el frontend

  if (!userEmail || !vehiculoId) {
      throw createError({ statusCode: 400, statusMessage: "Faltan datos obligatorios" });
  }

  return await prisma.$transaction([
    prisma.arriendo.create({
      data: {
        fechaInicio: new Date(),
        fechaFin: new Date(Date.now() + 86400000),
        usuarioEmail: userEmail,
        nombre: userName,
        vehiculoId: vehiculoId,
        valor: valor, // <--- Aquí se asigna el valor recibido
        estado: 'vigente'
        
      }
    }),
    prisma.vehiculo.update({
      where: { id: vehiculoId },
      data: { estado: 'arrendado' }
    })
  ]);
});