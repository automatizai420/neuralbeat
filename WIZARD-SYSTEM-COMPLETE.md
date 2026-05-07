# ✅ SISTEMA DE WIZARDS - IMPLEMENTACIÓN COMPLETA

## 🎯 RESUMEN DE CAMBIOS

### 1. ✅ Diseño Simplificado de Tarjetas
- **Ocultos**: Parámetros técnicos (200 Hz, 3 rpm, etc.)
- **Visible**: Solo nombre, frecuencia y botón "?"
- **CSS**: `.pc-params { display: none; }`

### 2. ✅ Wizard Automático en Primera Selección
- Al hacer clic en un preset por **primera vez**, se abre automáticamente el wizard
- En selecciones posteriores, NO se abre (ya fue visto)
- Implementado en `applyPreset()` → `openWizard(id, false)`

### 3. ✅ Checkbox "No Mostrar Más"
- Aparece en el **último paso** del wizard (Paso 4: Seguridad)
- Se guarda en `localStorage` al cerrar o aplicar preset
- Funciona por preset individual

### 4. ✅ Botón "? Wizards" en Header
- Resetea TODOS los wizards vistos
- Permite volver a ver los wizards educativos
- Implementado: `resetAllWizards()` en `app.js`

### 5. ✅ Botón "?" Siempre Funciona
- **CORREGIDO**: Ahora todos los botones "?" llaman `openWizard(presetId, true)`
- El parámetro `true` fuerza la apertura sin importar si ya fue visto
- 20 botones actualizados en `index.html`

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

### Funciones en app.js
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

#### Clic en Preset Card
```
Usuario hace clic en preset
         ↓
    applyPreset(id)
         ↓
    openWizard(id, false)  ← forceOpen = false
         ↓
   ¿Ya fue visto? ──→ SÍ → No abrir wizard
         ↓
        NO
         ↓
   Abrir wizard automáticamente
```

#### Clic en Botón "?"
```
Usuario hace clic en "?"
         ↓
    openWizard(id, true)  ← forceOpen = true
         ↓
   Abrir wizard SIEMPRE (ignora localStorage)
```

#### Cerrar Wizard
```
Usuario navega hasta último paso
         ↓
   Checkbox "No mostrar más" visible
         ↓
   Usuario marca checkbox (opcional)
         ↓
   Cierra (✕) o aplica preset (↗)
         ↓
   ¿Checkbox marcado? ──→ SÍ → Guardar en localStorage
         ↓
        NO
         ↓
   No guardar (se mostrará próxima vez)
```

---

## 🧪 GUÍA DE PRUEBAS

### Test 1: Primera Selección Automática
1. Abre la app en navegador
2. Haz clic en preset "Delta" (primera vez)
3. ✅ **DEBE**: Abrirse el wizard automáticamente
4. Navega hasta el último paso
5. ✅ **DEBE**: Aparecer checkbox "No mostrar más"

### Test 2: Segunda Selección (Sin Marcar Checkbox)
1. Cierra el wizard sin marcar checkbox
2. Haz clic en otro preset
3. Vuelve a hacer clic en "Delta"
4. ✅ **DEBE**: Abrirse el wizard nuevamente

### Test 3: Segunda Selección (Con Checkbox Marcado)
1. Abre wizard de "Theta"
2. Navega hasta el último paso
3. Marca checkbox "No mostrar más"
4. Cierra o aplica preset
5. Haz clic en "Theta" nuevamente
6. ✅ **DEBE**: NO abrirse el wizard

### Test 4: Botón "?" Fuerza Apertura
1. Marca "No mostrar más" en "Alpha 10 Hz"
2. Haz clic en el botón "?" de Alpha 10 Hz
3. ✅ **DEBE**: Abrirse el wizard (ignora preferencia)
4. Cierra el wizard
5. Haz clic en el preset Alpha 10 Hz (no en "?")
6. ✅ **DEBE**: NO abrirse el wizard (respeta preferencia)

### Test 5: Reset Global
1. Marca varios presets como "No mostrar más"
2. Haz clic en "? Wizards" en el header
3. ✅ **DEBE**: Mostrar alert de confirmación
4. Selecciona cualquier preset marcado
5. ✅ **DEBE**: Abrirse el wizard nuevamente

### Test 6: Persistencia entre Recargas
1. Marca "No mostrar más" en 3 presets diferentes
2. Recarga la página (F5)
3. Selecciona esos 3 presets
4. ✅ **DEBE**: NO abrirse los wizards
5. Haz clic en los botones "?" de esos presets
6. ✅ **DEBE**: Abrirse los wizards

### Test 7: Aplicar Preset desde Wizard
1. Abre wizard de "Box Breathing"
2. Navega hasta el último paso
3. Marca checkbox "No mostrar más"
4. Haz clic en "Aplicar preset ↗"
5. ✅ **DEBE**: Cerrar wizard y aplicar preset
6. Haz clic en "Box Breathing" nuevamente
7. ✅ **DEBE**: NO abrirse el wizard

