// =============================================================
// 찬양 리스트 매칭 검증 + YouTube Data API 재검색
//
//  1) 각 곡 youtubeID가 가리키는 실제 영상의 제목/채널을 oEmbed로 조회
//  2) 데이터상 (제목, 아티스트)와 매칭되는지 점수화
//  3) 매칭이 안 되는(의심) 곡만 YouTube Data API(search.list)로 재검색해
//     더 적합한 후보 영상을 뽑아 출력
//
//  실행: node scripts/rescrape_songs.mjs
//  필요: .env 의 YOUTUBE_API_KEY
// =============================================================

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ------------------------------------------------------------
// .env 로드 (의존성 없이 직접 파싱)
// ------------------------------------------------------------
function loadEnv() {
  const envPath = path.join(ROOT, ".env");
  const out = {};
  if (!fs.existsSync(envPath)) return out;
  for (const raw of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    out[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
  }
  return out;
}

const env = loadEnv();
const API_KEY = env.YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY;
if (!API_KEY) {
  console.error("YOUTUBE_API_KEY 가 .env 에 없습니다.");
  process.exit(1);
}

// ------------------------------------------------------------
// data.ts 에서 SONGS 블록을 읽어 파싱
// ------------------------------------------------------------
function loadSongs() {
  const dataPath = path.join(ROOT, "src", "views", "EvangelismPage", "data.ts");
  const src = fs.readFileSync(dataPath, "utf8");

  const moods = {};
  // 각 무드 블록: comfort: [ ... ],  "strength": [ ... ]
  const moodRe = /["']?(comfort|strength|curious|love)["']?\s*:\s*\[([\s\S]*?)\]/g;
  let m;
  while ((m = moodRe.exec(src))) {
    const mood = m[1];
    const body = m[2];
    const items = [];
    const itemRe =
      /title:\s*"([^"]+)"\s*,\s*artist:\s*"([^"]+)"(?:\s*,\s*youtubeID:\s*"([^"]+)")?/g;
    let im;
    while ((im = itemRe.exec(body))) {
      items.push({ title: im[1], artist: im[2], youtubeID: im[3] || null });
    }
    if (items.length) moods[mood] = items;
  }
  return moods;
}

// ------------------------------------------------------------
// 유틸
// ------------------------------------------------------------
async function oembed(id) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
  try {
    const r = await fetch(url);
    if (!r.ok) return { error: `HTTP ${r.status}` };
    const j = await r.json();
    return { title: j.title, author: j.author_name };
  } catch (e) {
    return { error: String(e) };
  }
}

