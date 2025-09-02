// src/services/interfaces/resources/machine-type.interface.ts
import { MethodOut } from "@/services/interfaces/resources/method.interface";

export interface MachineTypeBase {
    name: string;
    method_id: number;
}

export interface MachineTypeCreate extends MachineTypeBase {}

export interface MachineTypeUpdate {
    name?: string | null;
    method_id?: number | null;
}

export interface MachineTypeOut extends MachineTypeBase {
    id: number;
    is_general: boolean;
    method?: MethodOut | null;
}
