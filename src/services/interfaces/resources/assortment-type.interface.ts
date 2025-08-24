import {GostOut} from "@/services/interfaces/resources/gost.interface";

export interface AssortmentTypeBase {
    name: string;
    gost_id: number;
}

export interface AssortmentTypeCreate extends AssortmentTypeBase {}

export interface AssortmentTypeUpdate {
    name?: string | null;
    gost_id: number | null;
}

export interface AssortmentTypeOut extends AssortmentTypeBase {
    id: number;
    is_general: boolean;
    gost: GostOut;
}