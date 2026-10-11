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
var detodopeliculas_exports = {};
__export(detodopeliculas_exports, {
  getStreams: () => getStreams
});
module.exports = __toCommonJS(detodopeliculas_exports);
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
function resolve2(embedUrl) {
  return __async(this, null, function* () {
    try {
      console.log(`[OkRu] Resolviendo: ${embedUrl}`);
      const raw = yield fetch(embedUrl, {
        headers: {
          "User-Agent": UA3,
          "Accept": "text/html",
          "Referer": "https://ok.ru/"
        },
        redirect: "follow"
      }).then((r) => r.text());
      if (raw.includes("copyrightsRestricted") || raw.includes("COPYRIGHTS_RESTRICTED") || raw.includes("LIMITED_ACCESS") || raw.includes("notFound") || !raw.includes("urls")) {
        console.log("[OkRu] Video no disponible o eliminado");
        return null;
      }
      const data = raw.replace(/\\&quot;/g, '"').replace(/\\u0026/g, "&").replace(/\\/g, "");
      const matches = [...data.matchAll(/"name":"([^"]+)","url":"([^"]+)"/g)];
      const QUALITY_ORDER = ["full", "hd", "sd", "low", "lowest"];
      const videos = matches.map((m) => ({ type: m[1], url: m[2] })).filter((v) => !v.type.toLowerCase().includes("mobile") && v.url.startsWith("http"));
      if (videos.length === 0) {
        console.log("[OkRu] No se encontraron URLs");
        return null;
      }
      const sorted = videos.sort((a, b) => {
        const ai = QUALITY_ORDER.findIndex((q) => a.type.toLowerCase().includes(q));
        const bi = QUALITY_ORDER.findIndex((q) => b.type.toLowerCase().includes(q));
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      });
      const best = sorted[0];
      console.log(`[OkRu] URL encontrada (${best.type}): ${best.url.substring(0, 80)}...`);
      const QUALITY_MAP = { full: "1080p", hd: "720p", sd: "480p", low: "360p", lowest: "240p" };
      return {
        url: best.url,
        quality: QUALITY_MAP[best.type] || best.type,
        headers: { "User-Agent": UA3, "Referer": "https://ok.ru/" }
      };
    } catch (e) {
      console.log(`[OkRu] Error: ${e.message}`);
      return null;
    }
  });
}
var import_crypto_js = __toESM(require("crypto-js"));
var UA4 = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36";
var KEY = import_crypto_js.default.enc.Hex.parse("6b69656d7469656e6d75613931316361");
var IV = import_crypto_js.default.enc.Hex.parse("313233343536373839306f6975797472");
function encryptToken(data) {
  const encrypted = import_crypto_js.default.AES.encrypt(JSON.stringify(data), KEY, {
    iv: IV,
    mode: import_crypto_js.default.mode.CBC,
    padding: import_crypto_js.default.pad.Pkcs7
  });
  return encrypted.ciphertext.toString(import_crypto_js.default.enc.Hex);
}
function decryptResponse(hexData) {
  const cipherParams = import_crypto_js.default.lib.CipherParams.create({
    ciphertext: import_crypto_js.default.enc.Hex.parse(hexData)
  });
  const decrypted = import_crypto_js.default.AES.decrypt(cipherParams, KEY, {
    iv: IV,
    mode: import_crypto_js.default.mode.CBC,
    padding: import_crypto_js.default.pad.Pkcs7
  });
  return JSON.parse(decrypted.toString(import_crypto_js.default.enc.Utf8));
}
function safeFetch(url, headers) {
  return __async(this, null, function* () {
    if (typeof XMLHttpRequest !== "undefined") {
      return new Promise((resolve4, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "text";
        for (const [k, v] of Object.entries(headers)) {
          xhr.setRequestHeader(k, v);
        }
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const cookie = xhr.getResponseHeader("set-cookie") || "";
            resolve4({ text: xhr.responseText, cookie });
          } else {
            reject(new Error(`HTTP ${xhr.status}`));
          }
        };
        xhr.onerror = () => reject(new Error("XHR network error"));
        xhr.send();
      });
    } else {
      const resp = yield fetch(url, { headers });
      if (!resp.ok)
        throw new Error(`HTTP ${resp.status}`);
      const cookie = resp.headers.get("set-cookie") || "";
      const text = yield resp.text();
      return { text, cookie };
    }
  });
}
function resolve3(embedUrl) {
  return __async(this, null, function* () {
    try {
      const videoId = embedUrl.includes("/") ? embedUrl.split("/").pop().replace("#", "") : embedUrl;
      const baseUrl = "https://gdtvid.p2pplay.pro";
      console.log(`[Gdtvid] Resolviendo: ${videoId}`);
      const infoData = yield safeFetch(`${baseUrl}/api/v1/info?id=${videoId}`, {
        "User-Agent": UA4,
        "Referer": "https://gdtvid.p2pplay.pro/"
      });
      const cookie = infoData.cookie;
      const payload = {
        sessionId: "p2pplay_test_session",
        userId: "null",
        playerId: "jw8",
        videoId,
        country: "US",
        platform: "web",
        browser: "chrome",
        os: "windows",
        timestamp: Date.now()
      };
      const token = encryptToken(payload);
      const [, videoData] = yield Promise.all([
        safeFetch(`${baseUrl}/api/v1/player?t=${token}`, {
          "User-Agent": UA4,
          "Referer": "https://gdtvid.p2pplay.pro/",
          "Cookie": cookie || ""
        }),
        safeFetch(`${baseUrl}/api/v1/video?id=${videoId}&w=1536&h=864&r=null`, {
          "User-Agent": UA4,
          "Referer": "https://gdtvid.p2pplay.pro/",
          "Cookie": cookie || ""
        })
      ]);
      const data = decryptResponse(videoData.text.trim());
      if (!data.source) {
        throw new Error("No se encontr\xF3 ning\xFAn enlace de video v\xE1lido en la respuesta");
      }
      console.log(`[Gdtvid] URL final generada: ${data.source.substring(0, 80)}...`);
      const quality = yield detectQuality(data.source, {
        "Referer": "https://gdtvid.p2pplay.pro/",
        "Origin": "https://gdtvid.p2pplay.pro"
      });
      return {
        url: data.source,
        quality,
        headers: {
          "User-Agent": UA4,
          "Referer": "https://gdtvid.p2pplay.pro/",
          "Origin": "https://gdtvid.p2pplay.pro"
        }
      };
    } catch (e) {
      console.log(`[Gdtvid] Error: ${e.message}`);
      return null;
    }
  });
}
var TMDB_API_KEY = "439c478a771f35c05022f9feabcca01c";
var UA5 = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
var HEADERS = { "User-Agent": UA5, "Accept": "text/html,application/json" };
var BASE_URL = "https://detodopeliculas.nu";
var RESOLVER_MAP = {
  "voe.sx": resolve,
  "ok.ru": resolve2,
  "gdtvid": resolve3
};
var SERVER_LABELS = {
  "voe.sx": "VOE",
  "ok.ru": "OkRu",
  "gdtvid": "GDTvid"
};
var LANG_PRIORITY = ["LAT", "ESP", "SUB"];
var LANG_LABELS = { "LAT": "Latino", "ESP": "Castellano", "SUB": "Subtitulado" };
function httpGet(_0) {
  return __async(this, arguments, function* (url, options = {}) {
    const res = yield fetch(url, {
      headers: __spreadValues(__spreadValues({}, HEADERS), options.headers),
      method: options.method || "GET",
      redirect: "follow"
    });
    if (!res.ok)
      throw new Error(`HTTP ${res.status}`);
    const contentType = res.headers.get("content-type") || "";
    return contentType.includes("json") ? res.json() : res.text();
  });
}
function buildSlug(title, year = null) {
  const slug = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return year ? `${slug}-${year}` : slug;
}
function getResolverData(url) {
  for (const [domain, resolver] of Object.entries(RESOLVER_MAP)) {
    if (url.includes(domain)) {
      return { resolver, serverName: SERVER_LABELS[domain] || "Online" };
    }
  }
  return { resolver: null, serverName: "Desconocido" };
}
function extractUrl(embedUrl) {
  if (!embedUrl)
    return null;
  const match = embedUrl.match(/src=["']([^"']+)["']/i);
  if (match)
    return match[1];
  return embedUrl;
}
function getTmdbData(tmdbId, mediaType) {
  return __async(this, null, function* () {
    const langs = ["es-MX", "en-US", "es-ES"];
    const results = yield Promise.all(langs.map(
      (lang) => httpGet(`https://api.themoviedb.org/3/${mediaType}/${tmdbId}?api_key=${TMDB_API_KEY}&language=${lang}`).catch(() => null)
    ));
    const titles = /* @__PURE__ */ new Set();
    let year = "";
    for (const data of results) {
      if (!data)
        continue;
      const title = mediaType === "movie" ? data.title : data.name;
      const originalTitle = mediaType === "movie" ? data.original_title : data.original_name;
      if (!year)
        year = (data.release_date || data.first_air_date || "").substring(0, 4);
      if (title && !/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(title))
        titles.add(title);
      if (originalTitle)
        titles.add(originalTitle);
    }
    return titles.size > 0 ? { titles: Array.from(titles), year } : null;
  });
}
function findMediaUrl(tmdbInfo, mediaType) {
  return __async(this, null, function* () {
    const category = mediaType === "movie" ? "pelicula" : "serie";
    const slugsToTry = /* @__PURE__ */ new Set();
    for (const title of tmdbInfo.titles) {
      slugsToTry.add(buildSlug(title, tmdbInfo.year));
      slugsToTry.add(buildSlug(title));
    }
    try {
      return yield Promise.any([...slugsToTry].map((slug) => __async(this, null, function* () {
        const url = `${BASE_URL}/${category}/${slug}/`;
        const res = yield fetch(url, { headers: HEADERS, redirect: "follow" });
        if (!res.ok)
          throw new Error();
        console.log(`[DeTodoPeliculas] \u2713 P\xE1gina encontrada: ${url}`);
        return url;
      })));
    } catch (e) {
      return null;
    }
  });
}
function getEpisodeUrl(seriesUrl, season, episode) {
  return __async(this, null, function* () {
    try {
      const html = yield httpGet(`${seriesUrl}?ep_season=${season}`);
      const blocks = html.split(/<article|<li|<div class=["']episodios/i);
      for (const block of blocks) {
        if (block.includes(`>${season} - ${episode}<`) || block.includes(`>${season}x${episode}<`)) {
          const match = block.match(/href=["'](https:\/\/detodopeliculas\.nu\/episodio\/[^"']+)["']/i);
          if (match)
            return match[1];
        }
      }
    } catch (e) {
      return null;
    }
    return null;
  });
}
function getEmbedsByLanguage(pageUrl) {
  return __async(this, null, function* () {
    const html = yield httpGet(pageUrl);
    const embedsByLang = { LAT: [], ESP: [], SUB: [] };
    const uniqueUrls = /* @__PURE__ */ new Set();
    const optionBlocks = [...html.matchAll(
      /<li[^>]*class=["'][^"']*dooplay_player_option[^"']*["'][^>]*>([\s\S]*?)<\/li>/gi
    )];
    console.log(`[AJAX] opciones encontradas: ${optionBlocks.length}`);
    const ajaxCalls = [];
    for (const match of optionBlocks) {
      const block = match[0];
      const content = match[1].toLowerCase();
      const postMatch = block.match(/data-post=["']([^"']+)["']/i);
      const numeMatch = block.match(/data-nume=["']([^"']+)["']/i);
      const typeMatch = block.match(/data-type=["']([^"']+)["']/i);
      if (!postMatch || !numeMatch || !typeMatch)
        continue;
      let lang = "SUB";
      if (content.includes("lat") || content.includes("latino") || content.includes("mx"))
        lang = "LAT";
      else if (content.includes("cast") || content.includes("espa\xF1ol") || content.includes("es "))
        lang = "ESP";
      ajaxCalls.push({ post: postMatch[1], nume: numeMatch[1], playerType: typeMatch[1], lang });
    }
    const results = yield Promise.allSettled(ajaxCalls.map((_0) => __async(this, [_0], function* ({ post, nume, playerType, lang }) {
      const form = new URLSearchParams();
      form.append("action", "doo_player_ajax");
      form.append("post", post);
      form.append("nume", nume);
      form.append("type", playerType);
      const res = yield fetch(`${BASE_URL}/wp-admin/admin-ajax.php`, {
        method: "POST",
        headers: __spreadProps(__spreadValues({}, HEADERS), {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Requested-With": "XMLHttpRequest",
          "Referer": pageUrl
        }),
        body: form.toString()
      });
      const raw = yield res.text();
      const data = JSON.parse(raw);
      const embedUrl = extractUrl(data == null ? void 0 : data.embed_url);
      if (!embedUrl || (data == null ? void 0 : data.type) === "trailer")
        return null;
      if (!embedUrl.startsWith("http"))
        return null;
      if (embedUrl.includes("youtube.com") || embedUrl.includes("googletagmanager"))
        return null;
      return { embedUrl, lang };
    })));
    for (const r of results) {
      if (r.status !== "fulfilled" || !r.value)
        continue;
      const { embedUrl, lang } = r.value;
      if (!uniqueUrls.has(embedUrl)) {
        uniqueUrls.add(embedUrl);
        embedsByLang[lang].push(embedUrl);
      }
    }
    if (embedsByLang.LAT.length === 0 && embedsByLang.ESP.length === 0 && embedsByLang.SUB.length === 0) {
      const allIframes = [...html.matchAll(/<iframe[^>]+src=["']([^"']+)["']/gi)];
      for (const match of allIframes) {
        const url = match[1];
        if (!url.startsWith("http"))
          continue;
        if (url.includes("youtube.com") || url.includes("googletagmanager"))
          continue;
        if (!uniqueUrls.has(url)) {
          uniqueUrls.add(url);
          embedsByLang.LAT.push(url);
        }
      }
    }
    return embedsByLang;
  });
}
function getStreams(tmdbId, mediaType, season, episode) {
  return __async(this, null, function* () {
    if (!tmdbId || !mediaType)
      return [];
    const startTime = Date.now();
    console.log(`[DeTodoPeliculas] Buscando: TMDB ${tmdbId} (${mediaType})${season ? ` S${season}E${episode}` : ""}`);
    try {
      const tmdbInfo = yield getTmdbData(tmdbId, mediaType);
      if (!tmdbInfo)
        return [];
      const mediaUrl = yield findMediaUrl(tmdbInfo, mediaType);
      if (!mediaUrl)
        return [];
      let targetUrl = mediaUrl;
      if (mediaType === "tv" && season && episode) {
        targetUrl = yield getEpisodeUrl(mediaUrl, season, episode);
        if (!targetUrl)
          return [];
      }
      const embedsByLang = yield getEmbedsByLanguage(targetUrl);
      console.log("[DeTodoPeliculas] Embeds encontrados:", JSON.stringify({
        LAT: embedsByLang.LAT.length,
        ESP: embedsByLang.ESP.length,
        SUB: embedsByLang.SUB.length
      }));
      for (const lang of LANG_PRIORITY) {
        const urls = embedsByLang[lang];
        if (!urls || urls.length === 0)
          continue;
        console.log(`[DeTodoPeliculas] Resolviendo ${urls.length} embeds en ${LANG_LABELS[lang]}...`);
        const resolvePromises = urls.map((url) => __async(this, null, function* () {
          const { resolver, serverName } = getResolverData(url);
          if (!resolver) {
            return null;
          }
          try {
            const streamData = yield resolver(url);
            if (!streamData)
              return null;
            return {
              name: "DeTodoPeliculas",
              title: `${streamData.quality || "Unknown"} \xB7 ${LANG_LABELS[lang]} \xB7 ${serverName}`,
              url: streamData.url,
              quality: streamData.quality || "Unknown",
              headers: streamData.headers || { "User-Agent": UA5, "Referer": targetUrl }
            };
          } catch (e) {
            return null;
          }
        }));
        const results = yield Promise.allSettled(resolvePromises);
        const validStreams = results.filter((r) => r.status === "fulfilled" && r.value !== null).map((r) => r.value);
        if (validStreams.length > 0) {
          const elapsed = ((Date.now() - startTime) / 1e3).toFixed(2);
          console.log(`[DeTodoPeliculas] \u2713 ${validStreams.length} streams encontrados en ${LANG_LABELS[lang]} (${elapsed}s), omitiendo otros idiomas.`);
          return validStreams;
        } else {
          console.log(`[DeTodoPeliculas] Sin streams exitosos en ${LANG_LABELS[lang]}, intentando siguiente idioma...`);
        }
      }
      console.log("[DeTodoPeliculas] Agotada la b\xFAsqueda en todos los idiomas sin \xE9xito.");
      return [];
    } catch (e) {
      console.log(`[DeTodoPeliculas] Error Cr\xEDtico: ${e.message}`);
      return [];
    }
  });
}