function normalize(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[\[\]\(\)\{\}"'`|/\\.,!?~\-—–:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// 데이터 제목이 영상 제목 안에 들어있는지(핵심 단어 기준)
function titleMatches(dataTitle, videoTitle) {
  const t = normalize(dataTitle);
  const v = normalize(videoTitle);
  if (!t) return false;
  if (v.includes(t)) return true;
  // 토큰 교집합 비율
  const tTok = t.split(" ").filter(Boolean);
  const vTok = new Set(v.split(" ").filter(Boolean));
  const hit = tTok.filter((w) => vTok.has(w)).length;
  return tTok.length > 0 && hit / tTok.length >= 0.6;
}

// 아티스트가 채널명 또는 영상 제목에 등장하는지
function artistMatches(dataArtist, videoTitle, author) {
  const a = normalize(dataArtist);
  if (!a) return false;
  const hay = normalize(`${author} ${videoTitle}`);
  if (hay.includes(a)) return true;
  // 한국 팀명 ↔ 영문 채널명 매핑 (대표적인 것만)
  const alias = {
    "제이어스": ["j us", "jus", "j us ministry"],
    "기프티드": ["gifted"],
    "어노인팅": ["anointing"],
    "어노이팅": ["anointing"],
    "위러브": ["welove"],
    "welove": ["welove", "위러브", "위러브"],
    "웨이홈": ["wayhome"],
    "팀룩": ["team luke", "팀룩워십"],
    "팀룩워십": ["team luke"],
    "예람워십": ["yeram"],
    "아가파오": ["agapao"],
    "위클래시아": ["wecclesia", "위클레시아"],
    "아이자야식스티원": ["isaiah6tyone", "아이자야씩스티원", "isaiah"],
    "마커스": ["markers", "마커스워십"],
    "심종호": ["markers", "마커스"],
    "지나": ["gina"],
    "gina": ["gina", "지나"],
    "한웅재": [],
    "손경민": [],
    "김상진": [],
    "김도현": [],
    "러빔": ["luvim"],
    "histigma": ["histigma"],
    "hisplan": ["hisplan"],
    "elevation rhythm": ["elevation rhythm", "elevation worship"],
    "elevation worship": ["elevation worship", "elevation rhythm"],
    "bethel music & brandon lake": ["bethel", "brandon lake"],
    "sanctus real": ["sanctus real"],
    "천관웅": ["cheon kwan woong"],
  };
  const keys = alias[normalize(dataArtist)] || alias[dataArtist] || [];
  return keys.some((k) => hay.includes(normalize(k)));
}

// "- Topic" / 1시간반복 / 커버 등 비공식 신호
function qualityFlags(videoTitle, author) {
  const flags = [];
  if (/-\s*topic$/i.test(author || "")) flags.push("Topic(자동음원)");
  if (/(1시간|무한재생|loop|\d+\s*hour)/i.test(videoTitle || "")) flags.push("반복/루프");
  if (/\bcover\b|커버/i.test(videoTitle || "")) flags.push("커버");
  if (/\bmr\b|\binst(rumental)?\b|반주/i.test(videoTitle || "")) flags.push("MR/반주");
  return flags;
}

// ------------------------------------------------------------
// YouTube Data API 검색
// ------------------------------------------------------------
async function ytSearch(query) {
  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", "5");
  url.searchParams.set("q", query);
  url.searchParams.set("videoEmbeddable", "true");
  url.searchParams.set("key", API_KEY);
  const r = await fetch(url);
  if (!r.ok) {
    const body = await r.text();
    throw new Error(`search.list HTTP ${r.status}: ${body}`);
  }
  const j = await r.json();
  return (j.items || []).map((it) => ({
    id: it.id.videoId,
    title: it.snippet.title,
    channel: it.snippet.channelTitle,
  }));
}

// ------------------------------------------------------------
// 메인
// ------------------------------------------------------------
const SONGS = loadSongs();
const suspects = [];

for (const [mood, list] of Object.entries(SONGS)) {
  console.log(`\n===== ${mood} =====`);
  for (const song of list) {
    if (!song.youtubeID) {
      console.log(`[?] ${song.title} / ${song.artist}  -> youtubeID 없음`);
      suspects.push({ mood, ...song, reason: "ID 없음", video: null });
      continue;
    }
    const res = await oembed(song.youtubeID);
    if (res.error) {
      console.log(`[X] ${song.title} / ${song.artist} (${song.youtubeID}) -> ${res.error}`);
      suspects.push({ mood, ...song, reason: `영상오류(${res.error})`, video: null });
      continue;
    }
    const tOk = titleMatches(song.title, res.title);
    const aOk = artistMatches(song.artist, res.title, res.author);
    const flags = qualityFlags(res.title, res.author);
    const bad = !tOk || !aOk;
    const tag = bad ? "[MISMATCH]" : flags.length ? "[FLAG]" : "[OK]";
    console.log(
      `${tag} ${song.title} / ${song.artist} (${song.youtubeID})\n` +
        `        video: "${res.title}" @ ${res.author}` +
        `  {title:${tOk ? "✓" : "✗"} artist:${aOk ? "✓" : "✗"}${flags.length ? " " + flags.join(",") : ""}}`
    );
    if (bad || flags.length) {
      const reasons = [];
      if (!tOk) reasons.push("제목불일치");
      if (!aOk) reasons.push("아티스트불일치");
      reasons.push(...flags);
      suspects.push({
        mood,
        ...song,
        reason: reasons.join(", "),
        video: { title: res.title, author: res.author },
      });
    }
  }
}

// ------------------------------------------------------------
// 의심 곡 재검색
// ------------------------------------------------------------
console.log(`\n\n######## 의심 곡 ${suspects.length}개 재검색 (YouTube Data API) ########`);
const proposals = {};

for (const s of suspects) {
  const query = `${s.title} ${s.artist}`;
  console.log(`\n■ [${s.mood}] ${s.title} / ${s.artist}  (사유: ${s.reason})`);
  if (s.youtubeID) console.log(`   현재ID: ${s.youtubeID}`);
  try {
    const cands = await ytSearch(query);
    // 후보별 매칭 평가 → 가장 그럴듯한 1개 추천
    let best = null;
    for (let i = 0; i < cands.length; i++) {
      const c = cands[i];
      const tOk = titleMatches(s.title, c.title);
      const aOk = artistMatches(s.artist, c.title, c.channel);
      const flags = qualityFlags(c.title, c.channel);
      const score = (tOk ? 2 : 0) + (aOk ? 2 : 0) - flags.length;
      console.log(
        `   ${i + 1}. ${c.id}  "${c.title}" @ ${c.channel}` +
          `  {t:${tOk ? "✓" : "✗"} a:${aOk ? "✓" : "✗"}${flags.length ? " " + flags.join(",") : ""} score:${score}}`
      );
      if (!best || score > best.score) best = { ...c, score, tOk, aOk };
    }
    if (best) {
      proposals[s.youtubeID || `${s.mood}:${s.title}`] = {
        mood: s.mood,
        title: s.title,
        artist: s.artist,
        oldID: s.youtubeID,
        newID: best.id,
        newTitle: best.title,
        newChannel: best.channel,
        score: best.score,
      };
      console.log(`   => 추천: ${best.id}  "${best.title}" @ ${best.channel}`);
    }
  } catch (e) {
    console.log(`   !! 검색 실패: ${e.message}`);
  }
}

// ------------------------------------------------------------
// 요약: 교체 제안 (data.ts 반영용)
// ------------------------------------------------------------
console.log(`\n\n######## 교체 제안 요약 ########`);
for (const p of Object.values(proposals)) {
  const changed = p.oldID !== p.newID;
  console.log(
    `[${p.mood}] ${p.title} / ${p.artist}\n` +
      `   old: ${p.oldID || "(없음)"}\n` +
      `   new: ${p.newID}  "${p.newTitle}" @ ${p.newChannel}  ${changed ? "(변경)" : "(동일)"}`
  );
}

// JSON 으로도 저장
const outPath = path.join(__dirname, "rescrape_result.json");
fs.writeFileSync(outPath, JSON.stringify(Object.values(proposals), null, 2), "utf8");
console.log(`\n저장: ${path.relative(ROOT, outPath)}`);
