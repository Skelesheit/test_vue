// resources.tooling.ts

import {
    MachineOut
} from "@/services/interfaces/resources/machine.interface";

interface ToolingBase {
    name: string
    mark: string
    gost: string
    machine_id: number
    B: number
    L: number
    A: number
    h_d: number
}

export interface ToolingCreate extends ToolingBase {

}

export interface ToolingUpdate {
    name: string | null
    mark: string | null
    gost: string | null
    machine_id: number | null
    B: number | null
    L: number | null
    A: number | null
    h_d: number | null
}

export interface ToolingOut {
    id: number
    machine: MachineOut
}
