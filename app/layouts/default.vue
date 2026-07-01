<script setup lang="ts">
const route = useRoute()
const { user } = useUserSession()

const isActive = (to: String) => route.path === to

const navLinks = [
    { label: 'Inicio', to: '/' },
    { label: 'Vehiculos', to: '/productos' },
    ...(user.value?.rol === 'Administrador' || user.value?.rol === 'Ejecutivo' 
        ? [{ label: 'Usuarios', to: '/usuarios' }] 
        : [])
]

async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await navigateTo('/login')
}

const userMenuItems = [[
    {
        label: 'Cerrar sesión',
        icon: 'i-lucide-log-out',
        onSelect: logout
    },
    // Esto muestra la opcion para cambiar contraseña
    {
        label: 'Cambiar Contraseña',
        icon: 'i-lucide-lock'
    }
]]
</script>

<template>
    <div class="min-h-screen bg-brand-gradient text-brand-gray">
        <header class="border-b border-brand-border bg-white/90 backdrop-blur-sm">
            <div
                class="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-brand-cyan">
                            Arriendo de Vehiculos
                        </p>
                        <p class="text-sm font-bold text-brand-blue">
                            
                        </p>
                    </div>
                </div>

                <div class="flex flex-col gap-4 lg:flex-row lg:items-center">
                    <nav class="flex flex-wrap items-center gap-2">
                        <NuxtLink v-for="link in navLinks" :key="link.to" :to="link.to"
                            class="px-2 py-1 rounded-lg text-sm hover:bg-brand-surface"
                            :class="isActive(link.to) ? 'text-brand-blue font-semibold' : 'text-brand-gray'">
                            {{ link.label }}
                        </NuxtLink>

                    </nav>

                    <div
                        class="flex flex-wrap items-center gap-3 rounded-2xl border border-brand-border bg-white px-4 py-2">
                        <div class="hidden text-right sm:block">
                            <p class="text-sm font-semibold text-brand-blue">
                                {{ user?.nombreCompleto }}
                            </p>
                            <p class="text-xs text-brand-gray/70">
                                {{ user?.rol }}
                            </p>
                        </div>

                        <UDropdownMenu :items="userMenuItems" :content="{ align: 'end', sideOffset: 12 }"
                            :ui="{ content: 'min-w-48', item: 'cursor-pointer', itemLeadingIcon: 'text-brand-blue', itemLabel: 'font-semibold text-brand-gray' }">
                            <div class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-brand-cyan text-sm font-bold text-white transition-transform hover:scale-105"
                                role="button" tabindex="0" aria-label="Abrir menú de usuario">
                                <Icon name="i-lucide-user" size="25" />
                            </div>
                        </UDropdownMenu>
                    </div>
                </div>
            </div>
        </header>

        <main class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <slot />
        </main>
    </div>
</template>