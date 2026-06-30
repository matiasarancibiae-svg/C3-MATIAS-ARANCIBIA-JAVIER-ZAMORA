import type { TableRow } from "@nuxt/ui"

export const createTableMeta = <T>() => ({
    class: {
        tr: (_row:TableRow<T>) => 'cursor-pointer hover:bg-brand-cyan/6 transition-colors'
    }
})