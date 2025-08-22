export interface GostBase {
    number: string;
}

export interface GostCreate extends GostBase {}

export interface GostUpdate {
    number?: string | null;
}

export interface GostOut extends GostBase {
    id: number;
    is_general: boolean;
}