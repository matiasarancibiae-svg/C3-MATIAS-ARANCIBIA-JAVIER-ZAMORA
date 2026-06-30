<script setup lang="ts">
const open = defineModel<boolean>('open', { default: false })

defineProps<{
    title: string
    description?: string
}>()
</script>

<template>
    <UModal v-model:open="open" :title="title" :description="description" :ui="{
        content: 'bg-white',
        header: 'bg-white',
        title: 'text-gray-800',
        description: 'text-brand-gray',
        body: 'bg-white',
        footer: 'bg-white'
    }">
        <template #body>
            <slot />
        </template>
    </UModal>
</template>