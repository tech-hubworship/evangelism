// =============================================================
// 전도 페이지 정적 데이터
//  - 마크업과 분리해 유지보수를 쉽게 하기 위한 데이터 레이어
//  - 복음 카드(사영리) 8단계 / 찬양 추천 / 온누리 캠퍼스 목록
// =============================================================

/** 복음 카드에 쓰는 심볼 (전도 소책자의 아이콘을 인라인 SVG로 표현) */
export type GospelSymbol =
  | "compass" // 도입: 두 갈래 화살표(시간/선택)
  | "heart" // 창조: 온전한 하트
  | "heart-broken" // 죄: 갈라진 하트
  | "cross-heart" // 사랑: 십자가 + 하트
  | "gift-double" // 구원: 두 개의 선물 + 십자가
  | "gift" // 평안과 영생: 하나의 선물
  | "door" // 초대: 문 열린 집
  | "heart-mending" // 기도: 다시 이어지는 하트
  | "heart-filled"; // 새로운 시작: 가득 찬 하트

/** 소책자에 인쇄된 말씀 (라벨 + 전문) */
export interface GospelVerse {
  /** 출처 라벨 (예: 창세기 1장 27절) */
  ref: string;
  /** 말씀 본문 */
  text: string;
}

/** 복음 카드 한 단계 */
export interface GospelStep {
  no: string;
  tag: string;
  /** 단계 심볼 (인라인 SVG로 렌더) */
  symbol: GospelSymbol;
  /** 제목(소책자의 큰 문장) */
  title: string;
  /** 본문 단락(여러 줄) */
  body: string[];
  /** 강조 라벨 (예: 결과 : 불안, 두려움 / 사망) */
  highlight?: string;
  /** 관련 말씀 (라벨 + 전문) */
  verses: GospelVerse[];
  /** 마지막 단계에서 노출할 선택적 링크 (해당 탭으로 이동) */
  link?: { label: string; tab: TabKey };
}

