import {shallowRef, ref, nextTick} from 'vue'
import type {FormAdapter} from '@/Pages/Resources/forms/form.adapter'
import {FormMode, type ModelType} from '@/services/enums'
import type BaseForm from '@/Pages/Resources/forms/BaseForm.vue'
import { useNotify } from '@/composables/useNotify'
import { useI18n } from 'vue-i18n'


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
                try {
                    await adapter.value.load(currentId.value)
                } finally {
                    busy.value = false
                }
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

    const { success, error } = useNotify()
    const { t } = useI18n()

    async function submit() {
        if (busy.value) return            // защита от дабл-клика
        if (!adapter.value) return

        const okLocal = await adapter.value.validate?.()
        if (okLocal === false) return

        busy.value = true
        const prevMode = mode.value       // запомним, чтобы понять текст тоста
        try {
            let dto: unknown | void

            if (prevMode === FormMode.EDIT && currentId.value != null) {
                dto = await adapter.value.update(currentId.value)   // OutDTO | void
            } else if (prevMode === FormMode.CREATE) {
                dto = await adapter.value.create()                  // OutDTO | void
            } else {
                return
            }

            // успех — когда пришёл не-void (OutDTO)
            if (dto) {
                const id = getId(dto)
                if (id != null) currentId.value = id

                // (опционально) подтянуть каноничную версию после сохранения
                if (currentId.value != null) {
                    await adapter.value.load(currentId.value)
                }

                mode.value = FormMode.VIEW

                success(prevMode === FormMode.EDIT
                    ? t('resources.notifications.updated')
                    : t('resources.notifications.created'))
            }
            // если dto === undefined — сохраняем режим, тост не показываем (ошибка будет в catch)
        } catch (e: any) {
            // сюда прилетит 400/409/422/500 из crudApi (он бросает Error(msg))
            error(e?.message ?? t('errors.generic'))
        } finally {
            busy.value = false
        }
    }

    function getId(o: unknown): number | undefined {
        return (o && typeof o === 'object' && 'id' in o!)
            ? (o as { id?: number }).id
            : undefined
    }


    async function remove() {
        if (!adapter.value || currentId.value == null) return
        busy.value = true
        try {
            const res = await adapter.value.remove(currentId.value)
            if (res) {
                success(t('resources.notifications.deleted'))
                // очистка состояния на успехе
                currentId.value = null
                adapter.value.setVM?.({} as any) // опционально: сбросить форму
                // emit('deleted') // если нужно перезагрузить список у родителя
            }
        } catch (e:any) {
            error(e?.message ?? t('errors.generic')) // покажет 400/409/500 и т.п.
        } finally {
            busy.value = false;
            close()
        }
    }

    function enterEdit() {
        if (mode.value === FormMode.VIEW) mode.value = FormMode.EDIT
    }

    function cancelEdit() {
        if (mode.value === FormMode.EDIT) mode.value = FormMode.VIEW
    }

    function close() {
        mode.value = FormMode.HIDDEN
        adapter.value = null
        component.value = null
        model.value = null
    }

    return {
        mode,
        busy,
        model,
        component,
        shellRef,
        adapter,
        currentId,
        openView,
        openEdit,
        openCreate,
        submit,
        remove,
        enterEdit,
        cancelEdit,
        close
    }
}
