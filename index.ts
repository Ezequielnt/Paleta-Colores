import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
import type { ColorRequest } from "./types/types";

import {
  guardarPaleta,
  obtenerTodasLasPaletas,
  obtenerPaletaPorId,
  eliminarPaleta,
  existePaletaConNombre
} from "./db/database";

const app = express();
const port = 3000;

// ✅ HABILITA CORS
app.use(cors());

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ GUARDAR NUEVA PALETA
app.post("/register", (req: Request, res: Response) => {
  try {
    const { nombre, colores }: ColorRequest = req.body;

    if (!nombre || !colores || !Array.isArray(colores)) {
      return res.status(400).json({
        error: "Se requiere 'nombre' y 'colores' (array)"
      });
    }

    if (existePaletaConNombre(nombre)) {
      return res.status(409).json({
        error: "Ya existe una paleta con ese nombre"
      });
    }

    if (colores.length !== 10) {
      return res.status(400).json({
        error: "El array 'colores' debe tener exactamente 10 elementos"
      });
    }

    const paleta = guardarPaleta(nombre, colores);

    res.status(201).json({
      mensaje: "Paleta guardada exitosamente",
      paleta
    });

  } catch (error) {
    console.error("Error al guardar paleta:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ✅ OBTENER TODAS LAS PALETAS
app.get("/paletas", (req: Request, res: Response) => {
  try {
    const paletas = obtenerTodasLasPaletas();
    res.json(paletas);
  } catch (error) {
    console.error("Error al obtener paletas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ✅ OBTENER PALETA POR ID
app.get("/paletas/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const paleta = obtenerPaletaPorId(id);

    if (!paleta) {
      return res.status(404).json({ error: "Paleta no encontrada" });
    }

    res.json(paleta);
  } catch (error) {
    console.error("Error al obtener paleta:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ✅ ELIMINAR PALETA
app.delete("/paletas/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  const borrada = eliminarPaleta(id);

  if (!borrada) {
    return res.status(404).json({ error: "Paleta no encontrada" });
  }

  res.json({ mensaje: "Paleta eliminada correctamente" });
});

// ✅ RUTA RAÍZ
app.get("/", (req: Request, res: Response) => {
  res.send("API Paleta de Colores funcionando ✅");
});

// ✅ SERVER SIEMPRE AL FINAL
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