export const GOSPEL_STEPS: GospelStep[] = [
  {
    no: "01",
    tag: "질문",
    symbol: "compass",
    title: "당신은 언제 가장 행복하다고 생각하십니까?",
    body: ["그 행복한 시간이 영원하다고 생각하시나요?"],
    verses: [],
  },
  {
    no: "02",
    tag: "창조",
    symbol: "heart",
    title: "사람은 본래 하나님과 교제하며 행복하게 살도록 창조되었습니다.",
    body: [],
    verses: [
      {
        ref: "창세기 1장 27절",
        text: "하나님이 자기 형상 곧 하나님의 형상대로 사람을 창조하시되…",
      },
    ],
  },
  {
    no: "03",
    tag: "죄",
    symbol: "heart-broken",
    title:
      "그런데 사람이 하나님께 불순종하므로 죄를 지었고 하나님을 떠나게 되었습니다.",
    body: [],
    highlight: "결과 : 불안, 두려움 / 사망",
    verses: [
      {
        ref: "로마서 3장 23절",
        text: "모든 사람이 죄를 범하였으매 하나님의 영광에 이르지 못하더니",
      },
      {
        ref: "로마서 6장 23절",
        text: "죄의 삯은 사망이요…",
      },
    ],
  },
  {
    no: "04",
    tag: "사랑",
    symbol: "cross-heart",
    title:
      "하나님께서는 사람들의 이런 모습을 불쌍히 여기시고 예수 그리스도를 대속물로 이 땅에 보내셨습니다.",
    body: [],
    verses: [
      { ref: "요한일서 4장 8절", text: "하나님은 사랑이심이라" },
      {
        ref: "마가복음 10장 45절",
        text: "인자가 온 것은 섬김을 받으려 함이 아니라 도리어 섬기려 하고 자기 목숨을 많은 사람의 대속물로 주려 함이니라",
      },
    ],
  },
  {
    no: "05",
    tag: "구원",
    symbol: "gift-double",
    title:
      "예수님께서는 우리의 모든 죄 값을 치르기 위해 십자가에서 죽으시고 삼일 만에 부활하셨습니다.",
    body: ["그리고 우리에게 두 가지 선물을 주시기 원하십니다."],
    highlight: "선물 : 평안 / 영생",
    verses: [
      {
        ref: "요한복음 14장 27절",
        text: "평안을 너희에게 끼치노니 곧 나의 평안을 너희에게 주노라 내가 너희에게 주는 것은 세상이 주는 것과 같지 아니하니라 너희는 마음에 근심하지도 말고 두려워하지도 말라",
      },
      {
        ref: "요한복음 10장 10절",
        text: "내가 온 것은 양으로 생명을 얻게 하고 더 풍성히 얻게 하려는 것이라",
      },
    ],
  },
  {
    no: "06",
    tag: "평안과 영생",
    symbol: "gift",
    title: "당신은 참 평안과 영생을 받고 싶지 않으십니까?",
    body: [
      "하나님께서는 지금 이 시간 당신이 예수님을 영접하여 참 평안과 영생을 받기 원하십니다.",
    ],
    verses: [
      {
        ref: "요한복음 3장 16절",
        text: "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라",
      },
      {
        ref: "요한복음 1장 12절",
        text: "영접하는 자 곧 그 이름을 믿는 자들에게는 하나님의 자녀가 되는 권세를 주셨으니",
      },
    ],
  },
  {
    no: "07",
    tag: "초대",
    symbol: "door",
    title: "지금 예수님께서는 당신의 마음 문을 두드리고 계십니다.",
    body: [
      "이제 당신은 선택하셔야 합니다. 죄악 된 세상에서 불안과 두려움 가운데 살다가 죽은 이후에 지옥에서 영원히 고통을 당할 것인지, 아니면 예수님을 영접하여 참 평안과 영생을 얻을 것인지…",
      "당신은 예수님을 영접하시겠습니까?",
    ],
    verses: [
      {
        ref: "요한계시록 3장 20절",
        text: "볼지어다 내가 문 밖에 서서 두드리노니 누구든지 내 음성을 듣고 문을 열면 내가 그에게로 들어가 그와 더불어 먹고 그는 나와 더불어 먹으리라",
      },
    ],
  },
  {
    no: "08",
    tag: "기도",
    symbol: "heart-mending",
    title: "참으로 중요한 결정을 하셨습니다. 이렇게 기도해 주십시오.",
    body: [
      "하나님 아버지, 저는 죄인입니다. 저의 죄를 회개하오니 용서하여 주십시오. 예수님께서 저의 죄 때문에 십자가에서 죽으시고 부활하신 것을 믿습니다. 지금 이 시간 제 마음에 들어오셔서 저의 구원자와 주님이 되어 주십시오. 예수님의 이름으로 기도합니다.",
      "아멘.",
    ],
    verses: [],
  },
  {
    no: "09",
    tag: "새로운 시작",
    symbol: "heart-filled",
    title: "당신은 지금 예수님을 영접하여 하나님의 자녀가 되었습니다.",
    body: [
      "가까운 교회에 나가셔서 하나님의 말씀을 듣고 기도하며 하나님과 함께 행복한 삶을 누리십시오.",
    ],
    verses: [],
    link: { label: "가까운 온누리교회 찾아보기", tab: "church" },
  },
];

// -------------------------------------------------------------
// 히어로(썸네일) 말씀
//  - 일정 간격으로 돌아가며 노출되는 말씀 목록
//  - 여기에 { text, ref } 를 추가하면 자동으로 회전 목록에 포함됩니다.
// -------------------------------------------------------------

export interface HeroVerse {
  /** 말씀 본문 */
  text: string;
  /** 출처 (예: 요한복음 3:16) */
  ref: string;
}

