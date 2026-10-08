var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve4, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve4(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var embed69_exports = {};
__export(embed69_exports, {
  getStreams: () => getStreams
});
module.exports = __toCommonJS(embed69_exports);
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
var TIER_MAPS = {
  vimeos: { h: "720p", n: "480p" },
  goodstream: { x: "1080p", h: "720p", n: "480p", l: "360p" },
  vidhide: { n: "720p", l: "480p" },
  streamwish: { x: "1080p", h: "1080p", n: "720p", l: "480p" },
  voe: { n: "720p", l: "360p" }
};
var TIER_PRIORITY = ["x", "o", "h", "n", "l"];
function getCdnTierMap(url) {
  if (url.includes("vimeos"))
    return TIER_MAPS.vimeos;
  if (url.includes("goodstream"))
    return TIER_MAPS.goodstream;
  if (url.includes("cloudwindow-route"))
    return TIER_MAPS.voe;
  if (url.includes("minochinos") || url.includes("vidhide") || url.includes("dintezuvio") || url.includes("dramiyos"))
    return TIER_MAPS.vidhide;
  if (url.includes("premilkyway") || url.includes("hlswish") || url.includes("vibuxer") || url.includes("streamwish"))
    return TIER_MAPS.streamwish;
  return null;
}
function smartQuality(_0) {
  return __async(this, arguments, function* (url, headers = {}) {
    const inferred = inferQuality(url);
    if (inferred !== "Unknown")
      return inferred;
    return yield detectQuality(url, headers);
  });
}
function inferQuality(url) {
  if (!url)
    return "Unknown";
  const tierMap = getCdnTierMap(url);
  if (tierMap) {
    const tierMatch = url.match(/_,([a-z,]+),\.urlset/);
    if (tierMatch) {
      const tiers = tierMatch[1].split(",").filter(Boolean);
      for (const t of TIER_PRIORITY) {
        if (tiers.includes(t) && tierMap[t])
          return tierMap[t];
      }
    }
  }
  const numMatch = url.match(/[_\-\/](\d{3,4})p/);
  if (numMatch)
    return numMatch[1] + "p";
  return "Unknown";
}
function normalizeResolution(width, height) {
  if (width >= 3840 || height >= 2160)
    return "4K";
  if (width >= 1920 || height >= 1080)
    return "1080p";
  if (width >= 1280 || height >= 720)
    return "720p";
  if (width >= 854 || height >= 480)
    return "480p";
  return "360p";
}
function detectQuality(_0) {
  return __async(this, arguments, function* (m3u8Url, headers = {}) {
    try {
      const res = yield fetch(m3u8Url, {
        headers: __spreadValues({ "User-Agent": UA }, headers),
        redirect: "follow"
      });
      const data = yield res.text();
      if (!data.includes("#EXT-X-STREAM-INF")) {
        const match = m3u8Url.match(/[_-](\d{3,4})p/);
        return match ? `${match[1]}p` : "Unknown";
      }
      let bestWidth = 0;
      let bestHeight = 0;
      for (const line of data.split("\n")) {
        const m = line.match(/RESOLUTION=(\d+)x(\d+)/);
        if (m) {
          const h = parseInt(m[2]);
          if (h > bestHeight) {
            bestHeight = h;
            bestWidth = parseInt(m[1]);
          }
        }
      }
      return bestHeight > 0 ? normalizeResolution(bestWidth, bestHeight) : "Unknown";
    } catch (e) {
      return "Unknown";
    }
  });
}
var UA2 = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function b64toString(str) {
  try {
    if (typeof atob !== "undefined")
      return atob(str);
    return Buffer.from(str, "base64").toString("utf8");
  } catch (e) {
    return null;
  }
}
function voeDecode(ct, luts) {
  try {
    const rawLuts = luts.replace(/^\[|\]$/g, "").split("','").map((s) => s.replace(/^'+|'+$/g, ""));
    const escapedLuts = rawLuts.map((i) => i.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    let txt = "";
    for (let ch of ct) {
      let x = ch.charCodeAt(0);
      if (x > 64 && x < 91)
        x = (x - 52) % 26 + 65;
      else if (x > 96 && x < 123)
        x = (x - 84) % 26 + 97;
      txt += String.fromCharCode(x);
    }
    for (const pat of escapedLuts)
      txt = txt.replace(new RegExp(pat, "g"), "_");
    txt = txt.split("_").join("");
    const decoded1 = b64toString(txt);
    if (!decoded1)
      return null;
    let step4 = "";
    for (let i = 0; i < decoded1.length; i++) {
      step4 += String.fromCharCode((decoded1.charCodeAt(i) - 3 + 256) % 256);
    }
    const revBase64 = step4.split("").reverse().join("");
    const finalStr = b64toString(revBase64);
    if (!finalStr)
      return null;
    return JSON.parse(finalStr);
  } catch (e) {
    console.log("[VOE] voeDecode error:", e.message);
    return null;
  }
}
function fetchUrl(_0) {
  return __async(this, arguments, function* (url, headers = {}) {
    const resp = yield fetch(url, {
      method: "GET",
      headers: __spreadValues({
        "User-Agent": UA2,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      }, headers),
      redirect: "follow"
    });
    return resp;
  });
}
function resolve(embedUrl) {
  return __async(this, null, function* () {
    try {
      console.log(`[VOE] Resolviendo: ${embedUrl}`);
      let pageResp = yield fetchUrl(embedUrl, { Referer: embedUrl });
      if (!pageResp.ok)
        throw new Error(`HTTP ${pageResp.status}`);
      let data = yield pageResp.text();
      if (/permanentToken/i.test(data)) {
        const m2 = data.match(/window\.location\.href\s*=\s*'([^']+)'/i);
        if (m2) {
          console.log(`[VOE] Permanent token redirect -> ${m2[1]}`);
          const r2 = yield fetchUrl(m2[1], { Referer: embedUrl });
          if (r2.ok) {
            data = yield r2.text();
          }
        }
      }
      const rMain = data.match(
        /json">\s*\[\s*['"]([^'"]+)['"]\s*\]\s*<\/script>\s*<script[^>]*src=['"]([^'"]+)['"]/i
      );
      if (rMain) {
        const encodedArray = rMain[1];
        const loaderUrl = rMain[2].startsWith("http") ? rMain[2] : new URL(rMain[2], embedUrl).href;
        console.log(`[VOE] Found encoded array + loader: ${loaderUrl}`);
        const jsResp = yield fetchUrl(loaderUrl, { Referer: embedUrl });
        const jsData = jsResp.ok ? yield jsResp.text() : "";
        const replMatch = jsData.match(/(\[(?:'[^']{1,10}'[\s,]*){4,12}\])/i) || jsData.match(/(\[(?:"[^"]{1,10}"[,\s]*){4,12}\])/i);
        if (replMatch) {
          const decoded = voeDecode(encodedArray, replMatch[1]);
          if (decoded && (decoded.source || decoded.direct_access_url)) {
            const url = decoded.source || decoded.direct_access_url;
            const quality = inferQuality(url);
            console.log(`[VOE] URL encontrada: ${url.substring(0, 80)}...`);
            return { url, quality, headers: { Referer: embedUrl } };
          }
        }
      }
      const re1 = /(?:mp4|hls)'\s*:\s*'([^']+)'/gi;
      const re2 = /(?:mp4|hls)"\s*:\s*"([^"]+)"/gi;
      const matches = [];
      let m;
      while ((m = re1.exec(data)) !== null)
        matches.push(m);
      while ((m = re2.exec(data)) !== null)
        matches.push(m);
      for (const match of matches) {
        const candidate = match[1];
        if (!candidate)
          continue;
        let url = candidate;
        if (url.startsWith("aHR0")) {
          try {
            url = atob(url);
          } catch (e) {
          }
        }
        console.log(`[VOE] URL encontrada (fallback): ${url.substring(0, 80)}...`);
        return { url, quality: inferQuality(url), headers: { Referer: embedUrl } };
      }
      console.log("[VOE] No se encontr\xF3 URL");
      return null;
    } catch (err) {
      console.log(`[VOE] Error: ${err.message}`);
      return null;
    }
  });
}
var UA3 = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function unpackEval(payload, radix, symtab) {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const unbase = (str) => {
    let result = 0;
    for (let i = 0; i < str.length; i++) {
      const pos = chars.indexOf(str[i]);
      if (pos === -1)
        return NaN;
      result = result * radix + pos;
    }
    return result;
  };
  return payload.replace(/\b([0-9a-zA-Z]+)\b/g, (match) => {
    const idx = unbase(match);
    if (isNaN(idx) || idx >= symtab.length)
      return match;
    return symtab[idx] && symtab[idx] !== "" ? symtab[idx] : match;
  });
}
function extractHlsUrl(unpacked, embedHost) {
  const objMatch = unpacked.match(/\{[^{}]*"hls[234]"\s*:\s*"([^"]+)"[^{}]*\}/);
  if (objMatch) {
    try {
      const normalized = objMatch[0].replace(/(\w+)\s*:/g, '"$1":');
      const obj = JSON.parse(normalized);
      const url = obj.hls4 || obj.hls3 || obj.hls2;
      if (url)
        return url.startsWith("/") ? embedHost + url : url;
    } catch (e) {
      const urlMatch = objMatch[0].match(/"hls[234]"\s*:\s*"([^"]+\.m3u8[^"]*)"/);
      if (urlMatch) {
        const url = urlMatch[1];
        return url.startsWith("/") ? embedHost + url : url;
      }
    }
  }
  const m3u8Match = unpacked.match(/["']([^"']{30,}\.m3u8[^"']*)['"]/i);
  if (m3u8Match) {
    const url = m3u8Match[1];
    return url.startsWith("/") ? embedHost + url : url;
  }
  return null;
}
var DOMAIN_MAP = {
  "hglink.to": "vibuxer.com"
};
function resolve2(embedUrl) {
  return __async(this, null, function* () {
    var _a;
    try {
      let fetchUrl2 = embedUrl;
      for (const [from, to] of Object.entries(DOMAIN_MAP)) {
        if (fetchUrl2.includes(from)) {
          fetchUrl2 = fetchUrl2.replace(from, to);
          break;
        }
      }
      const embedHost = ((_a = fetchUrl2.match(/^(https?:\/\/[^/]+)/)) == null ? void 0 : _a[1]) || "https://hlswish.com";
      console.log(`[HLSWish] Resolviendo: ${embedUrl}`);
      if (fetchUrl2 !== embedUrl)
        console.log(`[HLSWish] \u2192 Mapped to: ${fetchUrl2}`);
      const resp = yield fetch(fetchUrl2, {
        headers: {
          "User-Agent": UA3,
          "Referer": "https://embed69.org/",
          "Origin": "https://embed69.org",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "es-MX,es;q=0.9"
        },
        redirect: "follow"
      });
      if (!resp.ok)
        throw new Error(`HTTP ${resp.status}`);
      const data = yield resp.text();
      const fileMatch = data.match(/file\s*:\s*["']([^"']+)["']/i);
      if (fileMatch) {
        let url = fileMatch[1];
        if (url.startsWith("/"))
          url = embedHost + url;
        if (url.includes("vibuxer.com/stream/")) {
          console.log(`[HLSWish] Siguiendo redirect: ${url.substring(0, 80)}...`);
          try {
            const redirectResp = yield fetch(url, {
              headers: { "User-Agent": UA3, "Referer": embedHost + "/" },
              redirect: "follow"
            });
            const finalUrl = redirectResp.url;
            if (finalUrl && finalUrl.includes(".m3u8")) {
              url = finalUrl;
            }
          } catch (e) {
          }
        }
        console.log(`[HLSWish] URL encontrada: ${url.substring(0, 80)}...`);
        return { url, quality: smartQuality(url), headers: { "User-Agent": UA3, "Referer": embedHost + "/" } };
      }
      const packMatch = data.match(
        /eval\(function\(p,a,c,k,e,[a-z]\)\{[^}]+\}\s*\('([\s\S]+?)',\s*(\d+),\s*(\d+),\s*'([\s\S]+?)'\.split\('\|'\)/
      );
      if (packMatch) {
        const unpacked = unpackEval(packMatch[1], parseInt(packMatch[2]), packMatch[4].split("|"));
        const url = extractHlsUrl(unpacked, embedHost);
        if (url) {
          console.log(`[HLSWish] URL encontrada: ${url.substring(0, 80)}...`);
          return { url, quality: smartQuality(url), headers: { "User-Agent": UA3, "Referer": embedHost + "/" } };
        }
      }
      const rawM3u8 = data.match(/https?:\/\/[^"'\s\\]+\.m3u8[^"'\s\\]*/i);
      if (rawM3u8) {
        console.log(`[HLSWish] URL encontrada: ${rawM3u8[0].substring(0, 80)}...`);
        return { url: rawM3u8[0], quality: smartQuality(rawM3u8[0]), headers: { "User-Agent": UA3, "Referer": embedHost + "/" } };
      }
      console.log("[HLSWish] No se encontr\xF3 URL");
      return null;
    } catch (err) {
      console.log(`[HLSWish] Error: ${err.message}`);
      return null;
    }
  });
}
var UA4 = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function unpack(packed) {
  try {
    const match = packed.match(
      /eval\(function\(p,a,c,k,e,[rd]\)\{.*?\}\s*\('([\s\S]*?)',\s*(\d+),\s*(\d+),\s*'([\s\S]*?)'\.split\('\|'\)/
    );
    if (!match)
      return null;
    let [, p, a, c, k] = match;
    a = parseInt(a);
    c = parseInt(c);
    k = k.split("|");
    const base = (num, b) => {
      const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
      let result = "";
      while (num > 0) {
        result = chars[num % b] + result;
        num = Math.floor(num / b);
      }
      return result || "0";
    };
    p = p.replace(/\b\w+\b/g, (word) => {
      const num = parseInt(word, 36);
      const replacement = num < k.length && k[num] ? k[num] : base(num, a);
      return replacement;
    });
    return p;
  } catch (e) {
    return null;
  }
}
function resolve3(embedUrl) {
  return __async(this, null, function* () {
    var _a;
    try {
      console.log(`[VidHide] Resolviendo: ${embedUrl}`);
      const resp = yield fetch(embedUrl, {
        method: "GET",
        headers: {
          "User-Agent": UA4,
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Referer": "https://embed69.org/"
        },
        redirect: "follow"
      });
      if (!resp.ok)
        throw new Error(`HTTP ${resp.status}`);
      const html = yield resp.text();
      const evalMatch = html.match(/eval\(function\(p,a,c,k,e,[rd]\)[\s\S]*?\.split\('\|'\)[^\)]*\)\)/);
      if (!evalMatch) {
        console.log("[VidHide] No se encontr\xF3 bloque eval");
        return null;
      }
      const unpacked = unpack(evalMatch[0]);
      if (!unpacked) {
        console.log("[VidHide] No se pudo desempacar");
        return null;
      }
      const hls4Match = unpacked.match(/"hls4"\s*:\s*"([^"]+)"/);
      const hls2Match = unpacked.match(/"hls2"\s*:\s*"([^"]+)"/);
      const m3u8Relative = (_a = hls4Match || hls2Match) == null ? void 0 : _a[1];
      if (!m3u8Relative) {
        console.log("[VidHide] No se encontr\xF3 hls4/hls2");
        return null;
      }
      let m3u8Url = m3u8Relative;
      if (!m3u8Relative.startsWith("http")) {
        const origin2 = new URL(embedUrl).origin;
        m3u8Url = `${origin2}${m3u8Relative}`;
      }
      console.log(`[VidHide] URL encontrada: ${m3u8Url.substring(0, 80)}...`);
      const origin = new URL(embedUrl).origin;
      return {
        url: m3u8Url,
        quality: yield smartQuality(m3u8Url, { "Referer": `${origin}/` }),
        headers: {
          "User-Agent": UA4,
          "Referer": `${origin}/`,
          "Origin": origin
        }
      };
    } catch (e) {
      console.log(`[VidHide] Error: ${e.message}`);
      return null;
    }
  });
}
var import_crypto_js = __toESM(require("crypto-js"));
var TMDB_API_KEY = "439c478a771f35c05022f9feabcca01c";
var UA5 = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
var BASE_URL = "https://embed69.org";
var RESOLVER_MAP = {
  "voe.sx": resolve,
  "hglink.to": resolve2,
  // streamwish
  "streamwish.com": resolve2,
  "streamwish.to": resolve2,
  "wishembed.online": resolve2,
  "filelions.com": resolve2,
  //'bysedikamoum.com':  resolveFilemoon,  // filemoon alias
  //'filemoon.sx':      resolveFilemoon,
  //'filemoon.to':      resolveFilemoon,
  //'moonembed.pro':    resolveFilemoon,
  "dintezuvio.com": resolve3,
  // vidhide
  "vidhide.com": resolve3,
  "minochinos.com": resolve3
};
var SERVER_LABELS = {
  "voe": "VOE",
  "streamwish": "StreamWish",
  "filemoon": "Filemoon",
  "vidhide": "VidHide"
};
var LANG_PRIORITY = ["LAT", "ESP", "SUB"];
function decryptEmbedLink(encryptedLink, aesKeyWordArray) {
  try {
    const rawData = import_crypto_js.default.enc.Base64.parse(encryptedLink);
    const iv = import_crypto_js.default.lib.WordArray.create(rawData.words.slice(0, 4), 16);
    const ciphertext = import_crypto_js.default.lib.WordArray.create(rawData.words.slice(4), rawData.sigBytes - 16);
    const cipherParams = import_crypto_js.default.lib.CipherParams.create({
      ciphertext
    });
    const decrypted = import_crypto_js.default.AES.decrypt(cipherParams, aesKeyWordArray, {
      iv,
      mode: import_crypto_js.default.mode.CBC,
      padding: import_crypto_js.default.pad.Pkcs7
    });
    const decryptedText = decrypted.toString(import_crypto_js.default.enc.Utf8);
    return decryptedText || null;
  } catch (e) {
    console.log(`[Embed69] Error desencriptando con CryptoJS: ${e.message}`);
    return null;
  }
}
function parseDataLink(html) {
  try {
    const match = html.match(/let\s+dataLink\s*=\s*(\[.+\]);/);
    if (!match)
      return null;
    return JSON.parse(match[1]);
  } catch (e) {
    return null;
  }
}
function getResolver(url) {
  if (!url)
    return null;
  for (const [pattern, resolver] of Object.entries(RESOLVER_MAP)) {
    if (url.includes(pattern))
      return resolver;
  }
  return null;
}
function getImdbId(tmdbId, mediaType) {
  return __async(this, null, function* () {
    const endpoint = mediaType === "movie" ? `https://api.themoviedb.org/3/movie/${tmdbId}/external_ids?api_key=${TMDB_API_KEY}` : `https://api.themoviedb.org/3/tv/${tmdbId}/external_ids?api_key=${TMDB_API_KEY}`;
    const data = yield fetch(endpoint, {
      headers: { "User-Agent": UA5 }
    }).then((r) => r.json());
    return data.imdb_id || null;
  });
}
function buildEmbedUrl(imdbId, mediaType, season, episode) {
  if (mediaType === "movie")
    return `${BASE_URL}/f/${imdbId}`;
  const e = String(episode).padStart(2, "0");
  return `${BASE_URL}/f/${imdbId}-${parseInt(season)}x${e}`;
}
function getStreams(tmdbId, mediaType, season, episode) {
  return __async(this, null, function* () {
    if (!tmdbId || !mediaType)
      return [];
    const startTime = Date.now();
    console.log(`[Embed69] Buscando: TMDB ${tmdbId} (${mediaType})${season ? ` S${season}E${episode}` : ""}`);
    try {
      let resolveBatch2 = function(embeds) {
        return __async(this, null, function* () {
          const results = yield Promise.allSettled(
            embeds.map(
              ({ url, resolver, lang, servername }) => resolver(url).then((r) => r ? __spreadProps(__spreadValues({}, r), { lang, servername }) : null)
            )
          );
          return results.filter((r) => {
            var _a;
            return r.status === "fulfilled" && ((_a = r.value) == null ? void 0 : _a.url);
          }).map((r) => r.value);
        });
      };
      var resolveBatch = resolveBatch2;
      let getEmbeds = function(section) {
        const lang = section.video_language || "LAT";
        const embeds = [];
        for (const embed of section.sortedEmbeds || []) {
          if (embed.servername === "download")
            continue;
          const decryptedUrl = decryptEmbedLink(embed.link, aesKey);
          if (!decryptedUrl)
            continue;
          const resolver = getResolver(decryptedUrl);
          if (!resolver) {
            console.log(`[Embed69] Sin resolver para ${embed.servername}: ${decryptedUrl.substring(0, 60)}`);
            continue;
          }
          embeds.push({ url: decryptedUrl, resolver, lang, servername: embed.servername });
        }
        return embeds;
      };
      const imdbId = yield getImdbId(tmdbId, mediaType);
      if (!imdbId) {
        console.log("[Embed69] No se encontr\xF3 IMDB ID");
        return [];
      }
      console.log(`[Embed69] IMDB ID: ${imdbId}`);
      const embedUrl = buildEmbedUrl(imdbId, mediaType, season, episode);
      console.log(`[Embed69] Fetching: ${embedUrl}`);
      const html = yield fetch(embedUrl, {
        headers: {
          "User-Agent": UA5,
          "Referer": "https://sololatino.net/",
          "Accept": "text/html,application/xhtml+xml"
        }
      }).then((r) => r.text());
      const dataLink = parseDataLink(html);
      if (!dataLink || dataLink.length === 0) {
        console.log("[Embed69] No se encontr\xF3 dataLink en el HTML");
        return [];
      }
      console.log(`[Embed69] ${dataLink.length} idiomas disponibles: ${dataLink.map((d) => d.video_language).join(", ")}`);
      let aesKey;
      try {
        const challenge = html.match(/POW_CHALLENGE = '([^']+)'/)[1];
        const difficulty = parseInt(html.match(/POW_DIFFICULTY = (\d+)/)[1]);
        const salt = html.match(/POW_SALT = '([^']+)'/)[1];
        const prefix = "0".repeat(difficulty);
        let nonce = 0;
        console.log(`[Embed69] Resolviendo PoW con CryptoJS (Dificultad: ${difficulty})...`);
        while (true) {
          const hashHex = import_crypto_js.default.SHA256(challenge + nonce).toString(import_crypto_js.default.enc.Hex);
          if (hashHex.startsWith(prefix)) {
            aesKey = import_crypto_js.default.SHA256(challenge + nonce + salt);
            console.log(`[Embed69] PoW Resuelto. Nonce: ${nonce}`);
            break;
          }
          nonce++;
        }
      } catch (powError) {
        console.log(`[Embed69] Error al resolver el PoW: ${powError.message}`);
        return [];
      }
      const byLang = {};
      for (const section of dataLink) {
        byLang[section.video_language] = section;
      }
      const streams = [];
      for (const lang of LANG_PRIORITY) {
        const section = byLang[lang];
        if (!section)
          continue;
        const embeds = getEmbeds(section);
        if (embeds.length === 0)
          continue;
        console.log(`[Embed69] Resolviendo ${embeds.length} embeds (${lang})...`);
        const resolved = yield resolveBatch2(embeds);
        if (resolved.length > 0) {
          for (const { url, quality, lang: l, servername, headers } of resolved) {
            const langLabel = l === "LAT" ? "Latino" : l === "ESP" ? "Espa\xF1ol" : "Subtitulado";
            const serverLabel = SERVER_LABELS[servername] || servername;
            streams.push({
              name: "Embed69",
              title: `${quality || "Unknown"} \xB7 ${langLabel} \xB7 ${serverLabel}`,
              url,
              quality: quality || "Unknown",
              headers: headers || {}
            });
            console.log(`[Embed69] Resolved: ${servername} quality=${quality} url=${url == null ? void 0 : url.substring(0, 50)}`);
          }
          console.log(`[Embed69] \u2713 Streams encontrados en ${lang}, omitiendo idiomas de menor prioridad`);
          break;
        } else {
          console.log(`[Embed69] Sin streams en ${lang}, intentando siguiente idioma...`);
        }
      }
      const elapsed = ((Date.now() - startTime) / 1e3).toFixed(2);
      console.log(`[Embed69] \u2713 ${streams.length} streams en ${elapsed}s`);
      return streams;
    } catch (e) {
      console.log(`[Embed69] Error: ${e.message}`);
      return [];
    }
  });
}
