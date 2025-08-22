// types/material-category.ts
import type { MetalType } from '@/services/enums';

export interface MaterialCategoryBase {
    material_type: MetalType;
    name: string;
}

export interface MaterialCategoryCreate extends MaterialCategoryBase {}

export interface MaterialCategoryUpdate {
    material_type?: MetalType | null;
    name?: string | null;
}

export interface MaterialCategoryOut extends MaterialCategoryBase {
    id: number;
    is_general: boolean;
}
