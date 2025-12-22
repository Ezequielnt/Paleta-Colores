const API_URL = window.location.hostname === "localhost"
  ? "http://localhost:3000"
  : window.location.origin;

export function crearPaletaUI(rootId: string) {
  const app = document.getElementById(rootId);
  if (!app) return;

  app.innerHTML = `
    <h1>🎨 Gestor de Paletas</h1>

    <h2>Crear nueva paleta</h2>
    <input id="nombre" placeholder="Nombre de la paleta" />

    <div id="colores"></div>

    <button id="guardar">Guardar paleta</button>

    <h2>Resultado</h2>
    <pre id="result"></pre>

    <h2>Paletas guardadas</h2>
    <button id="cargar">Cargar paletas</button>

    <div id="lista"></div>
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
        paletaDiv.innerHTML = `
          <h3>${paleta.nombre}</h3>
          <div class="color-samples">
            ${paleta.colores.map((c: string) =>
              `<span class="color-sample" style="background:${c};"></span>`
            ).join("")}
          </div>
          <button class="btn-borrar" data-id="${paleta.id}">
            🗑️ Eliminar
          </button>
        `;

        lista.appendChild(paletaDiv);
      });

    } catch {
      lista.textContent = "❌ Error al cargar paletas";
    }
  }

  // ✅ Función para mostrar modal de confirmación personalizado
  function mostrarConfirmacion(mensaje: string): Promise<boolean> {
    return new Promise((resolve) => {
      // Crear overlay
      const overlay = document.createElement("div");
      overlay.className = "modal-overlay";
      overlay.id = "confirm-modal";

      // Crear contenido del modal
      overlay.innerHTML = `
        <div class="modal-content">
          <h3>⚠️ Confirmar eliminación</h3>
          <p>${mensaje}</p>
          <div class="modal-buttons">
            <button class="modal-btn modal-btn-confirm" id="confirm-yes">Sí, eliminar</button>
            <button class="modal-btn modal-btn-cancel" id="confirm-no">Cancelar</button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      // Mostrar modal con animación
      setTimeout(() => {
        overlay.classList.add("active");
      }, 10);

      // Botón confirmar
      const btnYes = overlay.querySelector("#confirm-yes") as HTMLElement;
      btnYes.addEventListener("click", () => {
        overlay.classList.remove("active");
        setTimeout(() => {
          overlay.remove();
          resolve(true);
        }, 300);
      });

      // Botón cancelar
      const btnNo = overlay.querySelector("#confirm-no") as HTMLElement;
      btnNo.addEventListener("click", () => {
        overlay.classList.remove("active");
        setTimeout(() => {
          overlay.remove();
          resolve(false);
        }, 300);
      });

      // Cerrar al hacer clic fuera del modal
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          overlay.classList.remove("active");
          setTimeout(() => {
            overlay.remove();
            resolve(false);
          }, 300);
        }
      });

      // Cerrar con ESC
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          overlay.classList.remove("active");
          setTimeout(() => {
            overlay.remove();
            resolve(false);
          }, 300);
          document.removeEventListener("keydown", handleEsc);
        }
      };
      document.addEventListener("keydown", handleEsc);
    });
  }

  // ✅ Borrado con confirmación personalizada + animación
  document.addEventListener("click", async (e) => {
    const target = e.target as HTMLElement;
    
    // Buscar el botón de borrar (puede ser el target o un elemento padre)
    const btnBorrar = target.closest(".btn-borrar") as HTMLElement;
    
    if (btnBorrar) {
      const id = btnBorrar.dataset.id!;
      const confirmar = await mostrarConfirmacion("¿Seguro que deseas borrar esta paleta?");
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
