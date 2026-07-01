<script setup lang="ts">
import { z } from 'zod'
import type { TipoVehiculo } from '../types/tipos'
import type { Vehiculo } from '../types/vehiculo'
import { id } from 'zod/locales'

//definePageMeta({ middleware: ['admin'] })

// 1. Obtención de datos
const { data: vehiculos, refresh: refreshVehiculos } = await useFetch<Vehiculo[]>('/api/vehiculos')
const { data: rawTipos, refresh: refreshTipos } = await useFetch<TipoVehiculo[]>('/api/tipos')

const tipos = computed(() => rawTipos.value ?? [])

// 2. Estado para el formulario de Agregar Vehículo
const mostrarFormAgregar = ref(false)
const guardandoVehiculo = ref(false)
const errorFormAgregar = ref('')

const formNuevoVehiculo = reactive({
    modelo: '',
    precio: 0,
    descripcion: '',
    tipoVehiculoId: undefined as number | undefined,
    imagen: null as File | null
})

// 3. Estado para el nuevo modal de Tipo
const mostrarFormTipo = ref(false)
const formNuevoTipo = reactive({ nombre: '' })

const schemaNuevoVehiculo = z.object({
    modelo: z.string().min(2, 'El modelo es obligatorio'),
    precio: z.number().min(1000, 'El precio debe ser mayor a 1000'),
    descripcion: z.string().max(100, 'Máximo 100 caracteres').optional().or(z.literal('')),
    tipoVehiculoId: z.number().min(1, 'Debes seleccionar un tipo de vehículo')
})

// 4. Funciones
function cerrarFormAgregar() {
    mostrarFormAgregar.value = false
    Object.assign(formNuevoVehiculo, { modelo: '', precio: 0, descripcion: '', tipoVehiculoId: undefined })
    errorFormAgregar.value = ''
}

async function guardarVehiculo() {
    guardandoVehiculo.value = true;
    errorFormAgregar.value = ''
    
    try {
        // Creamos una copia limpia para el envío
        const payload = {
            modelo: formNuevoVehiculo.modelo,
            precio: formNuevoVehiculo.precio,
            descripcion: formNuevoVehiculo.descripcion,
            tipoVehiculoId: formNuevoVehiculo.tipoVehiculoId,
            // EXTRAEMOS EL NOMBRE SI ES UN OBJETO
            imagen: formNuevoVehiculo.imagen?.name || null 
        }

        await $fetch('/api/vehiculos', { 
            method: 'POST', 
            body: payload 
        })
        
        cerrarFormAgregar()
        await refreshVehiculos()
    } catch (err: any) {
        errorFormAgregar.value = 'No se pudo crear el vehículo.'
    } finally {
        guardandoVehiculo.value = false
    }
}

async function guardarTipo() {
    try {
        await $fetch('/api/tipos', { method: 'POST', body: formNuevoTipo })
        mostrarFormTipo.value = false
        formNuevoTipo.nombre = ''
        await refreshTipos()
    } catch (err) {
        alert('No se pudo crear el tipo.')
    }
}


async function eliminarVehiculo(id: number) {
    if (!confirm('¿Estás seguro de eliminar este vehículo?')) return;

    await $fetch(`/api/vehiculos/${id}`, {
  method: 'DELETE' as any
});
    await refreshVehiculos(); // Esto recarga la lista automáticamente
}



/* CAMBIAR ESTADO VEHÍCULO */
const mostrarFormCambiarEstado = ref(false)
const guardandoEstado = ref(false)
const vehiculoCambiarEstado = ref<Vehiculo | null>(null)

const formCambiarEstado = reactive({
    estado: 'disponible'
})

function abrirModalCambiarEstado(vehiculo: Vehiculo) {
    vehiculoCambiarEstado.value = vehiculo
    formCambiarEstado.estado = vehiculo.estado
    mostrarFormCambiarEstado.value = true
}

