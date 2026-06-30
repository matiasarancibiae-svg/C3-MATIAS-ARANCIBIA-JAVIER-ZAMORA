export default defineNuxtRouteMiddleware(() => {
  const { user } = useUserSession();

  if (user.value?.rol !== "Administrador" && user.value?.rol !== "Ejecutivo") {
    throw createError({ statusCode: 403, message: "Acceso denegado" });
  }
});
