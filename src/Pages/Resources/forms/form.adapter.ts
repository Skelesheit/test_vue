import type { FormMode } from '@/services/enums'

export interface FormAdapter<VM = any, CreateDTO = any, UpdateDTO = any, OutDTO = any> {
    // UI/meta
    getTitleKey(): string // i18n key, e.g. 'resources.navigation.material'
    setMode(mode: FormMode): void

    // VM state
    getVM(): VM
    setVM(patch: Partial<VM>): void

    // CRUD
    load(id: number): Promise<void>
    validate(): Promise<boolean> | boolean
    create(): Promise<OutDTO | void>
    update: (id: number) => Promise<OutDTO | void>  // ← было void (или boolean | number — если хочешь)
    remove: (id: number) => Promise<boolean>
}
