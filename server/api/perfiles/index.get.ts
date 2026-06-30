

export default defineEventHandler(async () => {
  const perfiles = await prisma.perfil.findMany({
    select: {
      id: true,
      nombre: true
    }
  })

  return perfiles
})