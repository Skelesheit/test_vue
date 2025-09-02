// src/services/interfaces/resources/machine.interface.ts
import { MachineTypeOut } from "@/services/interfaces/resources/machine-type.interface";

export interface MachineBase {
    name: string;
    machine_type_id: number;

    count: number;

    X: number;
    Y: number;
    Z: number;
    H: number;
    D: number;

    amortization_price: number;
    price_in_time: number;
}

export interface MachineCreate extends MachineBase {}

export interface MachineUpdate {
    name?: string | null;
    machine_type_id?: number | null;

    count?: number | null;

    X?: number | null;
    Y?: number | null;
    Z?: number | null;
    H?: number | null;
    D?: number | null;

    amortization_price?: number | null;
    price_in_time?: number | null;
}

export interface MachineOut extends MachineBase {
    id: number;
    machine_type?: MachineTypeOut | null;
}
