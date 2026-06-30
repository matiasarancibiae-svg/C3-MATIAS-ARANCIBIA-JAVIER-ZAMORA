<script setup lang="ts">
import { z } from 'zod'

definePageMeta({
    layout: 'auth'
})

const schemaLogin = z.object({
    email: z.email({ message: 'Ingresa un correo válido' }),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(20, 'La contraseña debe tener como máximo 20 caracteres')
})

const iniciandoSesion = ref(false)
const errorForm = ref('')

const formLogin = reactive({
    email: '',
    password: '',
})

const { fetch: fetchSession } = useUserSession()

async function login() {
    iniciandoSesion.value = true
    errorForm.value = ''

    try {
        await $fetch('/api/auth/login', {
            method: 'POST',
            body: {
                email: formLogin.email,
                password: formLogin.password
            }
        })
        await fetchSession()
        await navigateTo('/')
    }

    catch (err: any) {
        errorForm.value = getApiErrorMessage(err, 'No se pudo iniciar sesión')
    }
    finally {
        iniciandoSesion.value = false
    }

}
</script>

<template>
    <div class="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <UCard class="w-full max-w-md border border-brand-border bg-white/95 shadow-xl shadow-brand-blue/5">
            <template #header>
                <div class="space-y-3 text-center">
                    <p class="text-sm font-semibold uppercase tracking-[0.24em] text-brand-cyan">
                        Auth Test
                    </p>
                    <p class="text-2xl font-bold text-brand-blue">
                        Iniciar sesión
                    </p>
                    <p class="text-sm text-brand-gray/70">
                        Indique sus credenciales para ingresar al sistema.
                    </p>
                </div>
            </template>

            <div>
                <UForm class="space-y-5" :state="formLogin" :schema="schemaLogin" @submit="login">
                    <UFormField label="Correo corporativo" name="email">
                        <UInput v-model="formLogin.email" placeholder="correo@empresa.com" size="xl" class="w-full" />
                    </UFormField>

                    <UFormField label="Contraseña" name="password">
                        <UInput v-model="formLogin.password" placeholder="Ingresa tu contraseña" type="password"
                            size="xl" class="w-full" />
                    </UFormField>

                    <!-- mensajes de error de formulario -->
                    <UAlert v-if="errorForm" color="error" variant="soft" icon="i-heroicons-exclamation-circle"
                        :title="errorForm" />

                    <UButton type="submit" block size="xl" class="bg-brand-blue text-white hover:bg-brand-blue/90">
                        Ingresar al Sistema
                    </UButton>
                </UForm>
            </div>
        </UCard>
    </div>
</template>