// ════════════════════════════════════════════════════
// extract-preset-benefits.js
// Extrae los benefits de presets.js para i18n.js
// ════════════════════════════════════════════════════

import { PRESETS } from './presets.js';

const langs = ['es', 'en', 'fr', 'pt', 'zh', 'hi'];
const output = {};

// Inicializar estructura
langs.forEach(lang => {
  output[lang] = {};
});

// Extraer benefits de cada preset
PRESETS.forEach(preset => {
  // Generar key capitalizado: delta → presetDeltaBenefit
  const id = preset.id;
  const capitalizedId = id.charAt(0).toUpperCase() + id.slice(1);
  const key = `preset${capitalizedId}Benefit`;
  
  // Extraer descripción en cada idioma
  langs.forEach(lang => {
    if (preset.description && preset.description[lang]) {
      output[lang][key] = preset.description[lang];
    } else {
      console.warn(`⚠️  Falta traducción: ${key} en ${lang}`);
    }
  });
  
  // Casos especiales: Hz en el nombre (para Nadi, 478, Box, WimHof)
  if (preset.id === 'nadi') {
    output.es.presetNadiHz = 'Alterna';
    output.en.presetNadiHz = 'Alternate';
    output.fr.presetNadiHz = 'Alterné';
    output.pt.presetNadiHz = 'Alternado';
    output.zh.presetNadiHz = '交替';
    output.hi.presetNadiHz = 'वैकल्पिक';
  }
  
  if (preset.id === 'breath478') {
    output.es.preset478Hz = 'Relajación';
    output.en.preset478Hz = 'Relaxation';
    output.fr.preset478Hz = 'Relaxation';
    output.pt.preset478Hz = 'Relaxamento';
    output.zh.preset478Hz = '放松';
    output.hi.preset478Hz = 'विश्राम';
  }
  
  if (preset.id === 'box') {
    output.es.presetBoxHz = 'Cuadrado';
    output.en.presetBoxHz = 'Square';
    output.fr.presetBoxHz = 'Carré';
    output.pt.presetBoxHz = 'Quadrado';
    output.zh.presetBoxHz = '方形';
    output.hi.presetBoxHz = 'वर्ग';
  }
  
  if (preset.id === 'wimhof') {
    output.es.presetWimHofHz = 'Hiperventilación';
    output.en.presetWimHofHz = 'Hyperventilation';
    output.fr.presetWimHofHz = 'Hyperventilation';
    output.pt.presetWimHofHz = 'Hiperventilação';
    output.zh.presetWimHofHz = '过度换气';
    output.hi.presetWimHofHz = 'अतिवातायन';
  }
});

// Tags adicionales
const tags = {
  tagRetFull: {
    es: 'Retención llena',
    en: 'Full retention',
    fr: 'Rétention pleine',
    pt: 'Retenção cheia',
    zh: '满肺保持',
    hi: 'पूर्ण कुंभक'
  },
  tagRetEmpty: {
    es: 'Retención vacía',
    en: 'Empty retention',
    fr: 'Rétention vide',
    pt: 'Retenção vazia',
    zh: '空肺保持',
    hi: 'शून्य कुंभक'
  },
  tagWimHofRet: {
    es: '30 respiraciones + retención',
    en: '30 breaths + retention',
    fr: '30 respirations + rétention',
    pt: '30 respirações + retenção',
    zh: '30次呼吸 + 保持',
    hi: '30 श्वास + कुंभक'
  }
};

langs.forEach(lang => {
  Object.entries(tags).forEach(([key, translations]) => {
    output[lang][key] = translations[lang];
  });
});

// Generar código para i18n.js
console.log('\n════════════════════════════════════════════════════');
console.log('📋 CÓDIGO PARA AGREGAR A i18n.js');
console.log('════════════════════════════════════════════════════\n');

langs.forEach(lang => {
  console.log(`\n// ─── ${lang.toUpperCase()} ───`);
  console.log(`${lang}: {`);
  console.log('  // ... campos existentes ...\n');
  console.log('  // Preset benefits');
  
  Object.entries(output[lang]).forEach(([key, value]) => {
    // Escapar comillas
    const escaped = value.replace(/'/g, "\\'");
    console.log(`  ${key}: '${escaped}',`);
  });
  
  console.log('},\n');
});

console.log('\n════════════════════════════════════════════════════');
console.log('✅ Total de keys generados:', Object.keys(output.es).length);
console.log('✅ Idiomas:', langs.join(', '));
console.log('════════════════════════════════════════════════════\n');

// También generar JSON para referencia
import fs from 'fs';
fs.writeFileSync('./preset-benefits-extracted.json', JSON.stringify(output, null, 2));
console.log('💾 Guardado en: preset-benefits-extracted.json\n');
