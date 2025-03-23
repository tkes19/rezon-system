#!/usr/bin/env node

/**
 * Ten skrypt sprawdza, czy wymagane zmienne środowiskowe są dostępne przed budowaniem
 */

// Próba załadowania zmiennych z pliku .env
try {
  require('dotenv').config();
  console.log('📁 Załadowano zmienne z pliku .env');
} catch (error) {
  console.log('⚠️ Plik .env nie został znaleziony lub dotenv nie jest zainstalowany');
  console.log('Będziemy korzystać tylko ze zmiennych środowiskowych systemu');
}

console.log('🔍 Sprawdzanie zmiennych środowiskowych...');

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
];

let missingVars = [];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    missingVars.push(envVar);
  } else {
    console.log(`✅ ${envVar} jest dostępny`);
  }
}

if (missingVars.length > 0) {
  console.error('❌ Brakuje następujących zmiennych środowiskowych:');
  missingVars.forEach(v => console.error(`   - ${v}`));
  console.error('\nProszę dodać te zmienne do pliku .env lub skonfigurować je w swoim środowisku.');
  
  if (process.env.NODE_ENV === 'production') {
    console.error('\nW środowisku Netlify, dodaj te zmienne w panelu administracyjnym:');
    console.error('Site settings > Build & deploy > Environment > Environment variables');
  }
  
  process.exit(1);
} else {
  console.log('✅ Wszystkie wymagane zmienne środowiskowe są dostępne.');
} 