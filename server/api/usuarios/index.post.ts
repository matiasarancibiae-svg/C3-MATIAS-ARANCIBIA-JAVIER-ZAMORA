import bcrypt from "bcryptjs";

export default defineEventHandler(async (event) => {
  const { email, password, nombreCompleto, activo, perfilId } = await readBody(event);

  // 🔥 1. Buscar el perfil
  const perfil = await prisma.perfil.findUnique({
    where: { id: parseInt(perfilId) }
  });

  if (!perfil) {
    throw createError({
      statusCode: 400,
      statusMessage: "Perfil no válido"
    });
  }

  // 🔐 Hash contraseña
  const hash = await bcrypt.hash(password, 12);

  // 💾 Crear usuario
  await prisma.usuario.create({
    data: {
      email: email.trim(),
      password: hash,
      nombreCompleto: nombreCompleto.trim(),
      activo: activo,
      perfilId: parseInt(perfilId),
      rol: perfil.nombre // 🔥 AQUÍ ESTÁ LA CLAVE
    },
  });

  return { ok: true };
});