async function cambiarEstado() {
    // Obtenemos el ID desde la referencia que poblamos al abrir el modal
    const idVehiculo = vehiculoCambiarEstado.value?.id;

    if (!idVehiculo) {
        console.error("No se pudo obtener el ID del vehículo");
        return;
    }

    guardandoEstado.value = true
    try {
        // Usamos idVehiculo aquí
        await $fetch(`/api/vehiculos/${idVehiculo}/estado`, {
            method: 'PATCH' as any,
            body: { estado: formCambiarEstado.estado }
        });
        
        mostrarFormCambiarEstado.value = false
        await refreshVehiculos() 
    } catch (err) {
        console.error("Error al cambiar estado:", err)
    } finally {
        guardandoEstado.value = false
    }
}


// ========================== Script para arriendos
// En productos.vue
const { user } = useUserSession(); // Obtén el usuario logueado

async function ejecutarArriendo(vehiculo: Vehiculo) {
    if (!confirm(`¿Confirmar arriendo de ${vehiculo.modelo}?`)) return;

    try {
        await $fetch('/api/arriendos', {
            method: 'POST',
            body: {
                vehiculoId: vehiculo.id,
                usuarioEmail: user.value?.email,
                nombre: user.value?.nombreCompleto || 'Usuario sin nombre',


                valor: vehiculo.precio || 0 
            }
        });
        await refreshVehiculos();
    } catch (err) {
        console.error("Error al arrendar:", err);
    }
}



// Función para los colores (la que definimos antes)
function getEstadoClass(estado: string) {
    return {
        'text-red-500': estado === 'arrendado',
        'text-green-400': estado === 'disponible',
        'text-gray-500': estado === 'en mantenimiento',
        'text-black font-bold': estado === 'de baja'
    }
}
// =======================================================0
import type { Usuario } from '~/types/usuario'
const props = defineProps<{
    usuario: Usuario
}>()
// --- Lógica de permisos ---
const esAdmin = computed(() => user.value?.rol === 'Administrador')
const esEjecutivo = computed(() => user.value?.rol === 'Ejecutivo')
const esMismoUsuario = computed(() => user.value?.email === props.usuario.email)
const esUsuarioAdmin = computed(() => props.usuario.rol === 'Administrador')



// ===================================== Necesario para la imagen =====================
// --- Estados ---
const mostrarModalGestion = ref(false)
const modoGestion = ref<'entrega' | 'recepcion'>('entrega')
const procesandoGestion = ref(false)
const vehiculoEnGestion = ref<Vehiculo | null>(null)

// Formulario unificado
const formGestionArriendo = reactive({
    fechaEntrega: '',
    fotosEntrega: null as File | null,
    fechaRecepccion: '',
    fotosRecepccion: null as File | null
})

// Abrir modal según la acción
function abrirModalGestion(vehiculo: Vehiculo, modo: 'entrega' | 'recepcion') {
    vehiculoEnGestion.value = vehiculo
    modoGestion.value = modo
    mostrarModalGestion.value = true
}

// Función única para enviar datos
async function ejecutarProcesoGestion() {
    if (!vehiculoEnGestion.value) return;
    
    procesandoGestion.value = true;
    try {
        // Verifica en consola lo que realmente se está enviando
        const payload = {
            fechaEntrega: modoGestion.value === 'entrega' ? formGestionArriendo.fechaEntrega : undefined,
            fotosEntrega: modoGestion.value === 'entrega' ? formGestionArriendo.fotosEntrega?.name : undefined,
            fechaRecepcion: modoGestion.value === 'recepcion' ? formGestionArriendo.fechaRecepccion : undefined,
            fotosRecepcion: modoGestion.value === 'recepcion' ? formGestionArriendo.fotosRecepccion?.name : undefined
        };
        
        console.log("Enviando al backend:", payload); // <-- MIRA LA CONSOLA DEL NAVEGADOR

        await $fetch(`/api/vehiculos/${vehiculoEnGestion.value.id}/estado`, {
            method: 'PATCH',
            body: payload
        });
        
        mostrarModalGestion.value = false;
        await refreshVehiculos();
    } catch (err) {
        console.error("Error al procesar:", err);
    } finally {
        procesandoGestion.value = false;
    }
}

// --- Estados ---

const mostrarModalDetalle = ref(false)
const arriendoSeleccionado = ref<any>(null)

