import bcrypt from "bcryptjs";

export default defineEventHandler(async (event) => {
  // obtener email y password que ingresó el usuario
  const { email, password } = await readBody(event);

  // revisar que usuario haya escrito email y password
  if (!email || !password) {
    throw createError({ statusCode: 401, message: "Credenciales no son válidas" });
  }

  // revisar si hay una cuenta con el email indicado
  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });
  if (!usuario) {
    throw createError({ statusCode: 401, message: "Credenciales no son válidas" });
  }

  // revisar si password es correcto
  const passwordValido = await bcrypt.compare(password, usuario.password);
  if (!passwordValido) {
    throw createError({ statusCode: 401, message: "Credenciales no son válidas" });
  }

  // revisar si la cuenta está activa
  if (!usuario.activo) {
    throw createError({ statusCode: 401, message: "Acceso al sistema suspendido" });
  }

  // Guardar sesión con nuxt-auth-utils
  await setUserSession(event, {
    user: {
      email: usuario.email,
      nombreCompleto: usuario.nombreCompleto,
      activo: usuario.activo,
      rol: usuario.rol,
    },
  });

  return { ok: true };
});
