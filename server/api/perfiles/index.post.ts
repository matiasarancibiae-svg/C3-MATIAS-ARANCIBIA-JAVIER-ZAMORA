export default defineEventHandler(async (event) => {
  const { nombre } = await readBody(event);

  return await prisma.perfil.create({
    data: {
      nombre: nombre.trim(),
    },
  });
});