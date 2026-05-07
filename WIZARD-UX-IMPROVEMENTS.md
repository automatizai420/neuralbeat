# ✨ MEJORAS DE UX - SISTEMA DE WIZARDS

## 🎯 CAMBIOS IMPLEMENTADOS

### 1. ✅ Diseño Simplificado de Tarjetas de Preset

**Antes:**
```
┌─────────────────────────┐
│ Delta        2.5 Hz   ? │
│ Sueño Profundo          │
│ [200 Hz] [3 rpm]        │ ← Parámetros técnicos
└─────────────────────────┘
```

**Ahora:**
```
┌─────────────────────────┐
│ Delta        2.5 Hz   ? │
│ Sueño Profundo          │
└─────────────────────────┘
```

- ❌ Ocultos: Tags técnicos (200 Hz, 3 rpm, etc.)
- ✅ Visible: Solo nombre, frecuencia y botón "?"
- ✅ Diseño más limpio y menos abrumador

### 2. ✅ Wizard Automático en Primera Selección

**Comportamiento:**
- Al hacer clic en un preset por **primera vez**, se abre automáticamente el wizard educativo
- El preset se aplica normalmente
- En selecciones posteriores, el wizard NO se abre (ya fue visto)

**Ventajas:**
- Educación contextual automática
- No interrumpe usuarios experimentados
- Onboarding natural y progresivo

### 3. ✅ Checkbox "No Mostrar Más"

**Ubicación:** Último paso del wizard (Paso 4: Seguridad)

**Funcionalidad:**
- El usuario puede marcar "No mostrar este wizard nuevamente"
- La preferencia se guarda en `localStorage`
- Funciona tanto al cerrar (✕) como al aplicar preset (↗)

**Persistencia:**
- Se guarda por preset individual
- Sobrevive a recargas de página
- Se puede resetear con el botón "? Wizards"

### 4. ✅ Botón "? Wizards" en Header

**Ubicación:** Header, junto a "∂ Ciencia"

**Funcionalidad:**
- Resetea TODOS los wizards vistos
- Permite volver a ver los wizards educativos
- Útil para:
  - Repasar información
  - Compartir la app con otra persona
  - Revisar detalles olvidados

**Feedback:** Muestra un alert confirmando el reset

### 5. ✅ Botón "?" Mantiene Funcionalidad Original

**Comportamiento:**
- Siempre abre el wizard, sin importar si ya fue visto
- Útil para consultar información específica
- No afecta la preferencia "No mostrar más"

---

## 🔧 IMPLEMENTACIÓN TÉCNICA

### localStorage Schema

```javascript
{
  "coherencia_wizards_seen": {
    "delta": true,
    "theta": true,
    "alpha10": false,
    // ... resto de presets
  }
}
```

### Funciones Nuevas en app.js

```javascript
// Obtener wizards vistos
getSeenWizards() → Object

// Marcar wizard como visto
markWizardAsSeen(presetId) → void

// Verificar si fue visto
hasSeenWizard(presetId) → Boolean

// Resetear todos
resetAllWizards() → void

// Abrir wizard (con control de primera vez)
openWizard(presetId, forceOpen = false) → void
```

### Flujo de Decisión

```
Usuario hace clic en preset
         ↓
    applyPreset(id)
         ↓
    openWizard(id, false)
         ↓
   ¿Ya fue visto? ──→ SÍ → No abrir wizard
         ↓
        NO
         ↓
   Abrir wizard
         ↓
   Usuario navega 4 pasos
         ↓
   Último paso: checkbox visible
         ↓
   Usuario marca checkbox (opcional)
         ↓
   Cierra o aplica preset
         ↓
   ¿Checkbox marcado? ──→ SÍ → Guardar en localStorage
         ↓
        NO
         ↓
   No guardar (se mostrará próxima vez)
```

---

## 🎨 CAMBIOS CSS

### Tarjetas de Preset

```css
/* Ocultar parámetros técnicos */
.pc-params { display: none; }

/* Ajustar margen del beneficio */
.pc-benefit { margin-bottom: 0; }
```

### Checkbox "No Mostrar Más"

```css
.wiz-dont-show {
  margin-right: auto;
  padding: 4px 0;
}
```

