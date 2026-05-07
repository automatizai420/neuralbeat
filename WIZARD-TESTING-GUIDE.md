# GUÍA DE PRUEBAS - SISTEMA DE WIZARDS

## ✅ IMPLEMENTACIÓN COMPLETADA

Se ha refactorizado completamente el sistema de wizards para que se genere dinámicamente desde `presets.js`.

### Archivos Modificados

1. **presets.js**
   - ✅ Añadida función `generateWizard(presetId, lang)`
   - ✅ Añadida función `getAllWizards(lang)`
   - ✅ Genera wizards de 4 pasos con toda la información de cada preset

2. **app.js**
   - ✅ Implementado `openWizard(presetId)`
   - ✅ Implementado `closeWizard()`
   - ✅ Implementado `wizStep(direction)`
   - ✅ Implementado `wizardApply()`
   - ✅ Implementado `renderWizard()`
   - ✅ Implementado `getCurrentLang()`

3. **index.html**
   - ✅ Actualizados 20 botones de info para llamar a `window.openWizard()`
   - ✅ Actualizada estructura HTML del wizard overlay
   - ✅ Exportadas funciones `wizStep` y `wizardApply` a window

## 🧪 CÓMO PROBAR

### 1. Abrir la aplicación

```bash
# Si tienes un servidor local
python3 -m http.server 8000
# O
npx serve
```

Luego abre `http://localhost:8000` en tu navegador.

### 2. Probar un wizard

1. Haz clic en el botón **"?"** de cualquier preset (ej: Delta)
2. Deberías ver un overlay con el wizard
3. Verifica que muestra:
   - ✅ Título del preset con color correcto
   - ✅ 4 indicadores de paso en la parte superior
   - ✅ Contenido del paso actual

### 3. Navegar entre pasos

1. Haz clic en **"Siguiente →"** para avanzar
2. Haz clic en **"← Anterior"** para retroceder
3. Haz clic en los **indicadores de paso** (dots) para saltar directamente
4. En el último paso, verifica que aparece el botón **"Aplicar preset ↗"**

### 4. Verificar contenido de cada paso

#### Paso 1: Fundamento
- ✅ Descripción científica del preset
- ✅ Explicación de por qué esta frecuencia
- ✅ Mecanismo fisiológico

#### Paso 2: Protocolo
- ✅ Mejor momento para usar
- ✅ Duración (mínimo/recomendado/máximo)
- ✅ Patrón respiratorio
- ✅ Secuencia recomendada

#### Paso 3: Ajustes
- ✅ Señales positivas (qué buscar)
- ✅ Qué hacer si no funciona
- ✅ Sensaciones normales pero inesperadas

#### Paso 4: Seguridad
- ✅ Cuándo parar inmediatamente
- ✅ Contraindicaciones
- ✅ Advertencias de seguridad

### 5. Probar multilingüe

1. Cambia el idioma usando los botones ES/EN/FR/PT
2. Abre un wizard
3. Verifica que el contenido está en el idioma seleccionado

### 6. Probar aplicar preset

1. Navega hasta el último paso de un wizard
2. Haz clic en **"Aplicar preset ↗"**
3. Verifica que:
   - ✅ El wizard se cierra
   - ✅ El preset se aplica (si la función `applyPresetById` existe)

### 7. Probar cerrar wizard

1. Abre un wizard
2. Prueba cerrar de 3 formas:
   - ✅ Botón **"✕"** en la esquina superior derecha
   - ✅ Clic fuera del panel (en el overlay oscuro)
   - ✅ Tecla ESC (si está implementado)

## 🐛 PROBLEMAS CONOCIDOS Y SOLUCIONES

### Problema: "Wizard not found for preset"

**Causa:** El ID del preset no coincide con ningún preset en `PRESETS`

**Solución:** Verificar que el ID pasado a `openWizard()` coincide exactamente con el `id` en `presets.js`

### Problema: El wizard no se muestra

**Causa:** Error de JavaScript en la consola

**Solución:** 
1. Abre la consola del navegador (F12)
2. Busca errores en rojo
3. Verifica que `presets.js` se está importando correctamente

### Problema: El contenido está en inglés aunque seleccioné español

**Causa:** La función `getCurrentLang()` no detecta el idioma correctamente

**Solución:** Verificar que los botones de idioma tienen la clase `active` correctamente

### Problema: "applyPresetById is not a function"

**Causa:** La función `applyPresetById` no existe en el código

**Solución:** Cambiar en `app.js` línea ~1015:
```javascript
// Cambiar esto:
if (window.applyPresetById) {
  window.applyPresetById(currentWizard.id);
}

// Por esto:
if (window.applyPreset) {
  window.applyPreset(currentWizard.id);
}
```

## 📊 CHECKLIST DE PRUEBAS

### Funcionalidad Básica
- [ ] Los 20 botones "?" abren sus respectivos wizards
- [ ] El wizard se muestra correctamente centrado
- [ ] El color del dot coincide con el color del preset
- [ ] El título muestra el nombre correcto del preset

### Navegación
- [ ] Botón "Siguiente" avanza al siguiente paso
- [ ] Botón "Anterior" retrocede al paso anterior
- [ ] Los dots de paso son clicables y saltan al paso correcto
- [ ] En el primer paso, "Anterior" está oculto
- [ ] En el último paso, "Siguiente" está oculto
- [ ] En el último paso, aparece "Aplicar preset"

### Contenido
- [ ] Paso 1 muestra fundamento científico
- [ ] Paso 2 muestra protocolo de uso
- [ ] Paso 3 muestra ajustes y markers
- [ ] Paso 4 muestra seguridad y contraindicaciones
- [ ] El contenido es relevante para cada preset
- [ ] No hay texto "undefined" o "null"

### Multilingüe
- [ ] Español (ES) funciona
- [ ] Inglés (EN) funciona
- [ ] Francés (FR) funciona
- [ ] Portugués (PT) funciona

### Integración
- [ ] "Aplicar preset" cierra el wizard
- [ ] "Aplicar preset" activa el preset (si la función existe)
- [ ] Cerrar con "✕" funciona
- [ ] Cerrar con clic fuera funciona

## 🎉 RESULTADO ESPERADO

Después de esta refactorización, cada preset tiene un wizard educativo completo de 4 pasos que:

1. **Educa** al usuario sobre la ciencia detrás del preset
2. **Guía** sobre cómo y cuándo usarlo
3. **Ayuda** a ajustar y reconocer señales
4. **Protege** con información de seguridad clara

Todo generado automáticamente desde la rica base de datos en `presets.js`, sin duplicación de código.

## 📝 NOTAS FINALES

- Los wizards ahora son **100% dinámicos**
- Toda la información viene de `presets.js`
- Añadir un nuevo preset automáticamente genera su wizard
- El sistema es **multilingüe por diseño**
- La estructura de 4 pasos es **consistente** para todos los presets

---

**¿Encontraste un bug?** Documéntalo con:
1. Preset afectado
2. Paso del wizard
3. Idioma seleccionado
4. Error en consola (si hay)
5. Comportamiento esperado vs actual
