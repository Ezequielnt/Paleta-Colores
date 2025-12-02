import Database from "better-sqlite3";
import path from "path";
import type { ColoresPaleta } from "../types/types";

const dbPath = path.join(__dirname, "../data/paletas.db");

const db = new Database(dbPath);

// ✅ CREAR TABLA SI NO EXISTE
db.exec(`
  CREATE TABLE IF NOT EXISTS paletas (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    colores TEXT NOT NULL
  )
`);

// ✅ GENERAR ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ✅ GUARDAR PALETA
export function guardarPaleta(nombre: string, colores: string[]): ColoresPaleta {
  const id = generateId();
  const coloresJson = JSON.stringify(colores);

  const stmt = db.prepare(
    "INSERT INTO paletas (id, nombre, colores) VALUES (?, ?, ?)"
  );
  stmt.run(id, nombre, coloresJson);

  return {
    id,
    nombre,
    colores: colores as unknown as string[10],
  };
}

// ✅ OBTENER TODAS
export function obtenerTodasLasPaletas(): ColoresPaleta[] {
  const stmt = db.prepare("SELECT * FROM paletas");
  const rows = stmt.all() as Array<{ id: string; nombre: string; colores: string }>;

  return rows.map(row => ({
    id: row.id,
    nombre: row.nombre,
    colores: JSON.parse(row.colores) as string[10],
  }));
}

// ✅ OBTENER POR ID
export function obtenerPaletaPorId(id: string): ColoresPaleta | null {
  const stmt = db.prepare("SELECT * FROM paletas WHERE id = ?");
  const row = stmt.get(id) as
    | { id: string; nombre: string; colores: string }
    | undefined;

  if (!row) return null;

  return {
    id: row.id,
    nombre: row.nombre,
    colores: JSON.parse(row.colores) as string[10],
  };
}

export function cerrarBaseDeDatos(): void {
  db.close();
}

export default db;

export function existePaletaConNombre(nombre: string): boolean {
  const stmt = db.prepare("SELECT id FROM paletas WHERE nombre = ?");
  const row = stmt.get(nombre);
  return !!row;
}

export function eliminarPaleta(id: string): boolean {
  const stmt = db.prepare("DELETE FROM paletas WHERE id = ?");
  const result = stmt.run(id);
  return result.changes > 0;
}
