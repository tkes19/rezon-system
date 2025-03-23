module.exports = {
  // Funkcja wykonywana przed budowaniem
  onPreBuild: async ({ utils }) => {
    console.log('🔍 Sprawdzanie cache Next.js...');
  },
  // Funkcja wykonywana po budowaniu
  onPostBuild: async ({ utils }) => {
    console.log('✅ Zapisywanie cache Next.js dla przyszłych buildów');
  },
  // Konfiguracja pluginu
  onEnd: async ({ utils }) => {
    // Zapisanie cache
    const cacheDirectories = [
      '.next/cache',
      '.next/server',
      '.next/static'
    ];

    // Informacja dla użytkownika
    if (utils.cache.restore(cacheDirectories)) {
      console.log('📂 Przywrócono cache Next.js');
    } else {
      console.log('🆕 Nie znaleziono cache Next.js - zostanie utworzony po buildzie');
    }

    // Zapisanie cache na koniec
    utils.cache.save(cacheDirectories);
  }
}; 