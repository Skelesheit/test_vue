import { reactive } from 'vue'

export type NotifyType = 'success' | 'error' | 'info'
export interface NotifyItem {
    id: number
    type: NotifyType
    text: string
}

// singleton store
const state = reactive<{ items: NotifyItem[] }>({ items: [] })
let seq = 1

function push(type: NotifyType, text: string, ms = 5000) {
    const id = seq++
    state.items.push({ id, type, text })
    if (ms > 0) setTimeout(() => remove(id), ms)
    return id
}

function remove(id: number) {
    const idx = state.items.findIndex(i => i.id === id)
    if (idx !== -1) state.items.splice(idx, 1)
}

export function useNotify() {
    return {
        items: state.items,
        push,
        remove,
        success: (text: string, ms?: number) => push('success', text, ms),
        error: (text: string, ms?: number) => push('error', text, ms),
        info: (text: string, ms?: number) => push('info', text, ms),
    }
}
