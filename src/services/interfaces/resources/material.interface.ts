import {MaterialCategoryOut} from "@/services/interfaces/resources/material-category.interface";
import {AssortmentTypeOut} from "@/services/interfaces/resources/assortment-type.interface";


export interface MaterialBase {
    mark: string;

    DB: number;
    height: number;
    strength: number;
    length: number;

    dense: number;
    hardness: number;
    tear_resistance: number;
    elongation: number;

    quantity: number;
    price: number;

    comment?: string | null;
    comment_en?: string | null;

    category_id: number;
    assortment_type_id: number;
}

export interface MaterialCreate extends MaterialBase {
}

export interface MaterialUpdate {
    mark?: string | null;

    DB?: number | null;
    height?: number | null;
    strength?: number | null;
    length?: number | null;

    dense?: number | null;
    hardness?: number | null;
    tear_resistance?: number | null;
    elongation?: number | null;

    quantity?: number | null;
    price?: number | null;

    comment?: string | null;
    comment_en?: string | null;

    category_id?: number | null;
    assortment_type_id?: number | null;
}

export interface MaterialOut extends MaterialBase {
    id: number;
    category?: MaterialCategoryOut | null;
    assortment_type?: AssortmentTypeOut | null;
}
