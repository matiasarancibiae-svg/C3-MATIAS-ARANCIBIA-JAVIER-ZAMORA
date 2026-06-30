<script setup lang="ts">
import { z } from 'zod'

definePageMeta({
    middleware: ['admin']
})

import type { Usuario } from '../types/usuario'

const { data: usuarios, pending, error, refresh, refresh:refreshUsuarios } = await useFetch<Usuario[]>('/api/usuarios')

/* AGREGAR USUARIO */
const schemaNuevoUsuario = z.object({
    email: z.string().email({ message: 'Ingresa un correo válido' }),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(20, 'La contraseña debe tener como máximo 20 caracteres'),
    nombreCompleto: z.string().min(4, 'El nombre debe tener como mínimo 4 chars').max(100, 'El nombre debe tener como máximo 100 chars')
})

const roles = ['Administrador', 'Funcionario']
const mostrarFormAgregar = ref(false)
const errorFormAgregar = ref('')
const guardandoNuevoUsuario = ref(false)

const formNuevoUsuario = reactive({
    nombreCompleto: '',
    password: '',
    rol: roles[1],
    activo: true,
    email: ''
})

function resetFormAgregar() {
    formNuevoUsuario.nombreCompleto = ''
    formNuevoUsuario.rol = roles[1]
    formNuevoUsuario.activo = true
    formNuevoUsuario.email = ''
    errorFormAgregar.value = ''
}

function cerrarFormAgregar() {
    mostrarFormAgregar.value = false
    resetFormAgregar()
}

// PERFILES
interface Perfil {
  id: number;
  nombre: string;
}

const { data: listaPerfiles } = await useFetch<Perfil[]>('/api/perfiles')

// FORM USUARIO
const formUsuario = ref({
    nombre: '',
    email: '',
    password: '',
    perfilId: null as number | null
})

async function guardarUsuario() {
    // 🔥 VALIDACIÓN NUEVA
    if (!formUsuario.value.perfilId) {
        errorFormAgregar.value = "Debes seleccionar un perfil"
        return
    }

    guardandoNuevoUsuario.value = true
    errorFormAgregar.value = ''

    try {
        await $fetch('/api/usuarios', {
            method: 'POST',
            body: { 
                nombreCompleto: formUsuario.value.nombre,
                email: formUsuario.value.email,
                password: formUsuario.value.password,
                perfilId: formUsuario.value.perfilId,
                activo: true // 🔥 ESTO FALTABA
            }
        })

        cerrarFormAgregar()
        await refresh()
    }
    catch (err: any) {
        console.error(err) // 🔥 PARA DEBUG
        errorFormAgregar.value = 'No se pudo crear el usuario.' 
    }
    finally {
        guardandoNuevoUsuario.value = false
    }
}

/* CAMBIAR CONTRASEÑA */
const mostrarFormContrasena = ref(false)
const errorContrasena = ref('')
const guardandoContrasena = ref(false)
const usuarioContrasena = ref<Usuario | null>(null)
const formContrasena = reactive({
    nueva: '',
    confirmar: ''
})

function resetFormContrasena() {
    formContrasena.nueva = ''
    formContrasena.confirmar = ''
    errorContrasena.value = ''
}

function abrirModalContrasena(usuario: Usuario) {
    usuarioContrasena.value = usuario
    resetFormContrasena()
    mostrarFormContrasena.value = true
}

function cerrarModalContrasena() {
    mostrarFormContrasena.value = false
    usuarioContrasena.value = null
    resetFormContrasena()
}

async function cambiarContrasena() {
    guardandoContrasena.value = true
    errorContrasena.value = ''
    try {
        await $fetch(`/api/usuarios/${usuarioContrasena.value?.email}/password`, {
            method: 'PATCH',
            body: {
                password: formContrasena.nueva
            }
        })
        cerrarModalContrasena()
    }
    catch (err: any) { }
    finally {
        guardandoContrasena.value = false
    }
}

