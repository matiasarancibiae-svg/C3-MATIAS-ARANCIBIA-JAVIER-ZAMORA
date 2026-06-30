export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession();

  // rutas públicas
  const rutasPublicas = ["/login"];

  if (!loggedIn.value && !rutasPublicas.includes(to.path)) {
    return navigateTo("/login");
  }
});
