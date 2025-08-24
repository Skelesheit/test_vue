// src/Pages/Resources/materials/material.vm.ts
import { reactive } from 'vue'
import { createCrudApi } from '@/services/crud' // подправь путь, если другой

import {
    MaterialOut,
    MaterialCreate,
    MaterialUpdate,
    MaterialCategoryOut,
    AssortmentTypeOut,
    MaterialCategoryCreate,
    MaterialCategoryUpdate,
    AssortmentTypeCreate,
    AssortmentTypeUpdate,
    GostOut, GostCreate, GostUpdate,
} from '@/services/interfaces/resources'

export type MaterialVM = {
    id: number | null

    // базовые
    brand: string

    // числовые
    B_D: number | null
    height: number | null
    strength: number | null
    length: number | null
    dense: number | null
    hardness: number | null
    tear_resistance: number | null
    elongation: number | null
    quantity: number | null
    price: number | null

    // опциональные
    comment: string | null
    comment_en: string | null

    // вложенные (для удобства формы/таблицы)
    category: MaterialCategoryOut | null
    assortment_type: AssortmentTypeOut | null
}

/** Реактивный VM по умолчанию */
export const vm = reactive<MaterialVM>({
    id: null,

    brand: '',

    B_D: null,
    height: null,
    strength: null,
    length: null,
    dense: null,
    hardness: null,
    tear_resistance: null,
    elongation: null,
    quantity: null,
    price: null,

    comment: null,
    comment_en: null,

    category: null,
    assortment_type: null,
})

/** CRUD API (твой фабричный) */
const materialApi = createCrudApi<
    MaterialOut,
    MaterialCreate,
    MaterialUpdate
>('resources/materials')
const materialCategoryApi = createCrudApi<
    MaterialCategoryOut,
    MaterialCategoryCreate,
    MaterialCategoryUpdate
>('resources/material-categories')

const assortmentTypeApi = createCrudApi<
    AssortmentTypeOut,
    AssortmentTypeCreate,
    AssortmentTypeUpdate
>('resources/material-categories')

const gostApi = createCrudApi<
    GostOut,
    GostCreate,
    GostUpdate
>('resources/material-categories')
/** DTO → VM */
export function toVM(dto: MaterialOut): MaterialVM {
    return {
        id: dto.id,

        brand: dto.brand,

        B_D: dto.B_D,
        height: dto.height,
        strength: dto.strength,
        length: dto.length,
        dense: dto.dense,
        hardness: dto.hardness,
        tear_resistance: dto.tear_resistance,
        elongation: dto.elongation,
        quantity: dto.quantity,
        price: dto.price,

        comment: dto.comment ?? null,
        comment_en: dto.comment_en ?? null,

        category: dto.category ?? null,
        assortment_type: dto.assortment_type ?? null,
    }
}

/** VM → Create (все required как в бек-схеме) */
export function toCreate(v: MaterialVM): MaterialCreate {
    return {
        brand: (v.brand ?? '').trim(),

        B_D: v.B_D!,                 // required
        height: v.height!,           // required
        strength: v.strength!,       // required
        length: v.length!,           // required
        dense: v.dense!,             // required
        hardness: v.hardness!,       // required
        tear_resistance: v.tear_resistance!, // required
        elongation: v.elongation!,   // required
        quantity: v.quantity!,       // required
        price: v.price!,             // required

        comment: v.comment ?? null,
        comment_en: v.comment_en ?? null,

        material_category_id: v.category!.id,           // required
        assortment_type_id: v.assortment_type!.id,      // required
    }
}

/** VM → Update (partial) */
export function toUpdate(v: MaterialVM): MaterialUpdate {
    const patch: MaterialUpdate = {}

    // строки
    if (v.brand != null) patch.brand = v.brand.trim()

    // числа
    if (v.B_D != null) patch.B_D = v.B_D
    if (v.height != null) patch.height = v.height
    if (v.strength != null) patch.strength = v.strength
    if (v.length != null) patch.length = v.length
    if (v.dense != null) patch.dense = v.dense
    if (v.hardness != null) patch.hardness = v.hardness
    if (v.tear_resistance != null) patch.tear_resistance = v.tear_resistance
    if (v.elongation != null) patch.elongation = v.elongation
    if (v.quantity != null) patch.quantity = v.quantity
    if (v.price != null) patch.price = v.price

    // опциональные
    if (v.comment !== undefined) patch.comment = v.comment
    if (v.comment_en !== undefined) patch.comment_en = v.comment_en

    // ссылки
    if (v.category) patch.material_category_id = v.category.id
    if (v.assortment_type) patch.assortment_type_id = v.assortment_type.id

    return patch
}

/** Удобный ресет VM (если нужно) */
export function resetVM(target = vm) {
    Object.assign(target, {
        id: null,
        brand: '',
        B_D: null,
        height: null,
        strength: null,
        length: null,
        dense: null,
        hardness: null,
        tear_resistance: null,
        elongation: null,
        quantity: null,
        price: null,
        comment: null,
        comment_en: null,
        category: null,
        assortment_type: null,
    } satisfies MaterialVM)
}
