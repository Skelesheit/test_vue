import { shallowRef, ref, nextTick } from 'vue'
import type { FormAdapter } from '@/Pages/Resources/forms/form.adapter'
import { FormMode, type ModelType } from '@/services/enums'
import type BaseForm from '@/Pages/Resources/forms/BaseForm.vue'

export function useFormHost() {
    const mode = ref<FormMode>(FormMode.HIDDEN)
    const busy = ref(false)
    const component = shallowRef<any>(null)
    const model = ref<ModelType | null>(null)

    const shellRef = ref<InstanceType<typeof BaseForm> | null>(null)
    const adapter = ref<FormAdapter | null>(null)
    const currentId = ref<number | null>(null)

    function attachFromShellRef() {
        const child = (shellRef.value?.$refs.childRef as any) as FormAdapter | null
        if (child && typeof child.getVM === 'function') adapter.value = child
    }

    async function ensureChildReady() {
        await nextTick()
        attachFromShellRef()
        if (!adapter.value) return

        adapter.value.setMode(mode.value)
        if (mode.value === FormMode.VIEW || mode.value === FormMode.EDIT) {
            if (currentId.value != null) {
                busy.value = true
                try { await adapter.value.load(currentId.value) } finally { busy.value = false }
            }
        }
    }

    async function openView(childComp: any, m: ModelType, id: number) {
        component.value = childComp
        model.value = m
        mode.value = FormMode.VIEW
        currentId.value = id
        await ensureChildReady()
    }

    async function openEdit(childComp: any, m: ModelType, id: number) {
        component.value = childComp
        model.value = m
        mode.value = FormMode.EDIT
        currentId.value = id
        await ensureChildReady()
    }

    async function openCreate(childComp: any, m: ModelType) {
        component.value = childComp
        model.value = m
        mode.value = FormMode.CREATE
        currentId.value = null
        await ensureChildReady()
    }

    async function submit() {
        if (!adapter.value) return
        const ok = await adapter.value.validate()
        if (!ok) return

        busy.value = true
        try {
            if (mode.value === FormMode.EDIT && currentId.value != null) {
                await adapter.value.update(currentId.value)
                mode.value = FormMode.VIEW
            } else if (mode.value === FormMode.CREATE) {
                const created = await adapter.value.create()
                mode.value = FormMode.VIEW
                if (typeof created === 'number') currentId.value = created
            }
        } finally { busy.value = false }
    }

    async function remove() {
        if (!adapter.value || currentId.value == null) return
        busy.value = true
        try { await adapter.value.remove(currentId.value) } finally { busy.value = false; close() }
    }

    function enterEdit() { if (mode.value === FormMode.VIEW) mode.value = FormMode.EDIT }
    function cancelEdit() { if (mode.value === FormMode.EDIT) mode.value = FormMode.VIEW }
    function close() {
        mode.value = FormMode.HIDDEN
        adapter.value = null
        component.value = null
        model.value = null
    }

    return { mode, busy, model, component, shellRef, adapter, currentId, openView, openEdit, openCreate, submit, remove, enterEdit, cancelEdit, close }
}
