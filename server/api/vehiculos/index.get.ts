export default defineEventHandler(async (event) => {
  return await prisma.vehiculo.findMany({
    include: {
      tipo: true // Esto traerá también la información del tipo de vehículo
    }
  })
})