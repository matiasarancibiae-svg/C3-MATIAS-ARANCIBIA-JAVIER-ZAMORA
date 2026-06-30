export default defineEventHandler(async (event) => {
  const email = getRouterParam(event, "email");

  await prisma.usuario.delete({
    where: { email },
  });

  return { ok: true };
});
