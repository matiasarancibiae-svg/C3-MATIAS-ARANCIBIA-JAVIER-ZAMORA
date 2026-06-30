export default defineEventHandler(async (event) => {
  const email = getRouterParam(event, "email");

  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });

  await prisma.usuario.update({
    data: {
      activo: !usuario?.activo,
    },
    where: { email },
  });

  return { ok: true };
});
