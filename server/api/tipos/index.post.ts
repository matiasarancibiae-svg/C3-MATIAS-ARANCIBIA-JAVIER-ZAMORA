export default defineEventHandler(async (event) => {
  const { nombre } = await readBody(event);

  return await prisma.tipoVehiculo.create({
    data: {
      nombre: nombre.trim(),
    },
  });
});