/** 썸네일(히어로) 영역에서 돌아가며 보여줄 말씀. 자유롭게 추가/수정 가능. */
// text 안의 줄바꿈(\n)은 모바일에서 의미 단위로 끊어 보여주기 위한 것.
// (Hero 컴포넌트에서 white-space: pre-line 으로 렌더)
export const HERO_VERSES: HeroVerse[] = [
  {
    text: "수고하고 무거운 짐 진 자들아\n다 내게로 오라\n내가 너희를 쉬게 하리라",
    ref: "마태복음 11:28",
  },
  {
    text: "하나님께서 세상을 이처럼 사랑하셔서\n독생자를 주셨으니\n이는 그를 믿는 사람마다 멸망하지 않고\n영생을 얻게 하려는 것이다",
    ref: "요한복음 3:16",
  },
  {
    text: "예수께서 사람들에게 다시 말씀하셨습니다.\n나는 세상의 빛이다.\n누구든지 나를 따르는 사람은\n어둠 속에 다니지 않고\n생명의 빛을 얻을 것이다",
    ref: "요한복음 8:12",
  },
  {
    text: "이제 소망의 하나님께서\n여러분의 믿음 생활 가운데\n모든 기쁨과 평강을 충만하게 하셔서\n성령의 능력으로 소망이\n흘러넘치게 하시기를 빕니다",
    ref: "로마서 15:13",
  },
];

/** 히어로 말씀 전환 간격 (ms) */
export const HERO_VERSE_INTERVAL = 20_000;

// -------------------------------------------------------------
// 말씀 추천 (주제별)
//  - 지금 마음에 가까운 주제를 골라 말씀을 만나는 섹션
// -------------------------------------------------------------

export type ScriptureTopic =
  | "thanks"
  | "hope"
  | "guidance"
  | "trust"
  | "timing"
  | "love"
  | "life";

export interface ScriptureTopicMeta {
  key: ScriptureTopic;
  label: string;
}

export const SCRIPTURE_TOPICS: ScriptureTopicMeta[] = [
  { key: "thanks", label: "감사" },
  { key: "hope", label: "소망" },
  { key: "guidance", label: "인도" },
  { key: "trust", label: "신뢰" },
  { key: "timing", label: "하나님의 때" },
  { key: "love", label: "사랑" },
  { key: "life", label: "생명" },
];

export interface Scripture {
  topic: ScriptureTopic;
  /** 본문 줄 (줄 단위로 끊어 보여줌) */
  lines: string[];
  /** 출처 (예: 시편 107:1–3) */
  ref: string;
}

export const SCRIPTURES: Scripture[] = [
  {
    topic: "thanks",
    lines: [
      "여호와께 감사하라 그는 선하시며",
      "그 인자하심이 영원함이로다",
      "여호와의 속량을 받은 자들은 이같이 말할지어다",
      "여호와께서 대적의 손에서 그들을 속량하사",
      "동서 남북 각 지방에서부터 모으셨도다",
    ],
    ref: "시편 107:1–3",
  },
  {
    topic: "hope",
    lines: [
      "여호와여 나의 종말과 연한이 언제까지인지 알게 하사",
      "내가 나의 연약함을 알게 하소서 …",
      "사람은 그가 든든히 서 있는 때에도",
      "진실로 모두가 허사뿐이니이다",
      "주여 이제 내가 무엇을 바라리요",
      "나의 소망은 주께 있나이다",
    ],
    ref: "시편 39:4–5, 7",
  },
  {
    topic: "guidance",
    lines: [
      "그가 자기 백성을 양 같이 인도하여 내시고",
      "광야에서 양 떼 같이 지도하셨도다",
      "그들을 안전히 인도하시니 그들은 두려움이 없었으나",
      "그들의 원수는 바다에 빠졌도다",
    ],
    ref: "시편 78:52–53",
  },
  {
    topic: "guidance",
    lines: [
      "여호와는 나의 목자시니 내게 부족함이 없으리로다",
      "그가 나를 푸른 풀밭에 누이시며",
      "쉴 만한 물가로 인도하시는도다",
    ],
    ref: "시편 23:1–2",
  },
  {
    topic: "trust",
    lines: [
      "그러므로 우리가 담대히 말하되",
      "주는 나를 돕는 이시니 내가 무서워하지 아니하겠노라",
      "사람이 내게 어찌하리요 하노라",
      "예수 그리스도는 어제나 오늘이나",
      "영원토록 동일하시니라",
    ],
    ref: "히브리서 13:6, 8",
  },
  {
    topic: "timing",
    lines: [
      "하나님이 모든 것을 지으시되 때를 따라 아름답게 하셨고",
      "또 사람들에게는 영원을 사모하는 마음을 주셨느니라",
      "… 사람으로 측량할 수 없게 하셨도다",
    ],
    ref: "전도서 3:11",
  },
  {
    topic: "love",
    lines: [
      "나의 사랑하는 자가 내게 말하여 이르기를",
      "나의 사랑, 내 어여쁜 자야 일어나서 함께 가자",
    ],
    ref: "아가 2:10",
  },
  {
    topic: "love",
    lines: [
      "나는 선한 목자라 나는 내 양을 알고 양도 나를 아는 것이",
      "아버지께서 나를 아시고 내가 아버지를 아는 것 같으니",
      "나는 양을 위하여 목숨을 버리노라",
    ],
    ref: "요한복음 10:14–15",
  },
  {
    topic: "love",
    lines: [
      "그러므로 사랑을 받는 자녀같이 너희는 하나님을 본받는 자가",
      "되고 그리스도께서 너희를 사랑하신 것같이 너희도 사랑 가운데서",
      "행하라 그는 우리를 위하여 자신을 버리사…",
    ],
    ref: "에베소서 5:1–2",
  },
  {
    topic: "life",
    lines: [
      "만물이 그로 말미암아 지은 바 되었으니 지은 것이 하나도",
      "그가 없이는 된 것이 없느니라 그 안에 생명이 있었으니",
      "이 생명은 사람들의 빛이라",
    ],
    ref: "요한복음 1:3–4",
  },
];

