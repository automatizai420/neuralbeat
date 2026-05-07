# 🔧 SOLUCIÓN DE ERRORES - WIZARDS

## ❌ PROBLEMA ORIGINAL

```
(index):681 Uncaught SyntaxError: Invalid or unexpected token
(index):689 Uncaught SyntaxError: Invalid or unexpected token
(index):697 Uncaught SyntaxError: Invalid or unexpected token
```

Al hacer clic en el botón "?" no pasaba nada.

## 🔍 CAUSA RAÍZ

El script Python que actualicé los botones usó comillas escapadas incorrectamente en HTML:

```html
<!-- ❌ INCORRECTO (causaba SyntaxError) -->
<button class="pc-info" onclick="window.openWizard(\'delta\');event.stopPropagation()">

<!-- ✅ CORRECTO -->
<button class="pc-info" onclick="window.openWizard('delta');event.stopPropagation()">
```

En HTML, dentro de atributos con comillas dobles, las comillas simples NO necesitan escaparse.

## ✅ SOLUCIÓN APLICADA

Ejecuté un comando `sed` para corregir todas las comillas:

```bash
sed -i.bak "s/window\.openWizard(\\\\'\\([^']*\\)\\\\');/window.openWizard('\\1');/g" index.html
```

Esto reemplazó:
- `window.openWizard(\'delta\');` → `window.openWizard('delta');`
- Para los 20 presets

## 🧪 CÓMO VERIFICAR LA SOLUCIÓN

### Opción 1: Usar el archivo de test

1. Abre `test-wizard.html` en tu navegador
2. Ejecuta los 4 tests en orden:
   - Test 1: Verifica que las funciones existen
   - Test 2: Verifica que presets.js se importa
   - Test 3: Genera un wizard de prueba
   - Test 4: Abre el wizard en la UI

### Opción 2: Probar directamente en index.html

1. Abre `index.html` en tu navegador
2. Presiona `Ctrl+Shift+R` para hard refresh
3. Abre la consola (F12)
4. Verifica que NO hay errores de sintaxis
5. Haz clic en el botón "?" de cualquier preset
6. Debería abrirse el wizard

### Opción 3: Test manual en consola

Abre la consola y ejecuta:

```javascript
// 1. Verificar que la función existe
console.log(typeof window.openWizard); // Debe mostrar: "function"

// 2. Abrir un wizard manualmente
window.openWizard('delta');

// 3. Cerrar el wizard
window.closeWizard();
```

## 📊 ESTADO ACTUAL

| Componente | Estado | Notas |
|------------|--------|-------|
| presets.js | ✅ OK | Función `generateWizard` implementada |
| app.js | ✅ OK | Sistema de wizards completo |
| index.html (sintaxis) | ✅ CORREGIDO | Comillas escapadas arregladas |
| index.html (exports) | ✅ OK | Funciones exportadas a window |
| HTML overlay | ✅ OK | Elemento #wizardOverlay existe |

## 🐛 SI AÚN NO FUNCIONA

### Problema: "openWizard is not defined"

**Diagnóstico:**
```javascript
console.log(window.openWizard); // undefined
```

**Solución:** Verificar que en index.html (cerca de la línea 1188) está:
```javascript
window.openWizard = openWizard;
```

### Problema: "Cannot read property 'classList' of null"

**Diagnóstico:** El elemento HTML no existe

**Solución:** Buscar en index.html:
```html
<div class="wizard-overlay" id="wizardOverlay">
```

Debe estar presente (línea ~1024).

### Problema: "generateWizard is not a function"

**Diagnóstico:** presets.js no se importa correctamente

**Solución:** Verificar que presets.js tiene al final:
```javascript
export function generateWizard(presetId, lang = 'es') { ... }
```

### Problema: El wizard se abre pero está vacío

**Diagnóstico:** Los datos no se están renderizando

**Solución:** Verificar en la consola:
```javascript
import('./presets.js').then(m => {
  const wizard = m.generateWizard('delta', 'es');
  console.log(wizard);
});
```

Debe mostrar un objeto con `id`, `color`, `band`, `steps`.

## 📝 ARCHIVOS CREADOS PARA AYUDA

1. **QUICK-FIX-APPLIED.md** - Explicación rápida del fix
2. **test-wizard.html** - Página de test independiente
3. **SOLUCION-ERRORES.md** - Este documento

## 🎯 PRÓXIMOS PASOS

1. ✅ Recargar index.html con Ctrl+Shift+R
2. ✅ Verificar que no hay errores en consola
3. ✅ Hacer clic en "?" de Delta
4. ✅ Verificar que el wizard se abre
5. ✅ Navegar por los 4 pasos
6. ✅ Probar con otros presets

## 💡 LECCIONES APRENDIDAS

1. **No usar comillas escapadas en HTML**: En atributos HTML con comillas dobles, las comillas simples no necesitan escaparse.

2. **Siempre validar la sintaxis**: Después de modificaciones automáticas, verificar que el HTML es válido.

3. **Usar herramientas de test**: El archivo `test-wizard.html` permite probar el sistema de forma aislada.

---

**Estado:** ✅ Errores de sintaxis corregidos
**Siguiente:** Probar en el navegador
