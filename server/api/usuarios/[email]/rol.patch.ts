export default defineEventHandler(async (event) => {
  const email = getRouterParam(event, "email");
  const { rol } = await readBody(event);

  await prisma.usuario.update({
    data: {
      rol: rol,
    },
    where: { email },
  });

  return { ok: true };
});
