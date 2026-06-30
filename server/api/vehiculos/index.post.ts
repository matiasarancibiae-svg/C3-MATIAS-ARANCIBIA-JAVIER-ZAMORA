export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { modelo, precio, tipoVehiculoId, descripcion } = body;

    return await prisma.vehiculo.create({
      data: {
        modelo: modelo.trim(),
        precio: parseInt(precio),
        // Si la descripción viene como undefined, guardamos un string vacío
        descripcion: (descripcion || "").trim(),
        estado: "disponible",
        tipoVehiculoId: parseInt(tipoVehiculoId)
      },
    });
  } catch (error) {
    console.error("Error detallado en el servidor:", error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al insertar en la BD',
    });
  }
});