async function abrirDetalleArriendo(vehiculo: any) {
    console.log("Clic recibido. ID Vehículo:", vehiculo.id); // ¿Esto sale en consola?
    
    try {
        const data = await $fetch(`/api/vehiculos/${vehiculo.id}/arriendo-activo`);
        console.log("Datos obtenidos:", data); // ¿Esto sale en consola?
        
        if (data) {
            arriendoSeleccionado.value = data;
            mostrarModalDetalle.value = true; // Aquí es donde debería abrir
            console.log("¿El modal debería estar abierto ahora?");
        } else {
            alert("No se encontraron datos para este vehículo");
        }
    } catch (e) {
        console.error("Error al cargar:", e);
        alert("Error al cargar los datos. Mira la consola.");
    }
}
</script>

<template>
    <BaseFormModal v-model:open="mostrarFormAgregar" title="Agregar Vehículo" 
    description="Completa los datos para registrar un nuevo vehículo en la flota.">
    
    <UForm class="space-y-4" :state="formNuevoVehiculo" :schema="schemaNuevoVehiculo">
        
        <UFormField label="Modelo" name="modelo">
            <UInput v-model="formNuevoVehiculo.modelo" color="neutral" variant="outline" class="w-full"
                placeholder="Ej: Toyota Corolla" />
        </UFormField>

        <UFormField label="Precio por día" name="precio">
            <UInput v-model.number="formNuevoVehiculo.precio" type="number" color="neutral" variant="outline"
                class="w-full" placeholder="Ej: 25000" />
        </UFormField>

        <UFormField label="Tipo de Vehículo" name="tipoVehiculoId">
            <USelect v-model="formNuevoVehiculo.tipoVehiculoId" :items="tipos" label-key="nombre" value-key="id"
                placeholder="Selecciona el tipo" class="w-full" />
        </UFormField>

        <UFormField label="Imagen del Vehículo" name="imagen">
            <UFileUpload v-model="formNuevoVehiculo.imagen" accept="image/*" class="w-full min-h-48" />
        </UFormField>

        <UFormField label="Descripción" name="descripcion">
            <UTextarea v-model="formNuevoVehiculo.descripcion" color="neutral" variant="outline" class="w-full"
                placeholder="Breve descripción del vehículo" />
        </UFormField>

        <UAlert v-if="errorFormAgregar" color="error" variant="soft" icon="i-heroicons-exclamation-circle"
            :title="errorFormAgregar" />

        <div class="flex justify-end gap-3 pt-2">
            <UButton type="button" color="neutral" variant="subtle" @click="cerrarFormAgregar">
                Cancelar
            </UButton>
            
            <UButton 
                type="button" 
                color="neutral" 
                icon="i-heroicons-check" 
                :loading="guardandoVehiculo" 
                @click="guardarVehiculo"
            >
                Agregar Vehículo
            </UButton>
        </div>
    </UForm>
</BaseFormModal>

    <BaseFormModal v-model:open="mostrarFormTipo" title="Agregar Tipo de Vehículo">
        <UForm :state="formNuevoTipo" @submit="guardarTipo" class="space-y-4">
            <UFormField label="Nombre del Tipo" name="nombre">
                <UInput v-model="formNuevoTipo.nombre" color="neutral" variant="outline" class="w-full"
                    placeholder="Ej: Camioneta" />
            </UFormField>

            <div class="flex justify-end gap-3 pt-2">
                <UButton type="button" color="neutral" variant="subtle" @click="mostrarFormTipo = false">
                    Cancelar
                </UButton>

                <UButton type="submit" color="neutral" icon="i-heroicons-check" :ui="formBtnCTOUi">
                    Confirmar
                </UButton>
            </div>
        </UForm>
    </BaseFormModal>

    <!-- BaseformModal para el botón de cambiar estado de arriendo-->
     <BaseFormModal v-model:open="mostrarFormCambiarEstado" title="Cambiar Estado" 
        :description="vehiculoCambiarEstado ? `Modificar el estado de ${vehiculoCambiarEstado.modelo}` : ''">
    
        <form @submit.prevent="cambiarEstado" class="space-y-4">
            <UFormField label="Nuevo Estado" name="estado">
                <URadioGroup 
                    v-model="formCambiarEstado.estado" 
                    :items="['disponible', 'arrendado', 'en mantenimiento', 'de baja']" 
                />
            </UFormField>

            <div class="flex justify-end gap-3 pt-2">
                <UButton type="button" color="neutral" variant="subtle" @click="mostrarFormCambiarEstado = false">
                    Cancelar
                </UButton>
                <UButton 
    type="submit" 
    color="primary"  variant="solid"  icon="i-heroicons-check" 
    :loading="guardandoEstado"
