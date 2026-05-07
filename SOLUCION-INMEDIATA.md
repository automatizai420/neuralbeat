# 🚨 SOLUCIÓN INMEDIATA - Error de Caché

## 🐛 EL PROBLEMA

Estás viendo estos errores:
```
❌ window.applyPreset is not a function
❌ resetAllWizards not exported
```

**Causa**: Tu navegador está usando una versión antigua de `app.js` (cacheada).

## ✅ SOLUCIÓN EN 3 PASOS

### 1️⃣ HARD REFRESH (Recarga Forzada)

**Presiona estas teclas:**

- **Windows/Linux**: `Ctrl + Shift + R` o `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`

Esto fuerza al navegador a descargar los archivos nuevos.

### 2️⃣ VERIFICA QUE FUNCIONA

Después del hard refresh:

1. Abre la consola (F12)
2. Escribe: `typeof window.applyPreset`
3. Debe decir: `"function"` (no `"undefined"`)

### 3️⃣ PRUEBA LA APP

1. Haz clic en cualquier preset → debe aplicarse
2. Haz clic en botón "?" → debe abrir wizard
3. Haz clic en "? Wizards" en header → debe mostrar alert

---

## 🔧 SI AÚN NO FUNCIONA

### Opción A: DevTools con Caché Deshabilitado

1. Abre DevTools (F12)
2. Ve a **Network** (Red)
3. Marca **"Disable cache"** (arriba)
4. Mantén DevTools abierto
5. Recarga la página (F5)

### Opción B: Modo Incógnito

1. Abre ventana de incógnito/privada
2. Ve a `http://localhost:8080`
3. Prueba la app

### Opción C: Limpiar Caché Completo

**Chrome/Edge/Brave:**
1. Presiona `Ctrl + Shift + Delete` (Win) o `Cmd + Shift + Delete` (Mac)
2. Selecciona "Imágenes y archivos en caché"
3. Haz clic en "Borrar datos"

**Firefox:**
1. Presiona `Ctrl + Shift + Delete` (Win) o `Cmd + Shift + Delete` (Mac)
2. Selecciona "Caché"
3. Haz clic en "Limpiar ahora"

---

## 🧪 HERRAMIENTA DE DIAGNÓSTICO

Abre en tu navegador:
```
http://localhost:8080/test-exports.html
```

Esta página te dirá exactamente qué funciones están disponibles y cuáles faltan.

---

## ✅ PROBLEMA VISUAL CORREGIDO

El texto "7.83 Hz" que se montaba sobre el botón "?" ya está corregido.

Después del hard refresh, verás:
```
┌─────────────────────────┐
│ SCHUMANN      7.83 Hz ? │  ← Ahora hay espacio
│ Resonancia Terrestre    │
└─────────────────────────┘
```

---

## 📝 RESUMEN

1. **El código está correcto** ✅
2. **El problema es caché del navegador** 🔄
3. **Solución**: `Ctrl + Shift + R` (Win/Linux) o `Cmd + Shift + R` (Mac)

---

## 🆘 ÚLTIMA OPCIÓN

Si nada funciona, reinicia el servidor:

```bash
# Detén el servidor (Ctrl+C en la terminal)
# Reinicia:
python -m http.server 8080
# o
npx http-server -p 8080
```

Luego abre en modo incógnito: `http://localhost:8080`

---

**Estado**: ✅ Código correcto  
**Acción requerida**: Hard refresh del navegador  
**Tiempo estimado**: 5 segundos