// -------------------------------------------------------------
// 찬양 추천
// -------------------------------------------------------------

export type SongMood = "comfort" | "strength" | "curious" | "love";

export interface SongMoodMeta {
  key: SongMood;
  label: string;
}

export const SONG_MOODS: SongMoodMeta[] = [
  { key: "comfort", label: "위로가 필요할 때" },
  { key: "strength", label: "힘이 필요할 때" },
  { key: "curious", label: "하나님이 궁금할 때" },
  { key: "love", label: "하나님의 사랑" },
];

/** 무드별 플레이어 테마 (그라데이션 + 포인트 색) */
export const SONG_THEMES: Record<
  SongMood,
  { gradient: string; accent: string; emoji: string }
> = {
  comfort: {
    gradient: "linear-gradient(135deg, #2f5d53 0%, #4b7e6d 60%, #7fa98f 100%)",
    accent: "#dff0e4",
    emoji: "🌿",
  },
  strength: {
    gradient: "linear-gradient(135deg, #7a3b1d 0%, #c2662f 55%, #e59b5b 100%)",
    accent: "#ffe8d2",
    emoji: "🔥",
  },
  curious: {
    gradient: "linear-gradient(135deg, #2b3a67 0%, #3f5aa6 55%, #7f9bd6 100%)",
    accent: "#e2ebff",
    emoji: "✨",
  },
  love: {
    gradient: "linear-gradient(135deg, #7a2d4a 0%, #c0547d 55%, #f0a3bf 100%)",
    accent: "#ffe3ee",
    emoji: "💛",
  },
};

export interface Song {
  title: string;
  artist: string;
  /** 유튜브 영상 ID. 있으면 플레이어에서 바로 임베드 재생, 없으면 검색 링크로 폴백 */
  youtubeID?: string;
}