>
    Guardar cambios
</UButton>
            </div>
        </form>
    </BaseFormModal>

    <!-- ================================================ -->
    <BaseFormModal v-model:open="mostrarModalGestion" :title="modoGestion === 'entrega' ? 'Registrar Entrega' : 'Registrar Recepción'">
    <UForm :state="formGestionArriendo" @submit="ejecutarProcesoGestion" class="space-y-4">
        
        <div v-if="modoGestion === 'entrega'" class="space-y-4">
            <UFormField label="Fecha de Entrega" name="fechaEntrega">
                <UInput v-model="formGestionArriendo.fechaEntrega" type="datetime-local" class="w-full"></UInput>
            </UFormField>
            
            <UFormField label="Fotos de Entrega" name="fotosEntrega">
                <UFileUpload v-model="formGestionArriendo.fotosEntrega" class="w-full"></UFileUpload>
            </UFormField>
        </div>

        <div v-else class="space-y-4">
            <UFormField label="Fecha de Recepción" name="fechaRecepccion">
                <UInput v-model="formGestionArriendo.fechaRecepccion" type="datetime-local" />
            </UFormField>
            
            <UFormField label="Fotos de Recepción" name="fotosRecepccion">
                <UFileUpload v-model="formGestionArriendo.fotosRecepccion" class="w-full"></UFileUpload>
            </UFormField>
        </div>

        <div class="flex justify-end gap-3 pt-2">
            <UButton type="button" color="neutral" variant="subtle" @click="mostrarModalGestion = false">
                Cancelar
            </UButton>
            <UButton type="submit" color="primary" :loading="procesandoGestion">
                Confirmar {{ modoGestion === 'entrega' ? 'Entrega' : 'Recepción' }}
            </UButton>
        </div>
    </UForm>
</BaseFormModal>


    <!--=======================================================-->
<BaseFormModal v-if="arriendoSeleccionado" v-model:open="mostrarModalDetalle" title="Detalle del Arriendo">
    <div class="space-y-6">
        <div class="bg-gray-50 p-4 rounded-lg border">
            <p class="text-sm font-bold text-gray-700">Información del Cliente:</p>
            <div class="flex flex-col mt-1">
                <p class="font-semibold text-lg">{{ arriendoSeleccionado.nombre || 'Nombre no registrado' }}</p>
                <p class="text-sm text-blue-600 underline">{{ arriendoSeleccionado.usuarioEmail || 'Sin correo' }}</p>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <p class="text-sm font-bold">Vehículo:</p> 
                <p>{{ arriendoSeleccionado.vehiculo?.modelo }}</p>
            </div>
            <div>
                <p class="text-sm font-bold">Estado:</p> 
                <p class="capitalize">{{ arriendoSeleccionado.estado }}</p>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <p class="text-sm font-bold mb-2">Fotos de Entrega:</p>
                <img v-if="arriendoSeleccionado.fotosEntrega" 
                     :src="`/uploads/${arriendoSeleccionado.fotosEntrega}`" 
                     class="rounded border w-full h-32 object-cover" />
                <p v-else class="text-gray-400 italic text-sm">No disponible</p>
                
                <p class="text-xs text-gray-500 mt-2">
                    Enviado el: {{ arriendoSeleccionado.fechaEntrega ? new Date(arriendoSeleccionado.fechaEntrega).toLocaleString() : 'N/A' }}
                </p>
            </div>
            
            <div>
                <p class="text-sm font-bold mb-2">Fotos de Recepción:</p>
                <img v-if="arriendoSeleccionado.fotosRecepcion" 
                     :src="`/uploads/${arriendoSeleccionado.fotosRecepcion}`" 
                     class="rounded border w-full h-32 object-cover" />
                <p v-else class="text-gray-400 italic text-sm">No disponible</p>
                
                <p class="text-xs text-gray-500 mt-2">
                    Recibido el: {{ arriendoSeleccionado.fechaRecepcion ? new Date(arriendoSeleccionado.fechaRecepcion).toLocaleString() : 'N/A' }}
                </p>
            </div>
        </div>
    </div>
