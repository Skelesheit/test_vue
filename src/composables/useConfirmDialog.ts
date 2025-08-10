import { ref } from 'vue'

/**
 * Простой composable-промпт, чтобы вызывать confirm как Promise<boolean>.
 * Используется вместе с <ConfirmDialog v-model="isOpen" @confirm=... />
 */
export function useConfirmDialog() {
    const isOpen = ref(false)
    let resolver: ((v: boolean) => void) | null = null

    function confirm(): Promise<boolean> {
        isOpen.value = true
        return new Promise<boolean>((resolve) => { resolver = resolve })
    }
    function accept() { resolver?.(true); isOpen.value = false; resolver = null }
    function reject() { resolver?.(false); isOpen.value = false; resolver = null }

    return { isOpen, confirm, accept, reject }
}