export const SONGS: Record<SongMood, Song[]> = {
  comfort: [
    { title: "Love Letter", artist: "제이어스", youtubeID: "ZQppjVXpbbA" },
    { title: "하나님의 열심", artist: "러빔", youtubeID: "QkHKe6bPPE0" },
    { title: "나 주님을 모른다 하여도", artist: "팀룩", youtubeID: "VeuP0yejeYM" },
    { title: "사랑한다 말하시네", artist: "기프티드", youtubeID: "A_SEQKpeHVw" },
    { title: "누군가 널 위해 기도하네", artist: "Gina", youtubeID: "W3KElVsukPU" },
    { title: "샬롬", artist: "김상진", youtubeID: "jU9N7Skw_b4" },
    { title: "나의 안에 거하라", artist: "김상진", youtubeID: "oIgpHu4B6bk" },
    { title: "평안을 너에게 주노라", artist: "지나", youtubeID: "0hUOwMlq940" },
    { title: "무너짐 가운데서", artist: "WELOVE", youtubeID: "BEXi88t6Nao" },
    { title: "함께 계셨네", artist: "웨이홈", youtubeID: "p4HJckWAHBY" },
    { title: "하나님은 너를 지키시는 자", artist: "웨이홈", youtubeID: "wYkhLEAqhBs" },
    { title: "내 이름 아시죠", artist: "J-US", youtubeID: "7w3dvCQ3m1I" },
    { title: "주의 자녀로 산다는 것은", artist: "Gifted", youtubeID: "TKSS0P4H2zQ" },
    { title: "성령이 오셨네", artist: "김도현", youtubeID: "cSeoTN9ztRk" },
    { title: "주님 마음 내게 주소서", artist: "마커스", youtubeID: "TcogMm4emKQ" }
  ],
  "strength": [
    { title: "어둔 날 다 지나고", artist: "위러브", youtubeID: "EqDL2-OW1Z4" },
    { title: "주를 찾는 모든 자들이", artist: "팀룩워십", youtubeID: "Fi2waeWY18g" },
    { title: "너는 꽃이야", artist: "Hisplan", youtubeID: "QNuN6618rS4" },
    { title: "주의 음성을 내가 들으니", artist: "제이어스", youtubeID: "_YrZ6l_LZHI" },
    { title: "예수 날 위해 이 땅에 오신 주", artist: "어노인팅", youtubeID: "5N4uCeJ8-ws" },
    { title: "새 힘 얻으리", artist: "Hisplan", youtubeID: "bU_ShwpQzaQ" },
    { title: "주가 지으신 이 날에", artist: "어노인팅", youtubeID: "FkpbYaNiU8Y" },
    { title: "We Praise You", artist: "Bethel Music & Brandon Lake", youtubeID: "vVVXeKCg9w4" },
    { title: "Washed", artist: "Elevation Rhythm", youtubeID: "JjgkhHlTROQ" },
    { title: "Goodbye Yesterday", artist: "Elevation Rhythm", youtubeID: "qOD9M95_fS0" },
    { title: "내힘이 되신", artist: "Histigma", youtubeID: "EX03xrCwkyk" },
    { title: "Need You, Lord!", artist: "Hisplan", youtubeID: "kaaKrquxAN0" },
    { title: "두려움 떠나네", artist: "아갓유", youtubeID: "OMLkqmilEgo" },
    { title: "I Thank God", artist: "Maverick City Music & UPPERROOM", youtubeID: "LM1qrx0Huds" },
    { title: "Here Again", artist: "Elevation Worship", youtubeID: "zfLcdBuB7NY" },
    { title: "Confidence", artist: "Sanctus Real", youtubeID: "KA9kSBv1QrI" },
    { title: "전신갑주", artist: "아이자야식스티원", youtubeID: "17Qykmf8oS4" },
    { title: "불을 내려주소서", artist: "천관웅", youtubeID: "V3B3ZtPeP28" },
    { title: "태산을 넘어 험곡에 가도", artist: "아이자야식스티원", youtubeID: "rXAzWsvjgNQ" }
  ],
  "curious": [
    { title: "하나님의 세계", artist: "예람워십", youtubeID: "AMMSKHJC8OU" },
    { title: "지극히 높으신 주", artist: "예람워십", youtubeID: "WHuCSCApXrQ" },
    { title: "나의 하나님", artist: "예람워십", youtubeID: "YnyY7dsWPg0" },
    { title: "예수 우리들의 밝은 빛", artist: "어노인팅", youtubeID: "bBsVACE3tkQ" },
    { title: "그가 오신 이유", artist: "심종호", youtubeID: "6MCaECq6Czg" },
    { title: "The Blessing", artist: "아가파오", youtubeID: "mDK9ZrhJA34" },
    { title: "창조의 아버지", artist: "위클래시아", youtubeID: "sPvC2YPLu8w" },
    { title: "Way Maker", artist: "아가파오", youtubeID: "VxRZDqbDoMk" },
    { title: "위대하신 주", artist: "제이어스", youtubeID: "2RP43Zor38g" },
    { title: "목마른 사슴이", artist: "어노이팅", youtubeID: "ele4YXY84lY" }
  ],
  "love": [
    { title: "하나님의 사랑이", artist: "WELOVE", youtubeID: "fV69rb_MO3o" },
    { title: "내 모습 이대로", artist: "J-US", youtubeID: "FV5nMb93UwY" },
    { title: "사랑은 여전히 사랑이어서", artist: "한웅재", youtubeID: "-p8O4ENLc0I" },
    { title: "예수 사랑하심은", artist: "아이자야식스티원", youtubeID: "A_drAemgpYc" },
    { title: "하나님께서 세상을 사랑하사", artist: "어노인팅", youtubeID: "-n24d45myCg" },
    { title: "그 크신 하나님의 사랑", artist: "제이어스", youtubeID: "sENQ-cJK4AQ" },
    { title: "진리", artist: "어노인팅", youtubeID: "602e5ZZokl0" },
    { title: "Washed", artist: "Elevation Rhythm", youtubeID: "JjgkhHlTROQ" },
    { title: "주님의 선하심", artist: "기프티드", youtubeID: "ErqijpGQmO4" },
    { title: "사랑중에 사랑", artist: "WELOVE", youtubeID: "GDoarJJezi0" },
    { title: "은혜", artist: "손경민", youtubeID: "pZuW2CV0mXY" },
    { title: "소원", artist: "한웅재", youtubeID: "-B3w7mjRK6I" }
  ]
}