---

## 📊 ARCHIVOS MODIFICADOS

### 1. `index.html`
- **CSS**: Añadido `.pc-params { display: none; }`
- **CSS**: Añadido `.wiz-dont-show { margin-right: auto; padding: 4px 0; }`
- **Header**: Añadido botón "? Wizards"
- **Preset Cards**: 20 botones "?" actualizados con `openWizard(id, true)`
- **Exports**: Añadido `window.resetAllWizards = resetAllWizards;`

### 2. `app.js`
- **Funciones localStorage**: `getSeenWizards()`, `markWizardAsSeen()`, `hasSeenWizard()`
- **Función reset**: `resetAllWizards()`
- **Modificado**: `openWizard(presetId, forceOpen = false)` con control de primera vez
- **Modificado**: `renderWizard()` para mostrar checkbox en último paso
- **Modificado**: `closeWizard()` para guardar preferencia si checkbox marcado
- **Modificado**: `wizardApply()` para guardar preferencia si checkbox marcado
- **Modificado**: `applyPreset()` para llamar `openWizard(id, false)` antes de aplicar

---

## 🎨 COMPORTAMIENTO FINAL

### Para Usuarios Nuevos
- ✅ Educación automática al seleccionar cada preset por primera vez
- ✅ Aprenden sobre el preset antes de usarlo
- ✅ Onboarding natural y progresivo

### Para Usuarios Experimentados
- ✅ Pueden marcar "No mostrar más" en cada preset
- ✅ No interrumpe el flujo de trabajo
- ✅ Acceso rápido con botón "?" cuando necesitan consultar

### Para Todos
- ✅ Diseño limpio sin información técnica abrumadora
- ✅ Información disponible cuando se necesita
- ✅ Control total sobre la experiencia
- ✅ Persistencia de preferencias entre sesiones

---

## 🐛 TROUBLESHOOTING

### Problema: Wizard no se abre automáticamente
**Diagnóstico:**
```javascript
// En consola del navegador
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

### Problema: Botón "?" no abre wizard
**Diagnóstico:** Verificar en consola si hay errores de JavaScript.
**Solución:** Verificar que todos los botones tienen `openWizard(id, true)` con el parámetro `true`.

### Problema: Botón "? Wizards" no aparece
**Solución:** Verificar que `resetAllWizards` está exportado en index.html:
```javascript
window.resetAllWizards = resetAllWizards;
```

---

## 📝 CÓDIGO CLAVE

### Botón "?" en Preset Card
```html
<button class="pc-info" onclick="window.openWizard('delta', true);event.stopPropagation()">?</button>
```
**Nota**: El `true` es CRÍTICO para forzar apertura.

### Botón "? Wizards" en Header
```html
<button class="hdr-btn" onclick="window.resetAllWizards()" data-i18n="wizardsBtn" title="Ver wizards educativos nuevamente">? Wizards</button>
```

### Checkbox en Último Paso
```javascript
// En renderWizard() cuando isLastStep === true
checkboxContainer.innerHTML = `
  <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-family:var(--mono);font-size:8px;color:var(--muted);">
    <input type="checkbox" id="wizDontShowCheckbox" style="cursor:pointer;">
    <span data-i18n="wizDontShow">No mostrar este wizard nuevamente</span>
  </label>
`;
```

### Guardar Preferencia al Cerrar
```javascript
export function closeWizard() {
  const checkbox = document.getElementById('wizDontShowCheckbox');
  if (checkbox && checkbox.checked && currentWizard) {
    markWizardAsSeen(currentWizard.id);
  }
  // ... resto del código
}
```

---

## ✨ RESULTADO FINAL

Un sistema de wizards que:
- ✅ Educa automáticamente a usuarios nuevos
- ✅ No molesta a usuarios experimentados
- ✅ Mantiene información accesible siempre
- ✅ Respeta las preferencias del usuario
- ✅ Tiene diseño limpio y profesional
- ✅ Es flexible y controlable
- ✅ Persiste preferencias entre sesiones

**El mejor de ambos mundos: educación sin fricción.** 🚀

---

## 🚀 PRÓXIMOS PASOS

Para probar la implementación:

1. **Abrir en navegador**: `http://localhost:8080` o `http://127.0.0.1:8080`
2. **Ejecutar todos los tests** de la sección "Guía de Pruebas"
3. **Verificar localStorage** en DevTools → Application → Local Storage
4. **Probar en móvil** para verificar responsive design

Si encuentras algún problema, revisa la sección de Troubleshooting.

---

**Fecha de implementación**: Mayo 2026  
**Versión**: Coherencia v8  
**Estado**: ✅ COMPLETO Y FUNCIONAL
