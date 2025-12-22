# 🎨 Frontend - Gestor de Paletas de Colores

## 📁 Estructura de Archivos

```
frontend/
├── src/
│   ├── styles/
│   │   └── main.css          # Estilos principales con CSS Variables
│   ├── ui/
│   │   └── crearPaletaUI.ts  # Interfaz de usuario principal
│   ├── services/
│   │   └── paletasService.ts # Servicios de API
│   └── main.ts               # Punto de entrada de la aplicación
├── index.html                # HTML principal
├── vite.config.ts           # Configuración de Vite
├── package.json             # Dependencias y scripts
└── Dockerfile               # Configuración de Docker
```

## 🎨 Sistema de Estilos

### Variables CSS (CSS Custom Properties)

El proyecto utiliza un sistema de variables CSS para mantener consistencia y facilitar el mantenimiento:

```css
:root {
  /* Colores */
  --primary-dark: #1a1a2e;
  --accent-purple: #8b5cf6;

  /* Espaciado */
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;

  /* Bordes */
  --border-radius-md: 0.75rem;

  /* Sombras */
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

  /* Transiciones */
  --transition-normal: 0.3s ease-in-out;
}
```

### Componentes Principales

#### 1. Layout Principal (`#root`)
- Fondo oscuro con gradiente sutil
- Bordes redondeados y sombra profunda
- Indicador superior con gradiente

#### 2. Formularios
- Input de nombre con focus states avanzados
- Grid responsivo para selectores de color
- Estilos hover y focus consistentes

#### 3. Botones
- Gradientes dinámicos
- Efectos hover con elevación
- Estados activos y transiciones suaves

#### 4. Modal Personalizado
- Overlay con blur effect
- Animaciones de entrada/salida
- Diseño centrado y responsivo

#### 5. Lista de Paletas
- Grid responsive
- Cards con hover effects
- Colores de muestra con bordes

### 🎯 Características de Diseño

#### Diseño Moderno
- **Paleta de colores oscura** con acentos púrpuras
- **Gradientes sutiles** para elementos interactivos
- **Sombras profundas** para profundidad visual
- **Animaciones fluidas** en todas las interacciones

#### Tipografía
- **Inter** como fuente principal (Google Fonts)
- **Peso variable** (400, 500, 600, 700)
- **Smoothing** para mejor legibilidad

#### Responsive Design
- **Breakpoints** en 768px y 480px
- **Grid flexible** que se adapta al tamaño de pantalla
- **Componentes modulares** que mantienen proporciones

#### Accesibilidad
- **Contraste adecuado** entre texto y fondo
- **Estados de focus** claramente visibles
- **Reducción de movimiento** para usuarios sensibles
- **Modo de alto contraste** soportado

### 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo con hot reload

# Producción
npm run build        # Construir para producción
npm run preview      # Vista previa de la build
```

### 🐳 Docker

```bash
# Construir imagen
docker build -t frontend-paletas .

# Ejecutar contenedor
docker run -p 5173:5173 frontend-paletas
```

### 🎨 Personalización

Para modificar colores o estilos:

1. **Colores**: Editar las variables CSS en `:root`
2. **Componentes**: Modificar las clases específicas
3. **Responsive**: Ajustar los media queries
4. **Animaciones**: Cambiar las transiciones y keyframes

### 📱 Navegadores Soportados

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

**Desarrollado con ❤️ usando TypeScript, CSS moderno y mejores prácticas de desarrollo web.**
