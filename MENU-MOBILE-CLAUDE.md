# 📱 Menú Mobile Tipo Claude · NeuralBeat

## 🎯 Cambios Implementados

### **PROBLEMA ORIGINAL:**
```
❌ "Coherencia" seguía visible en mobile
❌ Opciones de temas/idiomas no visibles
❌ "inactivo" ocupaba espacio innecesario
❌ Navegación limitada en mobile
```

### **SOLUCIÓN:**
```
✅ "NeuralBeat" visible correctamente
✅ Menú hamburguesa completo tipo Claude
✅ "inactivo" oculto en mobile
✅ Navegación completa: Presets, Temas, Idiomas, Opciones
```

---

## 🎨 Diseño del Menú

### **Estructura:**

```
┌─────────────────────────┐
│ NEURALBEAT          ✕   │  ← Header
├─────────────────────────┤
│ PROGRAMAS               │
│ 🎵 Ver todos los presets│
├─────────────────────────┤
│ TEMAS                   │
│ ⚡ 🌲 🕯️ 🌊            │  ← Grid 4 columnas
├─────────────────────────┤
│ IDIOMA                  │
│ ES  EN  FR              │  ← Grid 3 columnas
│ PT  中文  हिं          │
├─────────────────────────┤
│ OPCIONES                │
│ 🔄 Reactivar Wizards    │
│ ∂  Ciencia              │
└─────────────────────────┘
```

---

## ✨ Características

### 1. **Overlay con Blur**
```css
background: rgba(0,0,0,.6);
backdrop-filter: blur(2px);
```
- Oscurece el fondo
- Efecto blur sutil
- Click fuera cierra el menú

### 2. **Panel Deslizante**
```css
transform: translateX(-100%);  /* Cerrado */
transform: translateX(0);      /* Abierto */
transition: .3s cubic-bezier(.4,0,.2,1);
```
- Animación suave desde la izquierda
- 280px de ancho (85vw máximo)
- Scroll interno si es necesario

### 3. **Secciones Organizadas**
- **Programas** — Acceso rápido a presets
- **Temas** — Grid visual de 4 temas
- **Idioma** — Grid de 6 idiomas
- **Opciones** — Wizards y Ciencia

### 4. **Botones Grandes y Táctiles**
```css
.mob-menu-theme-btn {
  aspect-ratio: 1;
  font-size: 20px;  /* Emojis grandes */
}

.mob-menu-item {
  padding: 12px;
  font-size: 18px;  /* Iconos grandes */
}
```

---

## 🔧 Funcionalidad JavaScript

### **Abrir Menú**
```javascript
export function openMobMenu() {
  const overlay = document.getElementById('mobMenuOverlay');
  const panel = document.getElementById('mobMenuPanel');
  
  overlay.classList.add('open');
  panel.style.display = 'block';
  setTimeout(() => panel.classList.add('open'), 10);
  
  // Prevenir scroll del body
  document.body.style.overflow = 'hidden';
}
```

### **Cerrar Menú**
```javascript
export function closeMobMenu() {
  const overlay = document.getElementById('mobMenuOverlay');
  const panel = document.getElementById('mobMenuPanel');
  
  overlay.classList.remove('open');
  panel.classList.remove('open');
  setTimeout(() => panel.style.display = 'none', 300);
  
  // Restaurar scroll
  document.body.style.overflow = '';
}
```

### **Actualizar Estados**
```javascript
// Actualizar tema activo
export function updateMobMenuTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  document.querySelectorAll('.mob-menu-theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === currentTheme);
  });
}

// Actualizar idioma activo
export function updateMobMenuLang() {
  document.querySelectorAll('.mob-menu-lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === LANG);
  });
}
```

---

## 📱 Header Mobile Simplificado

### **ANTES:**
```
[Coherencia] [v8] _____ [☰ Presets] [∂] [● inactivo]
```

### **DESPUÉS:**
```
[NeuralBeat] _____ [☰ Menu] [∂] [●]
```

**Cambios:**
- ✅ "Coherencia" → "NeuralBeat"
- ✅ "Presets" → "Menu" (más genérico)
- ✅ "inactivo" oculto (innecesario)
- ✅ Más espacio, más limpio

---

## 🎯 Flujo de Usuario

