// server/api/usuarios/index.get.ts
export default defineEventHandler(async (event) => {
  return await prisma.usuario.findMany({
    include: {
      arriendos: {
        include: {
          vehiculo: true // Esto trae la información del auto asociada al arriendo
        }
      }
    }
  });
});