/** 찬양 제목+아티스트로 유튜브 검색 URL 생성 */
export function songSearchUrl(song: Song): string {
  const query = encodeURIComponent(`${song.title} ${song.artist} 찬양`);
  return `https://www.youtube.com/results?search_query=${query}`;
}

/**
 * 유튜브에서 열 URL.
 * youtubeID가 있으면 해당 영상으로 바로, 없으면 검색 결과로 이동.
 */
export function songYoutubeUrl(song: Song): string {
  if (song.youtubeID) {
    return `https://www.youtube.com/watch?v=${song.youtubeID}`;
  }
  return songSearchUrl(song);
}

// -------------------------------------------------------------
// CGN 영상
// -------------------------------------------------------------

export interface CgnPlaylist {
  title: string;
  desc: string;
  href: string;
  /** 카드 배경 그라데이션 */
  gradient: string;
  /** 카드 상단 이모지/심볼 */
  emoji: string;
  /** 짧은 라벨(장르 배지) */
  tag: string;
}

export const CGN_CHANNEL_URL = "https://www.youtube.com/@cgn";

export const CGN_PLAYLISTS: CgnPlaylist[] = [
  {
    title: "찬양과 기독교 문화",
    desc: "마음을 울리는 찬양과 문화 콘텐츠",
    href: "https://www.youtube.com/playlist?list=PLSvEGrDFKwMk",
    gradient: "linear-gradient(145deg, #2f5d53 0%, #4b7e6d 70%, #7fa98f 100%)",
    emoji: "🎵",
    tag: "WORSHIP",
  },
  {
    title: "다큐멘터리",
    desc: "삶과 선교 현장의 진짜 이야기",
    href: "https://www.youtube.com/playlist?list=PLjj_uvKdTemB6oFOx2kgR1l26j22ZuvIC",
    gradient: "linear-gradient(145deg, #2b3a67 0%, #3f5aa6 70%, #7f9bd6 100%)",
    emoji: "🎬",
    tag: "DOCU",
  },
  {
    title: "성경 이야기",
    desc: "쉽게 풀어보는 성경 속 이야기",
    href: "https://www.youtube.com/playlist?list=PLjj_uvKdTemAdrgZOpESpm0FV0a_KnFd3",
    gradient: "linear-gradient(145deg, #7a3b1d 0%, #c2662f 70%, #e59b5b 100%)",
    emoji: "📖",
    tag: "BIBLE",
  },
  {
    title: "인기 콘텐츠",
    desc: "지금 가장 많이 보는 CGN 영상",
    href: "https://www.youtube.com/playlist?list=PLjj_uvKdTemCzs1xbPidEK96UyWQkAbry",
    gradient: "linear-gradient(145deg, #7a2d4a 0%, #c0547d 70%, #f0a3bf 100%)",
    emoji: "🔥",
    tag: "HOT",
  },
];

