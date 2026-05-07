# 🔧 CORRECCIÓN APLICADA

## ❌ PROBLEMA IDENTIFICADO

El script Python que actualicé los botones usó comillas escapadas incorrectamente:
```html
<!-- INCORRECTO (causaba error de sintaxis) -->
<button onclick="window.openWizard(\'delta\');">

<!-- CORRECTO -->
<button onclick="window.openWizard('delta');">
```

## ✅ SOLUCIÓN APLICADA

Se ejecutó un comando `sed` para corregir todas las comillas escapadas en `index.html`.

**Resultado:** Todos los 20 botones ahora tienen la sintaxis correcta.

## 🧪 CÓMO VERIFICAR QUE FUNCIONA

### 1. Recargar la página
Presiona `Ctrl+Shift+R` (o `Cmd+Shift+R` en Mac) para hacer un hard refresh.

### 2. Abrir la consola del navegador
Presiona `F12` y ve a la pestaña "Console".

### 3. Verificar que no hay errores
Deberías ver solo:
```
🎵 Coherencia v8 modular loaded
```

**NO deberías ver:**
- ❌ `Uncaught SyntaxError: Invalid or unexpected token`

### 4. Probar un wizard
1. Haz clic en el botón **"?"** del preset Delta
2. Debería abrirse un overlay con el wizard
3. Si no se abre, revisa la consola para ver el error

## 🐛 SI AÚN NO FUNCIONA

### Verificación 1: Consola del navegador
Abre la consola (F12) y escribe:
```javascript
window.openWizard
```

**Resultado esperado:** Debería mostrar `ƒ openWizard(presetId)`

**Si muestra `undefined`:** El problema está en la exportación de app.js

### Verificación 2: Probar manualmente
En la consola, escribe:
```javascript
window.openWizard('delta')
```

**Resultado esperado:** Debería abrir el wizard de Delta

**Si da error:** Copia el error completo y compártelo

### Verificación 3: Verificar que presets.js se carga
En la consola, escribe:
```javascript
import('./presets.js').then(m => console.log('Presets loaded:', m.PRESETS.length))
```

**Resultado esperado:** `Presets loaded: 20` (o el número de presets que tengas)

## 📋 CHECKLIST DE DIAGNÓSTICO

- [ ] Recargué la página con Ctrl+Shift+R
- [ ] No hay errores de sintaxis en la consola
- [ ] `window.openWizard` existe (no es undefined)
- [ ] Hacer clic en "?" no hace nada
- [ ] La consola muestra algún error al hacer clic

## 🔍 ERRORES COMUNES Y SOLUCIONES

### Error: "openWizard is not a function"
**Causa:** La función no está exportada a window
**Solución:** Verificar que en index.html está la línea:
```javascript
window.openWizard = openWizard;
```

### Error: "Cannot read property 'classList' of null"
**Causa:** El elemento HTML del wizard no existe
**Solución:** Verificar que existe `<div id="wizardOverlay">` en index.html

### Error: "generateWizard is not a function"
**Causa:** presets.js no se está importando correctamente
**Solución:** Verificar que presets.js tiene `export function generateWizard`

### No pasa nada al hacer clic
**Causa:** El evento onclick no se está ejecutando
**Solución:** Verificar en las DevTools → Elements que el botón tiene el onclick correcto

## 📞 INFORMACIÓN PARA DEBUGGING

Si necesitas ayuda, comparte:
1. ✅ Mensaje de la consola al cargar la página
2. ✅ Resultado de `window.openWizard` en la consola
3. ✅ Cualquier error que aparezca al hacer clic en "?"
4. ✅ Navegador y versión que estás usando

---

**Estado actual:** ✅ Sintaxis HTML corregida
**Siguiente paso:** Recargar página y probar