---

## 🧪 CÓMO PROBAR

### Test 1: Primera Selección
1. Abre la app (o resetea wizards con "? Wizards")
2. Haz clic en preset "Delta"
3. ✅ Debe abrirse el wizard automáticamente
4. Navega hasta el último paso
5. ✅ Debe aparecer checkbox "No mostrar más"

### Test 2: Segunda Selección (Sin Marcar)
1. Cierra el wizard sin marcar checkbox
2. Haz clic en otro preset
3. Vuelve a hacer clic en "Delta"
4. ✅ Debe abrirse el wizard nuevamente

### Test 3: Segunda Selección (Marcado)
1. Abre wizard de "Theta"
2. Navega hasta el último paso
3. Marca checkbox "No mostrar más"
4. Cierra o aplica preset
5. Haz clic en "Theta" nuevamente
6. ✅ NO debe abrirse el wizard

### Test 4: Botón "?"
1. Marca "No mostrar más" en "Alpha"
2. Haz clic en el botón "?" de Alpha
3. ✅ Debe abrirse el wizard (ignora preferencia)

### Test 5: Reset Global
1. Marca varios presets como "No mostrar más"
2. Haz clic en "? Wizards" en el header
3. ✅ Debe mostrar alert de confirmación
4. Selecciona cualquier preset
5. ✅ Debe abrirse el wizard nuevamente

### Test 6: Persistencia
1. Marca "No mostrar más" en varios presets
2. Recarga la página (F5)
3. Selecciona esos presets
4. ✅ NO deben abrirse los wizards

---

## 📊 VENTAJAS DE UX

### Para Usuarios Nuevos
- ✅ Educación automática y contextual
- ✅ Aprenden sobre cada preset al usarlo
- ✅ No necesitan buscar información
- ✅ Onboarding natural y progresivo

### Para Usuarios Experimentados
- ✅ No interrumpe el flujo de trabajo
- ✅ Pueden marcar "No mostrar más"
- ✅ Acceso rápido con botón "?"
- ✅ Control total sobre la experiencia

### Para Todos
- ✅ Diseño más limpio y profesional
- ✅ Menos información visual abrumadora
- ✅ Información disponible cuando se necesita
- ✅ Flexibilidad y control

---

## 🐛 TROUBLESHOOTING

### Problema: Wizard no se abre automáticamente

**Diagnóstico:**
```javascript
// En consola
localStorage.getItem('coherencia_wizards_seen')
```

**Solución:** Si muestra el preset como `true`, hacer clic en "? Wizards" para resetear.

### Problema: Checkbox no guarda preferencia

**Diagnóstico:**
```javascript
// Verificar que localStorage funciona
localStorage.setItem('test', 'ok')
localStorage.getItem('test') // Debe retornar 'ok'
```

**Solución:** Verificar que el navegador permite localStorage (no modo incógnito).

### Problema: Botón "? Wizards" no aparece

**Solución:** Verificar que `resetAllWizards` está exportado en index.html:
```javascript
window.resetAllWizards = resetAllWizards;
```

---

## 📝 ARCHIVOS MODIFICADOS

1. **index.html**
   - CSS: Ocultar `.pc-params`
   - CSS: Añadir `.wiz-dont-show`
   - Header: Añadir botón "? Wizards"
   - Exports: Añadir `resetAllWizards`

2. **app.js**
   - Añadir funciones de localStorage
   - Modificar `openWizard()` con control de primera vez
   - Modificar `renderWizard()` para mostrar checkbox
   - Modificar `closeWizard()` para guardar preferencia
   - Modificar `wizardApply()` para guardar preferencia
   - Modificar `applyPreset()` para abrir wizard automático
   - Añadir `resetAllWizards()`

---

## 🎉 RESULTADO FINAL

Un sistema de wizards que:
- ✅ Educa automáticamente a usuarios nuevos
- ✅ No molesta a usuarios experimentados
- ✅ Mantiene información accesible siempre
- ✅ Respeta las preferencias del usuario
- ✅ Tiene diseño limpio y profesional
- ✅ Es flexible y controlable

**El mejor de ambos mundos: educación sin fricción.** 🚀