// -------------------------------------------------------------
// 온누리교회 캠퍼스
// -------------------------------------------------------------

export interface Campus {
  name: string;
  address: string;
  href: string;
}

export interface CampusRegion {
  region: string;
  campuses: Campus[];
}

export const CAMPUS_REGIONS: CampusRegion[] = [
  {
    region: "서울",
    campuses: [
      {
        name: "양재온누리교회",
        address: "서울 서초구 바우뫼로31길 70 횃불선교회관",
        href: "https://www.onnuri.org/about-onnuri/service-times/yangjae-campus/",
      },
      {
        name: "서빙고 온누리교회",
        address: "서울 용산구 이촌로 347-11 온누리교회",
        href: "https://www.onnuri.org/about-onnuri/service-times/seobinggo-campus/",
      },
      {
        name: "강동 온누리교회",
        address: "서울시 강동구 천호대로 157길 14 나비쇼핑몰 10, 11, 12층",
        href: "https://gd.onnuri.or.kr/pages/worship-information",
      },
    ],
  },
  {
    region: "경기·인천",
    campuses: [
      {
        name: "부천 온누리교회",
        address: "경기도 부천시 원미구 평천로 589(상동)",
        href: "https://bc.onnuri.or.kr/pages/worship-information",
      },
      {
        name: "수원 온누리교회",
        address:
          "경기도 용인시 처인구 명지로 116 명지대학교 자연캠퍼스 60주년 채플관",
        href: "https://sw.onnuri.or.kr/pages/worship",
      },
      {
        name: "남양주 온누리교회",
        address: "경기도 남양주시 경춘로476번길 16 JS 프라자 3층",
        href: "https://nyj.onnuri.or.kr/pages/serviceinform",
      },
      {
        name: "평택 온누리교회",
        address: "경기도 평택시 신흥 1로 2길 61, 2층",
        href: "https://kptonnuri.clickn.co.kr/pages/worship-list",
      },
      {
        name: "인천 온누리교회",
        address: "인천광역시 연수구 송도교육로75 (송도동 194-4)",
        href: "https://icn.onnuri.or.kr/pages/worship-information",
      },
      {
        name: "영종 온누리교회",
        address: "인천광역시 중구 운남로49",
        href: "https://iyj.onnuri.or.kr/pages/worship-information",
      },
      {
        name: "용인 온누리교회",
        address: "경기도 용인시 처인구 양지면 추계리 239번지 비전빌리지",
        href: "https://yi.onnuri.or.kr/pages/worship-information",
      },
    ],
  },
  {
    region: "그 외 지역",
    campuses: [
      {
        name: "대전 온누리교회",
        address: "대전광역시 서구 둔산로 64 온누리빌딩 3~6층",
        href: "https://dj.onnuri.or.kr/pages/worship",
      },
      {
        name: "제주 온누리교회",
        address: "제주특별자치도 서귀포시 안덕면 신화역사로 601",
        href: "https://jeju.onnuri.or.kr/pages/worship",
      },
      {
        name: "서산 온누리교회",
        address: "충남 서산시 안견로 213 서산온누리교회",
        href: "https://ss.onnuri.or.kr/pages/worship-information",
      },
    ],
  },
];

export const ONNURI_MAP_SEARCH_URL =
  "https://www.google.com/maps/search/?api=1&query=온누리교회";

