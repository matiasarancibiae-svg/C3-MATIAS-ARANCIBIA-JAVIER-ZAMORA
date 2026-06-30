import type { Usuario } from "./usuario";

declare module "#auth-utils" {
  interface User extends Usuario {}
}
