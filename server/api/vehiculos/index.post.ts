export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    // AGREGA ESTO PARA DEPURAR
    console.log("Cuerpo recibido:", body);
    console.log("Contenido de imagen:", body.imagen);

    const { modelo, precio, tipoVehiculoId, descripcion, imagen } = body;

    // LÓGICA DE LIMPIEZA DE IMAGEN:
    // Si 'imagen' es un objeto (lo que viene del UFileUpload), extraemos solo el nombre o ponemos null
    let imagenString: string | null = null;
    
    if (imagen && typeof imagen === 'object') {
        // Asumimos que el objeto tiene una propiedad 'name' o 'fileName'
        imagenString = imagen.name || imagen.fileName || null;
    } else if (typeof imagen === 'string') {
        imagenString = imagen;
    }

    return await prisma.vehiculo.create({
      data: {
        modelo: modelo.trim(),
        precio: parseInt(precio),
        descripcion: (descripcion || "").trim(),
        estado: "disponible",
        tipoVehiculoId: parseInt(tipoVehiculoId),
        imagen: imagenString, // ¡Ahora pasamos un String o Null!
      },
    });
  } catch (error) {
    console.error("Error detallado:", error);
    throw createError({ statusCode: 500, statusMessage: 'Error al insertar en la BD' });
  }
});