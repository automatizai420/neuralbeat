# 🔧 SOLUCIÓN: Error de Caché del Navegador

## 🐛 PROBLEMA

Estás viendo estos errores:
```
Uncaught SyntaxError: The requested module './app.js' does not provide an export named 'resetAllWizards'
Uncaught TypeError: window.applyPreset is not a function
```

**Causa**: El navegador está cacheando la versión antigua de `app.js` antes de que se añadiera `resetAllWizards`.

## ✅ SOLUCIÓN RÁPIDA

### Opción 1: Hard Refresh (Recomendado)

**En Chrome/Edge/Brave:**
- Windows/Linux: `Ctrl + Shift + R` o `Ctrl + F5`
- Mac: `Cmd + Shift + R`

**En Firefox:**
- Windows/Linux: `Ctrl + Shift + R` o `Ctrl + F5`
- Mac: `Cmd + Shift + R`

**En Safari:**
- Mac: `Cmd + Option + R`

### Opción 2: Limpiar Caché Manualmente

1. Abre DevTools (F12)
2. Ve a la pestaña **Network** (Red)
3. Haz clic derecho en cualquier parte
4. Selecciona **Clear browser cache** (Limpiar caché del navegador)
5. Recarga la página (F5)

### Opción 3: DevTools con Caché Deshabilitado

1. Abre DevTools (F12)
2. Ve a **Settings** (⚙️ o F1)
3. En **Network**, marca **Disable cache (while DevTools is open)**
4. Mantén DevTools abierto y recarga la página

### Opción 4: Modo Incógnito

1. Abre una ventana de incógnito/privada
2. Navega a `http://localhost:8080` o `http://127.0.0.1:8080`
3. Prueba la aplicación

## 🔍 VERIFICAR QUE FUNCIONA

Después de limpiar el caché, abre la consola (F12) y verifica:

```javascript
// Debe retornar una función, no undefined
console.log(typeof window.applyPreset);  // "function"
console.log(typeof window.resetAllWizards);  // "function"
console.log(typeof window.openWizard);  // "function"
```

Si ves `"function"` para todas, el problema está resuelto.

## 🎨 PROBLEMA VISUAL CORREGIDO

El texto "7.83 Hz" que se montaba sobre el botón "?" ya está corregido con:

```css
.pc-head {
  padding-right: 20px;  /* Espacio para el botón "?" */
}
```

## 🧪 PRUEBA COMPLETA

1. **Hard refresh** (Ctrl+Shift+R)
2. Abre la consola (F12)
3. Verifica que no hay errores rojos
4. Haz clic en cualquier preset → debe aplicarse
5. Haz clic en botón "?" → debe abrir wizard
6. Haz clic en "? Wizards" en header → debe mostrar alert

## 🚀 SI AÚN NO FUNCIONA

Si después de limpiar el caché sigues viendo errores:

1. **Verifica que el servidor esté corriendo**:
   ```bash
   # Detén el servidor actual (Ctrl+C)
   # Reinicia el servidor
   python -m http.server 8080
   # o
   npx http-server -p 8080
   ```

2. **Verifica que los archivos estén guardados**:
   - `app.js` debe tener `export function resetAllWizards()`
   - `index.html` debe tener `window.resetAllWizards = resetAllWizards;`

3. **Prueba en otro navegador**:
   - Si funciona en otro navegador, el problema es caché específico del navegador original

## 📝 RESUMEN

El código está correcto. El problema es **caché del navegador**. 

**Solución**: Hard refresh con `Ctrl + Shift + R` (Windows/Linux) o `Cmd + Shift + R` (Mac).

---

**Fecha**: Mayo 2026  
**Estado**: ✅ Código correcto, solo necesita hard refresh
