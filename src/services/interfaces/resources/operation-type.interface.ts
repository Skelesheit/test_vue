// src/services/interfaces/resources/operation-type.interface.ts

export interface OperationTypeBase {
    name: string;
}

export interface OperationTypeCreate extends OperationTypeBase {}

export interface OperationTypeUpdate {
    name?: string | null;
}

export interface OperationTypeOut extends OperationTypeBase {
    id: number;
    is_general: boolean;
}
