<script setup lang="ts">
import type { Usuario } from '~/types/usuario'
const { user } = useUserSession() // Usuario logueado

const props = defineProps<{
    usuario: Usuario
}>()

// --- Lógica de permisos ---
const esAdmin = computed(() => user.value?.rol === 'Administrador')
const esEjecutivo = computed(() => user.value?.rol === 'Ejecutivo')
const esMismoUsuario = computed(() => user.value?.email === props.usuario.email)
const esUsuarioAdmin = computed(() => props.usuario.rol === 'Administrador')

const emit = defineEmits<{
    'cambiar-contrasena': [usuario: Usuario],
    'cambiar-rol': [usuario: Usuario],
    'activar-usuario': [usuario: Usuario],
    'borrar-usuario': [usuario: Usuario],
    'ver-detalle': [usuario: Usuario]
}>()
</script>

<template>
    <UCard class="border border-brand-border bg-white/95">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <p class="text-lg font-bold text-brand-blue">
                    {{ props.usuario.nombreCompleto }}
                </p>
                <p class="text-sm text-brand-gray/70">
                    {{ props.usuario.email }}
                </p>
            </div>

            <div class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                :class="props.usuario.activo ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-red/10 text-brand-red'">
                {{ props.usuario.activo ? 'Activo' : 'Bloqueado' }}
            </div>
        </div>

        <div class="mt-6 flex items-center justify-start border-t border-brand-border pt-4 text-sm text-brand-gray/75">
            <span class="mr-1">Rol asignado: </span>
            <span class="font-semibold text-brand-gray">{{ props.usuario.rol }}</span>
        </div>

        <div class="mt-4 flex items-center justify-end gap-2">
            <UTooltip text="Ver historial">
                <UButton icon="i-lucide-eye" variant="soft" size="xs"
                    class="rounded-full bg-brand-blue/12 text-brand-blue"
                    @click="emit('ver-detalle', props.usuario)" />
            </UTooltip>

            <UTooltip v-if="esAdmin || (esEjecutivo && !esUsuarioAdmin && !esMismoUsuario)" text="Cambiar contraseña">
                <UButton icon="i-lucide-key-round" variant="soft" size="xs" @click="emit('cambiar-contrasena', props.usuario)" />
            </UTooltip>

            <UTooltip v-if="esAdmin" text="Cambiar rol">
                <UButton icon="i-lucide-shield-half" variant="soft" size="xs" @click="emit('cambiar-rol', props.usuario)" />
            </UTooltip>

            <UTooltip v-if="!esMismoUsuario && !esUsuarioAdmin && (esAdmin || esEjecutivo)" text="Eliminar usuario">
                <UButton icon="i-lucide-trash-2" variant="soft" size="xs"
                    class="rounded-full bg-brand-red/12 text-brand-red"
                    @click="emit('borrar-usuario', props.usuario)" />
            </UTooltip>

            <UTooltip v-if="!esMismoUsuario && !esUsuarioAdmin && (esAdmin || esEjecutivo)" 
                :text="props.usuario.activo ? 'Bloquear usuario' : 'Activar usuario'"
            >
                <UButton 
                    :icon="props.usuario.activo ? 'i-lucide-lock' : 'i-lucide-lock-open'"
                    variant="soft" size="xs"
                    :class="props.usuario.activo ? 'bg-brand-red/12 text-brand-red' : 'bg-brand-green/12 text-brand-green'"
                    @click="emit('activar-usuario', props.usuario)" 
                />
            </UTooltip>
        </div>
    </UCard>
</template>