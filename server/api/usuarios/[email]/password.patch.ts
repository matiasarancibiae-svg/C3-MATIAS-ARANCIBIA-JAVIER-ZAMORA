import bcrypt from "bcryptjs";

export default defineEventHandler(async (event) => {
  const email = getRouterParam(event, "email");
  const { password } = await readBody(event);

  const hash = await bcrypt.hash(password, 12);

  await prisma.usuario.update({
    data: {
      password: hash,
    },
    where: { email },
  });

  return { ok: true };
});
