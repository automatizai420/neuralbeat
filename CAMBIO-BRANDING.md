# 🎯 Cambio de Branding: Coherencia → NeuralBeat

## 📋 Cambios Realizados

### 1. **Nombre de la Aplicación**
```
ANTES: Coherencia
DESPUÉS: NeuralBeat
```

**Razón:** "NeuralBeat" refleja mejor la funcionalidad completa:
- **Neural** → Ondas cerebrales (Delta, Theta, Alpha, Beta, Gamma)
- **Beat** → Beats binaurales + Coherencia cardíaca

---

### 2. **Archivos Actualizados**

#### **index.html**
```html
<!-- ANTES -->
<title>Coherencia · v8</title>
<div class="hdr-title">Coherencia</div>

<!-- DESPUÉS -->
<title>NeuralBeat · v8</title>
<div class="hdr-title">NeuralBeat</div>
```

#### **coherencia8.html**
```html
<!-- ANTES -->
<title>Coherencia · v7.1</title>
<div class="hdr-title">Coherencia</div>

<!-- DESPUÉS -->
<title>NeuralBeat · v8</title>
<div class="hdr-title">NeuralBeat</div>
```

---

### 3. **Mobile: Navegación Mejorada**

#### **Problema Original:**
- ❌ Grupos de Temas/Idioma/Opciones no se veían en mobile
- ❌ Header muy saturado
- ❌ Difícil de usar en pantallas pequeñas

#### **Solución Implementada:**

**Desktop (sin cambios):**
```
[NeuralBeat] [v8] _____

TEMAS          IDIOMA         OPCIONES
⚡🌲🕯️🌊      ES EN FR PT    ⚙ ▾           [∂ Ciencia]  [●]
```

**Mobile (optimizado):**
```
[NeuralBeat] _____

TEMAS    IDIOMA    OPC
⚡🕯️    ES EN PT  ⚙▾   [∂]  [☰]  [●]
```

**Cambios mobile:**
- ✅ Labels más pequeños (5.5px)
- ✅ Solo 2 temas: ⚡ Cyber y 🕯️ Warm (los más usados)
- ✅ Solo 3 idiomas: ES, EN, PT (los principales)
- ✅ Botones más compactos
- ✅ Header reducido de 52px → 48px
- ✅ Todo visible y funcional

---

## 🎨 Estilos Mobile Específicos

### **Grupos Compactos**
```css
.hdr-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.hdr-group-label {
  font-size: 5.5px;
  letter-spacing: 1px;
  opacity: .4;
  line-height: 1;
}
```

### **Temas Mobile**
```css
/* Solo mostrar Cyber (⚡) y Warm (🕯️) */
.theme-selector .theme-btn:nth-child(2),
.theme-selector .theme-btn:nth-child(4) {
  display: none;
}
```

### **Idiomas Mobile**
```css
/* Solo mostrar ES, EN, PT */
.lang-selector .lang-btn:nth-child(3),
.lang-selector .lang-btn:nth-child(n+5) {
  display: none;
}
```

---

## 📱 Experiencia Mobile

### **Antes:**
```
[Coherencia] [v8] _____
[☰ Presets] [∂ Ciencia] [●]

❌ No se veían temas
❌ No se veía idioma
❌ No se veían opciones
```

### **Después:**
```
[NeuralBeat] _____

TEMAS    IDIOMA    OPC
⚡🕯️    ES EN PT  ⚙▾   [∂]  [☰]  [●]

✅ Temas visibles (2 principales)
✅ Idiomas visibles (3 principales)
✅ Opciones accesibles (dropdown)
✅ Todo funcional
```

---

## 🔧 Compatibilidad

### **LocalStorage Keys (sin cambios)**
```javascript
// Mantenemos las keys originales para compatibilidad
localStorage.getItem('coherencia_lang')
localStorage.getItem('coherencia_theme')
localStorage.getItem('coherencia_wizards_seen')
```

**Razón:** Los usuarios existentes no pierden sus preferencias guardadas.

---

## 🎯 Beneficios del Cambio

### **Branding:**
1. ✅ Nombre más descriptivo de la funcionalidad
2. ✅ Refleja tanto ondas cerebrales como coherencia cardíaca
3. ✅ Más memorable y profesional
4. ✅ Mejor para SEO y marketing

### **Mobile UX:**
1. ✅ Navegación completa visible
2. ✅ Header más compacto (48px vs 52px)
3. ✅ Acceso rápido a temas e idiomas
4. ✅ Menos scrolling necesario
5. ✅ Mejor uso del espacio limitado

---

## 📊 Comparación Visual

### **Desktop (sin cambios significativos)**
```
┌─────────────────────────────────────────────────────────┐
│ NeuralBeat  v8  ___  TEMAS  IDIOMA  OPC  ∂  ●          │
└─────────────────────────────────────────────────────────┘
```

### **Mobile (optimizado)**
```
┌──────────────────────────┐
│ NeuralBeat  ___          │
│ TEMAS  IDIOMA  OPC  ∂ ☰ ●│
└──────────────────────────┘
```

---

## 🚀 Próximos Pasos Opcionales

### **Branding Adicional:**
1. Actualizar favicon con logo "NB"
2. Crear logo SVG para el header
3. Actualizar meta tags (og:title, twitter:title)
4. Actualizar README.md con nuevo nombre

### **Mobile Enhancements:**
1. Agregar gesture swipe para cambiar temas
2. Menú hamburguesa con todas las opciones
3. Bottom sheet para configuración completa
4. Shortcuts de teclado para desktop

---

## 💡 Notas Técnicas

### **Por qué mantener "coherencia_" en localStorage:**
```javascript
// ✅ CORRECTO: Mantener compatibilidad
localStorage.getItem('coherencia_lang')

// ❌ INCORRECTO: Romper datos existentes
localStorage.getItem('neuralbeat_lang')
```

Si cambiáramos las keys, los usuarios perderían:
- Idioma seleccionado
- Tema preferido
- Wizards ya vistos

**Solución:** Mantener keys internas, cambiar solo branding visible.

---

## 📝 Checklist de Implementación

- [x] Cambiar título en index.html
- [x] Cambiar título en coherencia8.html
- [x] Cambiar header title en ambos archivos
- [x] Optimizar mobile: temas (2 botones)
- [x] Optimizar mobile: idiomas (3 botones)
- [x] Optimizar mobile: header compacto (48px)
- [x] Mantener localStorage keys (compatibilidad)
- [ ] Actualizar favicon (opcional)
- [ ] Actualizar meta tags (opcional)
- [ ] Actualizar README.md (opcional)

---

*Última actualización: Mayo 2026*
