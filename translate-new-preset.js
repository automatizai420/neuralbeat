// ════════════════════════════════════════════════════
// translate-new-preset.js
// Traduce automáticamente un preset a todos los idiomas
// ════════════════════════════════════════════════════

import https from 'https';
import { PRESETS } from './presets.js';

const API_KEY = 'AIzaSyBWsrT3JUCcfRubxOQ-N4dAz8FxGhDThF4';
const TARGET_LANGS = ['fr', 'pt', 'zh', 'hi'];

// Función para traducir texto
async function translateText(text, targetLang, sourceLang = 'en') {
  return new Promise((resolve, reject) => {
    const encodedText = encodeURIComponent(text);
    const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}&q=${encodedText}&target=${targetLang}&source=${sourceLang}`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.data && json.data.translations && json.data.translations[0]) {
            resolve(json.data.translations[0].translatedText);
          } else {
            reject(new Error('Invalid response'));
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Función para esperar (rate limiting)
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Función principal
async function translatePreset(presetId) {
  console.log(`\n🌍 Traduciendo preset: ${presetId}\n`);
  
  const preset = PRESETS.find(p => p.id === presetId);
  
  if (!preset) {
    console.error(`❌ Preset "${presetId}" no encontrado`);
    return;
  }
  
  // Campos a traducir
  const fieldsToTranslate = [
    'name',
    'description',
    'longDescription'
  ];
  
  const translations = {};
  
  // Traducir cada campo
  for (const field of fieldsToTranslate) {
    if (!preset[field]) continue;
    
    const enText = preset[field].en;
    if (!enText) continue;
    
    console.log(`📝 Traduciendo: ${field}`);
    translations[field] = { 
      es: preset[field].es || enText, 
      en: enText 
    };
    
    for (const lang of TARGET_LANGS) {
      try {
        const translated = await translateText(enText, lang);
        translations[field][lang] = translated;
        const preview = translated.length > 50 ? translated.substring(0, 50) + '...' : translated;
        console.log(`  ✓ ${lang}: ${preview}`);
        await wait(150); // Rate limiting
      } catch (e) {
        console.error(`  ❌ Error en ${lang}: ${e.message}`);
        translations[field][lang] = enText; // Fallback
      }
    }
  }
  
  // Generar código para copiar/pegar
  console.log('\n\n════════════════════════════════════════════════════');
  console.log('📋 CÓDIGO TRADUCIDO - Copiar y pegar en presets.js:');
  console.log('════════════════════════════════════════════════════\n');
  
  for (const [field, langs] of Object.entries(translations)) {
    console.log(`${field}: {`);
    console.log(`  es: "${langs.es.replace(/"/g, '\\"')}",`);
    console.log(`  en: "${langs.en.replace(/"/g, '\\"')}",`);
    console.log(`  fr: "${langs.fr.replace(/"/g, '\\"')}",`);
    console.log(`  pt: "${langs.pt.replace(/"/g, '\\"')}",`);
    console.log(`  zh: "${langs.zh.replace(/"/g, '\\"')}",`);
    console.log(`  hi: "${langs.hi.replace(/"/g, '\\"')}"`);
    console.log('},\n');
  }
  
  console.log('════════════════════════════════════════════════════');
  console.log('✅ Traducción completada!\n');
}

// Uso: node translate-new-preset.js <preset-id>
const presetId = process.argv[2];

if (!presetId) {
  console.error('❌ Uso: node translate-new-preset.js <preset-id>');
  console.error('   Ejemplo: node translate-new-preset.js delta');
  process.exit(1);
}

translatePreset(presetId).catch(console.error);
