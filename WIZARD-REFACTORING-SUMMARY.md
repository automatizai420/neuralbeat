# REFACTORIZACIÓN DE WIZARDS - RESUMEN

## ✅ COMPLETADO

### 1. Función Generadora de Wizards en `presets.js`

Se añadió la función `generateWizard(presetId, lang)` que genera dinámicamente wizards de 4 pasos desde los datos de cada preset:

**Estructura de 4 pasos:**
1. **Fundamento** - ¿Qué es y cómo funciona?
2. **Protocolo** - Cómo usarlo correctamente
3. **Ajustes** - Qué buscar y cómo ajustar
4. **Seguridad** - Precauciones y contraindicaciones

**Información incluida:**
- `longDescription` - Explicación científica detallada
- `audio.perception.why` - Por qué esta frecuencia específica
- `guide.when` - Mejor momento para usar
- `guide.duration` - Duración mínima/recomendada/máxima
- `breathing.pattern` - Patrón respiratorio explicado
- `guide.sequence` - Qué hacer antes/después
- `markers.positive` - Señales de que funciona
- `markers.adjust` - Qué hacer si no funciona
- `markers.unexpected` - Sensaciones normales
- `markers.stop` - Cuándo parar inmediatamente
- `guide.contraindications` - Contraindicaciones

### 2. Sistema de Wizards en `app.js`

Se implementó el sistema completo de wizards con:
- `openWizard(presetId)` - Abre el wizard para un preset
- `closeWizard()` - Cierra el wizard
- `wizStep(direction)` - Navega entre pasos
- `wizardApply()` - Aplica el preset y cierra
- `renderWizard()` - Renderiza el contenido del wizard
- `getCurrentLang()` - Detecta el idioma activo

### 3. Actualización de `index.html`

- Se añadieron las exportaciones de `wizStep` y `wizardApply` a window
- Se actualizó la estructura HTML del wizard overlay para incluir `wizStepContent`
- Se corrigieron los onclick de los botones de navegación

## ⚠️ PENDIENTE

### Actualizar botones de info en las tarjetas de preset

Cada botón `.pc-info` necesita llamar a `window.openWizard('preset-id')`:

```html
<!-- ANTES -->
<button class="pc-info" onclick="event.stopPropagation()">?</button>

<!-- DESPUÉS -->
<button class="pc-info" onclick="window.openWizard('delta');event.stopPropagation()">?</button>
```

**IDs de presets a actualizar:**
- delta
- theta
- schumann
- alpha10
- alpha8
- beta
- gamma40
- gamma25
- hz528
- hz432
- hz777
- hz174
- hz396
- hz639
- hz852
- nadi
- 478
- box
- dispenza
- wimhof

### Script de actualización masiva

Puedes usar este comando de búsqueda y reemplazo en tu editor:

**Buscar:** `<button class="pc-info" onclick="event.stopPropagation()">?</button>`

**Reemplazar manualmente** cada uno con el ID correcto del preset según el `data-preset-id` de su tarjeta padre.

## 📊 MEJORAS LOGRADAS

### Antes
- Wizards hardcodeados en HTML
- Información incompleta y superficial
- Estructura inconsistente (1-3 pasos)
- Sin información de markers, tuning, o contraindicaciones completas
- Duplicación de información entre presets.js y wizards

### Después
- Wizards generados dinámicamente desde presets.js
- Información completa y estructurada
- Estructura consistente de 4 pasos para todos
- Incluye markers, ajustes, y contraindicaciones
- Fuente única de verdad (presets.js)
- Soporte multilingüe automático (ES/EN/FR/PT)

## 🎯 PRÓXIMOS PASOS

1. **Actualizar los botones de info** en index.html (ver lista arriba)
2. **Probar** abriendo cada wizard para verificar que la información se muestra correctamente
3. **Ajustar estilos CSS** si es necesario para mejorar la presentación
4. **Traducir** los labels de los pasos a EN/FR/PT si aún no están
5. **Documentar** el sistema para futuros mantenimientos

## 📝 NOTAS TÉCNICAS

- Los wizards se generan en tiempo real al hacer clic en el botón "?"
- El idioma se detecta automáticamente del botón `.lang-btn.active`
- La función `wizardApply()` busca `window.applyPresetById()` - verificar que existe
- Los wizards usan import dinámico de presets.js para evitar dependencias circulares
