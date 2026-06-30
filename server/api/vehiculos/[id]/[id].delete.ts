// server/api/vehiculos/[id].delete.ts
export default defineEventHandler(async (event) => {
  // Obtenemos el ID que viene en la URL, igual que el ejemplo del email
  const id = getRouterParam(event, "id");

  // Eliminamos el registro usando el ID
  await prisma.vehiculo.delete({
    where: { 
        id: parseInt(id!) // Convertimos a número porque el ID es Int
    },
  });

  return { ok: true };
});