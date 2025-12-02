const API_URL = "http://localhost:3000";

export function crearPaletaUI(rootId: string) {
  const app = document.getElementById(rootId);
  if (!app) return;

  app.innerHTML = `
    <h1>🎨 Gestor de Paletas</h1>

    <h2>Crear nueva paleta</h2>
    <input id="nombre" placeholder="Nombre de la paleta" />

    <div id="colores" style="display:flex; gap:8px; margin:10px 0;"></div>

    <button id="guardar">Guardar paleta</button>

    <h2>Resultado</h2>
    <pre id="result"></pre>

    <h2>Paletas guardadas</h2>
    <button id="cargar">Cargar paletas</button>

    <div id="lista" style="margin-top:20px;"></div>
  `;

  const coloresDiv = document.getElementById("colores")!;
  const botonGuardar = document.getElementById("guardar")!;
  const botonCargar = document.getElementById("cargar")!;
  const result = document.getElementById("result")!;
  const lista = document.getElementById("lista")!;

  // ✅ 10 selectores de color
  for (let i = 0; i < 10; i++) {
    const input = document.createElement("input");
    input.type = "color";
    input.value = "#000000";
    coloresDiv.appendChild(input);
  }

  // ✅ Guardar paleta (CON MENSAJES LIMPIOS)
  botonGuardar.addEventListener("click", async () => {
    const nombre = (document.getElementById("nombre") as HTMLInputElement).value.trim();
    const colores: string[] = [];

    document.querySelectorAll("#colores input").forEach(input => {
      colores.push((input as HTMLInputElement).value);
    });

    if (!nombre) {
      result.textContent = "❌ Debes ingresar un nombre";
      result.style.color = "red";
      return;
    }

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, colores })
      });

      const data = await res.json();

      if (!res.ok) {
        result.textContent = data.error || "Error al guardar paleta";
        result.style.color = "red";
        return;
      }

      result.textContent = "✅ Paleta guardada correctamente";
      result.style.color = "green";

      (document.getElementById("nombre") as HTMLInputElement).value = "";
      cargarPaletas(); // ✅ refresco automático

    } catch {
      result.textContent = "❌ Error al conectar con la API";
      result.style.color = "red";
    }
  });

  // ✅ Cargar paletas
  botonCargar.addEventListener("click", cargarPaletas);

  // ✅ Cargar al iniciar
  cargarPaletas();

  // ✅ Pintar paletas
  async function cargarPaletas() {
    lista.innerHTML = "Cargando...";

    try {
      const res = await fetch(`${API_URL}/paletas`);
      const paletas = await res.json();

      lista.innerHTML = "";

      paletas.forEach((paleta: any) => {
        const paletaDiv = document.createElement("div");
        paletaDiv.className = "paleta";
        paletaDiv.style.border = "1px solid #ccc";
        paletaDiv.style.padding = "10px";
        paletaDiv.style.marginBottom = "10px";
        paletaDiv.style.borderRadius = "6px";
        paletaDiv.style.transition = "all 0.3s ease";

        paletaDiv.innerHTML = `
          <h3>${paleta.nombre}</h3>
          <div style="display:flex; gap:5px; margin-bottom:8px;">
            ${paleta.colores.map((c: string) =>
              `<span style="width:20px;height:20px;background:${c};
                display:inline-block;border-radius:4px;border:1px solid #0002;"></span>`
            ).join("")}
          </div>
          <button class="btn-borrar" data-id="${paleta.id}">
            ❌ Eliminar
          </button>
        `;

        lista.appendChild(paletaDiv);
      });

    } catch {
      lista.textContent = "❌ Error al cargar paletas";
    }
  }

  // ✅ Borrado con confirmación + animación
  document.addEventListener("click", async (e) => {
    const target = e.target as HTMLElement;
    
    // Buscar el botón de borrar (puede ser el target o un elemento padre)
    const btnBorrar = target.closest(".btn-borrar") as HTMLElement;
    
    if (btnBorrar) {
      const id = btnBorrar.dataset.id!;
      const confirmar = confirm("¿Seguro que deseas borrar esta paleta?");
      if (!confirmar) return;

      const paletaDiv = btnBorrar.closest(".paleta") as HTMLElement;

      // ✅ Animación de salida
      paletaDiv.style.opacity = "0";
      paletaDiv.style.transform = "scale(0.9)";
      
      setTimeout(async () => {
        await fetch(`${API_URL}/paletas/${id}`, { method: "DELETE" });
        cargarPaletas(); // ✅ refresco automático
      }, 300);
    }
  });
}
