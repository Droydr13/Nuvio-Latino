// test.js
// Uso: 
//   node test.js [tmdbId] [tipo] [provider] (para películas)
//   node test.js [tmdbId] [tipo] [temporada] [episodio] [provider] (para series)
// Ejemplos:
//   node test.js 550 movie
//   node test.js 157336 movie cinecalidad
//   node test.js 1396 tv 1 1 lamovie

const tmdbId = process.argv[2] || '550';
const mediaType = process.argv[3] || 'movie';

let season = null;
let episode = null;
let providerName = 'lamovie';

// Detectar los argumentos según si es película o serie
if (mediaType === 'tv') {
  season = process.argv[4] ? parseInt(process.argv[4]) : null;
  episode = process.argv[5] ? parseInt(process.argv[5]) : null;
  providerName = process.argv[6] || 'lamovie';
} else {
  // Para películas, el proveedor va directamente en la 4ta posición
  providerName = process.argv[4] || 'lamovie';
}

console.log(`\nTesting ${providerName} provider...`);
console.log(`TMDB: ${tmdbId} | Tipo: ${mediaType}${season ? ` | S${season}E${episode}` : ''}\n`);

// Importamos dinámicamente el proveedor basado en la variable detectada
const { getStreams } = require(`./providers/${providerName}.js`);

getStreams(tmdbId, mediaType, season, episode)
  .then(streams => {
    if (!streams || streams.length === 0) {
      console.log('❌ No se encontraron streams');
      return;
    }
    console.log(`\n✅ ${streams.length} streams encontrados:\n`);
    streams.forEach((s, i) => {
      console.log(`[${i + 1}] ${s.title}`);
      console.log(`    URL: ${s.url}`);
      if (s.headers && Object.keys(s.headers).length > 0) {
        console.log(`    Headers: ${JSON.stringify(s.headers)}`);
      }
      console.log();
    });
  })
  .catch(e => console.error('Error:', e.message));