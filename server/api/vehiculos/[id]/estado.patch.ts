// server/api/vehiculos/[id]/estado.patch.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id'); // Obtiene el valor de la carpeta [id]
  const body = await readBody(event);

  return await prisma.vehiculo.update({
    where: { id: parseInt(id!) },
    data: { estado: body.estado }
  });
});