/** 지역 라벨이 붙은 평탄화된 캠퍼스 목록 (플레이어식 큐 렌더용) */
export interface FlatCampus extends Campus {
  region: string;
}

export const FLAT_CAMPUSES: FlatCampus[] = CAMPUS_REGIONS.flatMap((r) =>
  r.campuses.map((c) => ({ ...c, region: r.region }))
);

/** 주소로 구글맵 임베드 URL 생성 (좌표 없이 위치 핀 표시) */
export function campusMapEmbedUrl(campus: Campus): string {
  const q = encodeURIComponent(`${campus.name} ${campus.address}`);
  return `https://www.google.com/maps?q=${q}&output=embed`;
}

/** 주소로 구글맵 길찾기/검색 새 탭 URL */
export function campusMapLinkUrl(campus: Campus): string {
  const q = encodeURIComponent(`${campus.name} ${campus.address}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

/**
 * 네이버 지도 검색 새 탭 URL (한국 사용자 길찾기용).
 * 교회명만으로 검색해야 네이버가 장소를 제대로 찾는다.
 * (교회명+전체주소를 함께 넣으면 쿼리가 너무 구체적이라 "조건에 맞는 업체 없음"이 뜸)
 */
export function campusNaverMapUrl(campus: Campus): string {
  const q = encodeURIComponent(campus.name);
  return `https://map.naver.com/p/search/${q}`;
}

// -------------------------------------------------------------
// 탭 구성
//  - 한 페이지 스크롤 대신 Hero 아래 탭바로 섹션을 전환한다.
//  - 탭 key 는 URL 쿼리(?tab=)와 동기화된다.
// -------------------------------------------------------------

export type TabKey =
  | "explore"
  | "why"
  | "gospel"
  | "scripture"
  | "qna"
  | "songs"
  | "cgn"
  | "church"
  | "hurray";

export interface TabMeta {
  key: TabKey;
  label: string;
}

export const TABS: TabMeta[] = [
  { key: "explore", label: "둘러보기" },
  { key: "why", label: "우리가 전도하는 이유" },
  { key: "gospel", label: "복음 이야기" },
  { key: "scripture", label: "말씀 추천" },
  { key: "songs", label: "찬양 추천" },
  { key: "cgn", label: "CGN 영상" },
  { key: "church", label: "교회 찾기" },
  { key: "hurray", label: "허뤠이 소개" },
  { key: "qna", label: "질문하기" },
];

export const DEFAULT_TAB: TabKey = "explore";

export function isTabKey(value: string | null | undefined): value is TabKey {
  return !!value && TABS.some((t) => t.key === value);
}

/** 둘러보기 탭의 주제 카드 — 클릭 시 해당 탭으로 이동 */
export interface ExploreItem {
  tab: TabKey;
  icon: string;
  title: string;
  desc: string;
}

export const EXPLORE_ITEMS: ExploreItem[] = [
  {
    tab: "why",
    icon: "💛",
    title: "우리가 전도하는 이유",
    desc: "우리가 전하고 싶은 사랑과 복음의 이야기",
  },
  {
    tab: "gospel",
    icon: "✝️",
    title: "복음에 대해 들어보실래요?",
    desc: "참된 행복과 평안, 영생에 관한 이야기",
  },
  {
    tab: "scripture",
    icon: "📖",
    title: "말씀 추천",
    desc: "지금 마음에 가까운 주제를 골라 말씀 만나기",
  },
  {
    tab: "songs",
    icon: "🎧",
    title: "찬양 추천",
    desc: "지금 내 마음에 어울리는 찬양 듣기",
  },
  {
    tab: "cgn",
    icon: "🎬",
    title: "CGN 영상",
    desc: "말씀과 간증, 다양한 기독교 콘텐츠",
  },
  {
    tab: "church",
    icon: "📍",
    title: "가까운 온누리교회 찾아보기",
    desc: "가까운 캠퍼스 위치와 예배 안내 확인",
  },
  {
    tab: "qna",
    icon: "💬",
    title: "질문과 답변",
    desc: "하나님·신앙·교회에 관해 편하게 물어보세요",
  },
];
