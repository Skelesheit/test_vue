// src/services/interfaces/resources/method.interface.ts
import { OperationTypeOut } from "@/services/interfaces/resources/operation-type.interface";

export interface MethodBase {
    name: string;
    operation_type_id: number;
}

export interface MethodCreate extends MethodBase {}

export interface MethodUpdate {
    name?: string | null;
    operation_type_id?: number | null;
}

export interface MethodOut extends MethodBase {
    id: number;
    is_general: boolean;
    operation_type?: OperationTypeOut | null;
}
