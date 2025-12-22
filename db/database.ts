import mysql from "mysql2/promise";
import type { ColoresPaleta } from "../types/types";

// Configuración del Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "root",
  database: process.env.DB_NAME || "colores_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ FUNCION DE ESPERA (Delay)
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ✅ INICIALIZAR CON REINTENTOS (La clave del éxito)
export async function iniciarBaseDeDatos() {
  let intentos = 10;
  
  while (intentos > 0) {
    try {
      // Intentamos obtener una conexión del pool
      const connection = await pool.getConnection();
      
      console.log("✅ Conexión a MySQL exitosa. Verificando tabla...");
      
      await connection.query(`
        CREATE TABLE IF NOT EXISTS paletas (
          id VARCHAR(255) PRIMARY KEY,
          nombre VARCHAR(255) NOT NULL,
          colores TEXT NOT NULL
        )
      `);
      
      connection.release();
      console.log("🚀 Tabla 'paletas' lista.");
      return; // Éxito, salimos de la función

    } catch (error: any) {
      console.log(`❌ Error conectando a DB (Intentos restantes: ${intentos})...`);
      console.log(`   Razón: ${error.code || error.message}`);
      
      intentos--;
      await wait(5000); // Esperamos 5 segundos antes de reintentar
    }
  }
  
  console.error("💀 No se pudo conectar a la base de datos después de varios intentos.");
}

// Llamamos a la inicialización
iniciarBaseDeDatos();

// ... (El resto de tus funciones guardarPaleta, etc. siguen igual)
// ✅ GENERAR ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export async function guardarPaleta(nombre: string, colores: string[]): Promise<ColoresPaleta> {
  const id = generateId();
  const coloresJson = JSON.stringify(colores);
  await pool.query(
    "INSERT INTO paletas (id, nombre, colores) VALUES (?, ?, ?)",
    [id, nombre, coloresJson]
  );
  return { id, nombre, colores: colores as unknown as string[10] };
}

export async function obtenerTodasLasPaletas(): Promise<ColoresPaleta[]> {
  const [rows] = await pool.query("SELECT * FROM paletas");
  return (rows as any[]).map((row) => ({
    id: row.id,
    nombre: row.nombre,
    colores: JSON.parse(row.colores) as string[10],
  }));
}

export async function obtenerPaletaPorId(id: string): Promise<ColoresPaleta | null> {
  const [rows] = await pool.query("SELECT * FROM paletas WHERE id = ?", [id]);
  const resultados = rows as any[];
  if (resultados.length === 0) return null;
  const row = resultados[0];
  return {
    id: row.id,
    nombre: row.nombre,
    colores: JSON.parse(row.colores) as string[10],
  };
}

export async function existePaletaConNombre(nombre: string): Promise<boolean> {
  const [rows] = await pool.query("SELECT id FROM paletas WHERE nombre = ?", [nombre]);
  return (rows as any[]).length > 0;
}

export async function eliminarPaleta(id: string): Promise<boolean> {
  const [result] = await pool.query("DELETE FROM paletas WHERE id = ?", [id]);
  return (result as any).affectedRows > 0;
}