/* CAMBIAR ROL */
const mostrarFormCambiarRol = ref(false)
const guardandoCambioRol = ref(false)
const usuarioCambiarRol = ref<Usuario | null>(null)

const formCambiarRol = reactive({
    rol: roles[1]
})

function resetFormCambiarRol() {
    formCambiarRol.rol = roles[1]
}

function abrirModalCambiarRol(usuario: Usuario) {
    usuarioCambiarRol.value = usuario
    resetFormCambiarRol()
    formCambiarRol.rol = usuario.rol
    mostrarFormCambiarRol.value = true
}

function cerrarModalCambiarRol() {
    mostrarFormCambiarRol.value = false
    resetFormCambiarRol()
}

async function cambiarRol() {
    guardandoCambioRol.value = true
    try {
        await $fetch(`/api/usuarios/${usuarioCambiarRol.value?.email}/rol`, {
            method: 'PATCH',
            body: {
                rol: formCambiarRol.rol
            }
        })
        cerrarModalCambiarRol()
        await refresh()
    }
    catch (err: any) { }
    finally {
        guardandoCambioRol.value = false
    }
}

/* ***** ACTIVAR/DESACTIVAR USUARIO ***** */
async function activarUsuario(usuario: Usuario) {
    try {
        await $fetch(`/api/usuarios/${usuario.email}/activar`, { method: 'PATCH' })
        await refresh()
        useToast().add({
            duration: 2000,
            icon: 'i-i-lucide-lock',
            title: 'Estado de Usuario',
            description: `Se actualizó el estado de ${usuario.nombreCompleto}`
        })
    } catch (err: any) { }
}

/* ***** BORRAR USUARIO ***** */
const mostrarConfirmBorrar = ref(false)
const borrandoUsuario = ref(false)
const usuarioBorrar = ref<Usuario | null>(null)

function cerrarConfirmBorrar() {
    mostrarConfirmBorrar.value = false
    usuarioBorrar.value = null
}

function confirmarBorrarUsuario(usuario: Usuario) {
    usuarioBorrar.value = usuario
    mostrarConfirmBorrar.value = true
}

async function borrarUsuario() {
    borrandoUsuario.value = true
    try {
        await $fetch(`/api/usuarios/${usuarioBorrar.value?.email}`, { method: 'DELETE' })
        cerrarConfirmBorrar()
        await refresh()
    }
    catch (err: any) { }
    finally {
        borrandoUsuario.value = false
    }
}

const { user } = useUserSession();

const mostrarFormDetalle = ref(false)
const usuarioSeleccionado = ref<Usuario | null>(null)

async function abrirModalDetalle(usuario: any) {
    try {
        const data = await $fetch<any>(`/api/usuarios/${encodeURIComponent(usuario.email)}`)
        usuarioSeleccionado.value = data
        mostrarFormDetalle.value = true
    } catch (err) {
        console.error("Error al cargar el detalle del usuario:", err)
        alert("No se pudieron cargar los datos del usuario")
    }
}

const arriendosVigentes = computed(() => usuarioSeleccionado.value?.arriendos?.filter(a => a.estado === 'vigente') ?? [])
const arriendosHistoricos = computed(() => usuarioSeleccionado.value?.arriendos?.filter(a => a.estado === 'finalizado') ?? [])



const mostrarConfirmBorrarArriendo = ref(false)
const arriendoSeleccionado = ref<any>(null) 

function confirmarBorrarArriendo(arriendo: any) {
    arriendoSeleccionado.value = arriendo
    mostrarConfirmBorrarArriendo.value = true
}

async function borrarArriendo() {
    if (!arriendoSeleccionado.value) return;
    try {
        await $fetch(`/api/arriendos/${arriendoSeleccionado.value.id}`, {
            method: 'PATCH',
            body: { estado: 'finalizado' }
        });
        mostrarConfirmBorrarArriendo.value = false;
        await refreshUsuarios?.(); 
    } catch (err) {
        console.error(err);
    }
}

