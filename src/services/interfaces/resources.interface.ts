import {MetalType} from "@/services/enums";


export interface MaterialCategoryBase {
    material_type: MetalType;
    name: string;
}

export interface MaterialCategoryUpdate {
    material_type?: MetalType;
    name?: string;
}

export interface MaterialCategoryCreate extends MaterialCategoryBase {}
export interface MaterialCategoryOut extends MaterialCategoryBase {
    id: number;
}

export interface MaterialBase {
    category_id: number;
    brand: string;
    dense: number;
    hardness: number;
    tear_resistance: number;
    elongation: number;
}

export interface MaterialCreate extends MaterialBase {}
export interface MaterialUpdate {
    category_id?: number;
    brand?: string;
    dense?: number;
    hardness?: number;
    tear_resistance?: number;
    elongation?: number;
}

export interface MaterialOut extends MaterialBase {
    id: number;
    category?: MaterialCategoryOut;
}

export interface OperationTypeBase {
    name: string;
}

export interface OperationTypeCreate extends OperationTypeBase {}
export interface OperationTypeUpdate {
    name?: string;
}
export interface OperationTypeOut extends OperationTypeBase {
    id: number;
}

export interface MethodBase {
    name: string;
    operation_type_id: number;
}

export interface MethodCreate extends MethodBase {}
export interface MethodUpdate extends Partial<MethodBase> {}
export interface MethodOut extends MethodBase {
    id: number;
}

export interface MachineTypeBase {
    name: string;
    method_id: number;
}

export interface MachineTypeCreate extends MachineTypeBase {}
export interface MachineTypeUpdate {
    name?: string;
    method_id?: number;
}
export interface MachineTypeOut extends MachineTypeBase {
    id: number;
}

export interface MachineBase {
    name: string;
    machine_type_id: number;
    count: number;
    X: number;
    Y: number;
    Z: number;
    H: number;
    D: number;
}

export interface MachineCreate extends MachineBase {}
export interface MachineUpdate {
    name?: string;
    machine_type_id?: number;
    count?: number;
    X?: number;
    Y?: number;
    Z?: number;
    H?: number;
    D?: number;
}
export interface MachineOut extends MachineBase {
    id: number;
}

export interface ToolingBase {
    name: string;
    mark: string;
    gost: string;
    machine_id: number;
    h_d_foot: number;
    B: number;
    L: number;
    A: number;
    h_d: number;
}

export interface ToolingCreate extends ToolingBase {}
export interface ToolingUpdate {
    name?: string;
    mark?: string;
    gost?: string;
    machine_id?: number;
    h_d_foot?: number;
    B?: number;
    L?: number;
    A?: number;
    h_d?: number;
}
export interface ToolingOut extends ToolingBase {
    id: number;
}

export interface ToolBase {
    name: string;
    mark: string;
    gost: string;
    machine_id: number;
    K_H_D: number;
    alpha_B_d: number;
    L: number;
    I_max_cut: number;
    S: number;
}

export interface ToolCreate extends ToolBase {}
export interface ToolUpdate {
    name?: string;
    mark?: string;
    gost?: string;
    machine_id?: number;
    K_H_D?: number;
    alpha_B_d?: number;
    L?: number;
    I_max_cut?: number;
    S?: number;
}
export interface ToolOut extends ToolBase {
    id: number;
}

export interface GostBase {
    number: string;
}

export interface GostCreate extends GostBase {}
export interface GostUpdate {
    number?: string;
}
export interface GostOut extends GostBase {
    id: number;
}

export interface AssortmentTypeBase {
    name: string;
}

export interface AssortmentTypeCreate extends AssortmentTypeBase {}
export interface AssortmentTypeUpdate {
    name?: string;
}
export interface AssortmentTypeOut extends AssortmentTypeBase {
    id: number;
}

export interface GostAssortmentBase {
    gost_id: number;
    assortment_type_id: number;
}

export interface GostAssortmentCreate extends GostAssortmentBase {}
export interface GostAssortmentUpdate {
    gost_id?: number;
    assortment_type_id?: number;
}

export interface GostAssortmentOut extends GostAssortmentBase {
    id: number;
    gost: GostOut;
    assortment_type: AssortmentTypeOut;
}

export interface GostAssortmentBatchCreate {
    assortment_type_id: number;
    gosts: number[];
    enterprise_id: number;
}

export interface GostAssortmentBatchOut {
    id: number;
    assortment_type_id: number;
    gosts: number[];
    enterprise_id: number;
}

export interface AssortmentBase {
    gost_material_id: number;
    B_D: number;
    height: number;
    strength: number;
    length: number;
}

export interface AssortmentCreate extends AssortmentBase {}
export interface AssortmentUpdate {
    gost_material_id?: number;
    B_D?: number;
    height?: number;
    strength?: number;
    length?: number;
}

export interface AssortmentOut extends AssortmentBase {
    id: number;
    gost_assortment_model: GostAssortmentOut;
}