### **Escenario 1: Cambiar Tema**
1. Usuario toca **☰ Menu**
2. Menú se desliza desde la izquierda
3. Ve sección **TEMAS** con 4 opciones visuales
4. Toca emoji del tema deseado
5. Tema cambia instantáneamente
6. Botón se marca como activo
7. Usuario puede cerrar o seguir navegando

### **Escenario 2: Cambiar Idioma**
1. Usuario toca **☰ Menu**
2. Scroll a sección **IDIOMA**
3. Ve grid de 6 idiomas
4. Toca idioma deseado
5. Interfaz se traduce instantáneamente
6. Botón se marca como activo

### **Escenario 3: Ver Presets**
1. Usuario toca **☰ Menu**
2. Toca **🎵 Ver todos los presets**
3. Menú se cierra
4. Bottom sheet de presets se abre
5. Usuario selecciona preset

---

## 🎨 Estilos Clave

### **Grid de Temas (4 columnas)**
```css
.mob-menu-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.mob-menu-theme-btn {
  aspect-ratio: 1;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 20px;
}

.mob-menu-theme-btn.active {
  border-color: var(--primary);
  background: var(--border2);
  box-shadow: 0 0 8px var(--primary);
}
```

### **Grid de Idiomas (3 columnas)**
```css
.mob-menu-lang-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.mob-menu-lang-btn {
  padding: 8px;
  font-family: var(--mono);
  font-size: 9px;
}

.mob-menu-lang-btn.active {
  border-color: var(--primary);
  background: var(--border2);
  color: var(--primary);
}
```

### **Items de Opciones**
```css
.mob-menu-item {
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.mob-menu-item-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.mob-menu-item-text {
  font-family: var(--mono);
  font-size: 9px;
  color: var(--text);
}
```

---

## 🌍 Traducciones

### **Español:**
```javascript
mobMenuBtn: '☰ Menu'
mobMenuPresets: 'Programas'
mobMenuPresetsDesc: 'Ver todos los presets'
```

### **Inglés:**
```javascript
mobMenuBtn: '☰ Menu'
mobMenuPresets: 'Programs'
mobMenuPresetsDesc: 'View all presets'
```

---

## 📊 Comparación: Antes vs Después

### **Navegación Mobile**

| Función | Antes | Después |
|---------|-------|---------|
| **Cambiar Tema** | ❌ No visible | ✅ Grid visual 4 opciones |
| **Cambiar Idioma** | ❌ No visible | ✅ Grid 6 idiomas |
| **Ver Presets** | ✅ Bottom sheet | ✅ Desde menú |
| **Reactivar Wizards** | ❌ No visible | ✅ En opciones |
| **Ver Ciencia** | ✅ Header | ✅ Header + Menú |
| **Status "inactivo"** | ❌ Visible | ✅ Oculto |

### **Espacio en Header**

| Elemento | Antes | Después |
|----------|-------|---------|
| Título | Coherencia | NeuralBeat |
| Subtítulo | v8 | (oculto) |
| Grupos | No visibles | (ocultos) |
| Botón Menu | "☰ Presets" | "☰ Menu" |
| Status Text | "inactivo" | (oculto) |
| **Total Height** | 52px | 48px |

---

## 🚀 Beneficios

### **UX:**
1. ✅ Navegación completa en mobile
2. ✅ Acceso rápido a todas las funciones
3. ✅ Interfaz familiar (tipo Claude)
4. ✅ Botones grandes y táctiles
5. ✅ Visual claro con emojis

### **Performance:**
1. ✅ Animaciones suaves (cubic-bezier)
2. ✅ Scroll optimizado (-webkit-overflow-scrolling)
3. ✅ Prevención de scroll del body
4. ✅ Lazy display (display:none cuando cerrado)

### **Accesibilidad:**
1. ✅ Botones grandes (mínimo 44x44px)
2. ✅ Contraste adecuado
3. ✅ Labels descriptivos
4. ✅ Feedback visual (active states)

---

## 💡 Próximas Mejoras Opcionales

1. **Gesture Swipe** — Deslizar desde borde para abrir
2. **Shortcuts** — Mantener presionado para acciones rápidas
3. **Búsqueda** — Buscar presets desde el menú
4. **Favoritos** — Marcar presets favoritos
5. **Historial** — Ver presets usados recientemente

---

*Última actualización: Mayo 2026*