</BaseFormModal>

    <div class="space-y-8">
        <section class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
                <h1 class="text-3xl font-extrabold tracking-tight text-brand-blue sm:text-4xl">Inventario de Productos
                </h1>
                <p class="mt-3 max-w-2xl text-base leading-7 text-brand-gray/80">Vista para control de stock de
                    productos.</p>
            </div>

            <div class="flex gap-3"  v-if="esAdmin || (esEjecutivo)">
                <UButton @click="mostrarFormTipo = true" variant="outline" color="neutral" icon="i-heroicons-plus" 
                    :ui="formBtnOutlineCTOUi">Agregar tipo</UButton>
                <UButton @click="mostrarFormAgregar = true" variant="outline" color="neutral" icon="i-heroicons-plus"
                    :ui="formBtnOutlineCTOUi">Agregar Vehículo</UButton>
            </div>
            
        </section>

        <section class="w-full">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-auto max-w-7xl px-4 rounded-2xl gap-3 py-4">
                <div v-for="vehiculo in vehiculos" :key="vehiculo.id" 
    class="bg-white rounded-lg shadow-md border border-gray-200 p-4">

    <img 
        v-if="vehiculo.imagen" 
        :src="`/uploads/${vehiculo.imagen}`" 
        :alt="vehiculo.modelo"
        class="w-full h-48 object-cover rounded" 
    />
    
    <div v-else class="w-full h-48 bg-gray-200 flex items-center justify-center">
        <span>Sin imagen</span>
    </div>
    
    <div class="flex justify-between items-start">
        <h2 class="text-xl font-bold">{{ vehiculo.modelo }}</h2>    
    </div>

    <p class="text-gray-600">${{ vehiculo.precio }} / día</p>
    <p class="text-gray-500 text-sm mt-1">{{ vehiculo.descripcion }}</p>
    <br>
    
    <p :class="{
        'text-red-500': vehiculo.estado === 'arrendado',
        'text-green-400': vehiculo.estado === 'disponible',
        'text-gray-500': vehiculo.estado === 'en mantenimiento',
        'text-black font-bold': vehiculo.estado === 'de baja'
    }">
        {{ vehiculo.estado }}
    </p>

    <div class="flex justify-between items-center mt-4">
        <UButton 
            v-if="vehiculo.estado === 'disponible'"
            icon="i-heroicons-key"
            variant="solid"
            color="primary"
            size="xs"
            @click="ejecutarArriendo(vehiculo)"
        >
            Arrendar
        </UButton>
        <UButton v-if="vehiculo.estado === 'arrendado' && (esAdmin || (esEjecutivo))" @click="abrirModalGestion(vehiculo, 'entrega')" icon="i-heroicons-truck" variant="soft" color="orange" size="xs">
        Entrega
    </UButton>

    <UButton v-if="vehiculo.estado === 'arrendado'  && (esAdmin || (esEjecutivo))" @click="abrirModalGestion(vehiculo, 'recepcion')" icon="i-heroicons-arrow-down-tray" variant="soft" color="green" size="xs">
        Recepción
    </UButton>

    <UButton  v-if="esAdmin || (esEjecutivo)"
    icon="i-heroicons-eye" 
    variant="ghost" 
    size="xs" 
    @click="abrirDetalleArriendo(vehiculo)">
    Ver Historial
</UButton>


        <div class="flex gap-2" v-if="esAdmin || (esEjecutivo)">
            <UTooltip text="Eliminar vehículo">
                <UButton icon="i-lucide-trash-2" variant="soft" size="xs" 
                    class="rounded-full bg-brand-red/12 text-brand-red hover:bg-brand-red/24"
                    @click="eliminarVehiculo(vehiculo.id)" />
            </UTooltip>
            <UTooltip text="Cambiar estado">
                <UButton icon="i-lucide-shield-half" aria-label="Cambiar estado" variant="soft" size="xs"
                    class="rounded-full bg-brand-cyan/15 text-brand-cyan hover:bg-brand-cyan/25"
                    @click="abrirModalCambiarEstado(vehiculo)"
                />
            </UTooltip>
        </div>
    </div>
</div>
            </div>
        </section>
    </div>
</template>
