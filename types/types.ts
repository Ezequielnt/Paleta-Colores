export interface ColoresPaleta {
    id: string;
    nombre: string;
    colores: string[10];
}

export type ColorRequest = Pick<ColoresPaleta, 'nombre' | 'colores'>;