const mostrarReporte = ref(false)
const listaArriendos = ref<any[]>([])

async function abrirReporte() {
    const data = await $fetch<any[]>('/api/arriendos/all')
    listaArriendos.value = data
    mostrarReporte.value = true
}

const formEntrega = ref({ fecha: new Date().toISOString().slice(0, 16) });
const listaDeUrlsFotos = ref<string[]>([])

const formRecepcion = ref({ fecha: new Date().toISOString().slice(0, 16) })

async function guardarInspeccion(arriendoId: number) {
    await $fetch(`/api/arriendos/${arriendoId}`, {
        method: 'PATCH',
        body: {
            fechaEntrega: formEntrega.value.fecha, 
            fotosEntrega: JSON.stringify(listaDeUrlsFotos.value), 
            estado: 'en_curso'
        }
    })
}
</script>


<template>
    <div class="space-y-8">
        <section class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
                <h1 class="text-3xl font-extrabold tracking-tight text-brand-blue sm:text-4xl">
                    Usuarios del sistema
                </h1>
                <p class="mt-3 max-w-2xl text-base leading-7 text-brand-gray/80">
                    Visualice y administre los usuarios del sistema.
                </p>
            </div>
            
            <div class="flex gap-2">
                <UButton @click="abrirReporte" variant="subtle" color="neutral" icon="i-lucide-clipboard-list">
                    Ver Reporte
                </UButton>
                <UButton @click="() => mostrarFormAgregar = true" variant="outline" color="neutral" icon="i-heroicons-plus">
                    Agregar Usuario
                </UButton>
            </div>
        </section>

        <section class="grid gap-4 md:grid-cols-2">
            <UsuarioCard 
                v-for="usuario in usuarios" 
                :key="usuario.email" 
                :usuario="usuario"
                @cambiar-contrasena="abrirModalContrasena" 
                @cambiar-rol="abrirModalCambiarRol"
                @activar-usuario="activarUsuario" 
                @borrar-usuario="confirmarBorrarUsuario" 
                @ver-detalle="abrirModalDetalle" 
            />
        </section>
    </div>

    <!-- MODAL AGREGAR USUARIO -->
    <BaseFormModal 
        v-model:open="mostrarFormAgregar" 
        title="Agregar Usuario"
        description="Completa los datos para registrar un nuevo usuario."
    >
        <div class="space-y-6">

            <!-- NOMBRE -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de usuario
                </label>
                <UInput v-model="formUsuario.nombre" placeholder="Ej: Juan Pérez" />
            </div>

            <!-- CORREO -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico
                </label>
                <UInput v-model="formUsuario.email" placeholder="correo@ejemplo.com" />
            </div>

            <!-- CONTRASEÑA -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                </label>
                <UInput v-model="formUsuario.password" type="password" />
            </div>

            <!-- ROL (PERFIL) -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Rol del usuario
                </label>

                <div class="space-y-2">
                    <div
                        v-for="perfil in listaPerfiles || []"
                        :key="perfil.id"
                        class="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50"
                        @click="formUsuario.perfilId = perfil.id"
                    >
                        <input
                            type="radio"
                            :value="perfil.id"
                            v-model="formUsuario.perfilId"
                        />
                        <span>{{ perfil.nombre }}</span>
                    </div>
                </div>
            </div>

            <!-- ERROR -->
            <p v-if="errorFormAgregar" class="text-sm text-red-500">
                {{ errorFormAgregar }}
            </p>

            <!-- BOTÓN -->
            <div class="flex justify-end pt-2">
                <UButton 
                    color="primary" 
                    @click="guardarUsuario"
                    :loading="guardandoNuevoUsuario"
                >
                    Guardar Usuario
                </UButton>
            </div>

        </div>
    </BaseFormModal>

    <!-- DETALLE USUARIO -->
    <BaseFormModal 
        v-model:open="mostrarFormDetalle" 
        :title="`Historial de ${usuarioSeleccionado?.nombreCompleto}`"
    >
        <div v-if="usuarioSeleccionado" class="space-y-4">
            <p><span class="font-bold">Email:</span> {{ usuarioSeleccionado.email }}</p>
            
            <h3 class="font-bold border-b pb-2 mt-4 text-brand-green">
                Arriendos Vigentes
            </h3>

            <div v-if="arriendosVigentes.length" class="space-y-2">
                <div 
                    v-for="arriendo in arriendosVigentes" 
                    :key="arriendo.id"
                    class="p-3 border border-brand-green/20 bg-green-50 rounded text-sm flex justify-between items-center"
                >
                    <div>
                        <p class="font-semibold">
                            Vehículo: {{ arriendo.vehiculo?.modelo }}
                        </p>
                        <p>
                            Hasta: {{ new Date(arriendo.fechaFin).toLocaleDateString() }}
                        </p>
                    </div>

                    <UButton 
                        icon="i-lucide-trash-2"
                        variant="ghost"
                        color="error"
                        size="xs"
                        @click="() => confirmarBorrarArriendo(arriendo)"
                    />
                </div>
            </div>

            <p v-else class="text-gray-500 text-sm">
                No tiene arriendos vigentes.
            </p>

            <h3 class="font-bold border-b pb-2 mt-4 text-brand-gray">
                Historial de Arriendos
            </h3>

            <div v-if="arriendosHistoricos.length" class="space-y-2">
                <div 
                    v-for="(arriendo, index) in arriendosHistoricos" 
                    :key="index"
                    class="p-3 border rounded text-sm bg-gray-50"
                >
                    <p class="font-semibold text-gray-700">
                        Vehículo: {{ arriendo.vehiculo?.modelo }}
                    </p>
                    <p class="text-gray-500">
                        Terminado el: {{ new Date(arriendo.fechaFin).toLocaleDateString() }}
                    </p>
                </div>
            </div>

            <p v-else class="text-gray-500 text-sm italic">
                No tiene historial registrado.
            </p>
        </div>
    </BaseFormModal>

    <!-- CONFIRMAR BORRAR ARRIENDO -->
    <BaseFormModal 
        v-model:open="mostrarConfirmBorrarArriendo"
        title="Cancelar Arriendo"
        :description="`¿Estás seguro que deseas eliminar el arriendo del vehículo ${arriendoSeleccionado?.vehiculo?.modelo}?`"
    >
        <div class="flex justify-end gap-3 pt-2">
            <UButton 
                color="neutral" 
                variant="subtle"
                @click="mostrarConfirmBorrarArriendo = false"
            >
                Cancelar
            </UButton>

            <UButton 
                color="error"
                icon="i-lucide-trash-2"
                @click="borrarArriendo"
            >
                Confirmar cancelación
            </UButton>
        </div>
    </BaseFormModal>

    <!-- REPORTE -->
    <BaseFormModal v-model:open="mostrarReporte" title="Reporte General de Arriendos">
        <div class="space-y-2">
            <div 
                v-for="a in listaArriendos"
                :key="a.id"
                class="p-3 border rounded text-sm flex justify-between items-center"
            >
                <div>
                    <p class="font-semibold">{{ a.vehiculo?.modelo }}</p>
                    <p class="text-xs text-gray-500">
                        Email: {{ a.usuarioEmail }}
                    </p>
                </div>

                <div class="text-right">
                    <p class="font-bold">
                        {{ a.valor !== undefined ? `$ ${a.valor.toLocaleString()}` : '$ 0' }}
                    </p>

                    <UBadge 
                        :color="a.estado === 'vigente' ? 'success' : 'error'"
                        size="xs"
                    >
                        {{ a.estado }}
                    </UBadge>
                </div>
            </div>
        </div>
    </BaseFormModal>
</template>