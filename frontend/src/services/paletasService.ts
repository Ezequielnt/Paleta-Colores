const API_URL = "http://localhost:3000";

export async function guardarPaleta(nombre: string, colores: string[]) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, colores })
  });

  return res.json();
}

export async function obtenerPaletas() {
  const res = await fetch(`${API_URL}/paletas`);
  return res.json();
}

export async function eliminarPaleta(id: string) {
  const res = await fetch(`http://localhost:3000/paletas/${id}`, {
    method: "DELETE"
  });

  return res.json();
}
