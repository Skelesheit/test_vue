// tools.interface.ts

import {
  MachineOut
} from "@/services/interfaces/resources/machine.interface";

interface ToolBase {
  name: string
  mark: string
  gost: string
  machine_id: number
  K_H_D: number
  alpha_B_d: number
  L: number
  I_max_cut: number
  S: number
}

// Create payload: nullable fields to align with flexible form usage
export interface ToolCreate extends ToolBase {

}

// Update payload: same shape, all nullable
export interface ToolUpdate {
  name: string | null
  mark: string | null
  gost: string | null
  machine_id: number | null
  K_H_D: number | null
  alpha_B_d: number | null
  L: number | null
  I_max_cut: number | null
  S: number | null
}

// Out model (what API returns). Only foreign ids, no nested objects.
export interface ToolOut extends ToolBase {
  id: number
  machine: MachineOut
}
