// server/api/arriendos/[id].ts
export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const id = getRouterParam(event, 'id');

  if (method === 'DELETE') {
    return await prisma.arriendo.delete({ where: { id: Number(id) } });
  }
  
  if (method === 'PATCH') {
    const body = await readBody(event);
    return await prisma.arriendo.update({
      where: { id: Number(id) },
      data: { estado: body.estado }
    });
  }
});