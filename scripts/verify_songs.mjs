// 각 곡 youtubeID가 실제로 어떤 영상인지 oEmbed로 조회해 제목/채널을 출력.
// 데이터상 제목·아티스트와 비교해 불일치 의심 곡을 찾는다.

const SONGS = {
  comfort: [
    ["Love Letter", "제이어스", "ZQppjVXpbbA"],
    ["하나님의 열심", "러빔", "QkHKe6bPPE0"],
    ["나 주님을 모른다 하여도", "팀룩", "VeuP0yejeYM"],
    ["사랑한다 말하시네", "기프티드", "A_SEQKpeHVw"],
    ["누군가 널 위해 기도하네", "Gina", "W3KElVsukPU"],
    ["샬롬", "김상진", "jU9N7Skw_b4"],
    ["나의 안에 거하라", "김상진", "oIgpHu4B6bk"],
    ["평안을 너에게 주노라", "지나", "0hUOwMlq940"],
    ["무너짐 가운데서", "WELOVE", "BEXi88t6Nao"],
    ["함께 계셨네", "웨이홈", "p4HJckWAHBY"],
    ["하나님은 너를 지키시는 자", "Wayhome", "wYkhLEAqhBs"],
    ["내 이름 아시죠", "J-US", "7w3dvCQ3m1I"],
    ["주의 자녀로 산다는 것은", "Gifted", "TKSS0P4H2zQ"],
    ["성령이 오셨네", "김도현", "cSeoTN9ztRk"],
    ["주님 마음 내게 주소서", "마커스", "TcogMm4emKQ"],
  ],
  strength: [
    ["어둔 날 다 지나고", "위러브", "EqDL2-OW1Z4"],
    ["주를 찾는 모든 자들이", "팀룩워십", "Fi2waeWY18g"],
    ["너는 꽃이야", "Hisplan", "QNuN6618rS4"],
    ["주의 음성을 내가 들으니", "제이어스", "_YrZ6l_LZHI"],
    ["예수 날 위해 이 땅에 오신 주", "어노인팅", "5N4uCeJ8-ws"],
    ["새 힘 얻으리", "Hisplan", "bU_ShwpQzaQ"],
    ["주가 지으신 이 날에", "어노인팅", "FkpbYaNiU8Y"],
    ["We Praise You", "Bethel Music & Brandon Lake", "vVVXeKCg9w4"],
    ["Washed", "Elevation Rhythm", "JjgkhHlTROQ"],
    ["Goodbye Yesterday", "Elevation Worship", "qOD9M95_fS0"],
    ["내힘이 되신", "Histigma", "EX03xrCwkyk"],
    ["Need You, Lord!", "Hisplan", "kaaKrquxAN0"],
    ["두려움 떠나네", "아갓유", "OMLkqmilEgo"],
    ["I Thank God", "Elevation Worship", "LM1qrx0Huds"],
    ["Here Again", "Elevation Worship", "zfLcdBuB7NY"],
    ["Confidence", "Sanctus Real", "KA9kSBv1QrI"],
    ["전신갑주", "아이자야식스티원", "17Qykmf8oS4"],
    ["불을 내려주소서", "천관웅", "DO1LCn6mRXE"],
    ["태산을 넘어 험곡에 가도", "아이자야식스티원", "xZVKbIrOqhI"],
  ],
  curious: [
    ["하나님의 세계", "예람워십", "AMMSKHJC8OU"],
    ["지극히 높으신 주", "예람워십", "WHuCSCApXrQ"],
    ["나의 하나님", "예람워십", "YnyY7dsWPg0"],
    ["예수 우리들의 밝은 빛", "어노인팅", "bBsVACE3tkQ"],
    ["그가 오신 이유", "심종호", "6MCaECq6Czg"],
    ["The Blessing", "아가파오", "mDK9ZrhJA34"],
    ["창조의 아버지", "위클래시아", "sPvC2YPLu8w"],
    ["Way Maker", "아가파오", "VxRZDqbDoMk"],
    ["위대하신 주", "제이어스", "2RP43Zor38g"],
    ["목마른 사슴이", "어노이팅", "ele4YXY84lY"],
  ],
  love: [
    ["하나님의 사랑이", "WELOVE", "fV69rb_MO3o"],
    ["내 모습 이대로", "J-US", "FV5nMb93UwY"],
    ["사랑은 여전히 사랑이어서", "한웅재", "-p8O4ENLc0I"],
    ["예수 사랑하심은", "아이자야식스티원", "A_drAemgpYc"],
    ["하나님께서 세상을 사랑하사", "어노인팅", "-n24d45myCg"],
    ["그 크신 하나님의 사랑", "제이어스", "TKWMHZSSt-w"],
    ["진리", "어노인팅", "602e5ZZokl0"],
    ["Washed", "Elevation Rhythm", "JjgkhHlTROQ"],
    ["주님의 선하심", "기프티드", "f0PASE89D6E"],
    ["사랑중에 사랑", "WELOVE", "GDoarJJezi0"],
    ["은혜", "손경민", "pZuW2CV0mXY"],
    ["소원", "한웅재", "-B3w7mjRK6I"],
  ],
};

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

for (const [mood, list] of Object.entries(SONGS)) {
  console.log(`\n===== ${mood} =====`);
  for (const [title, artist, id] of list) {
    const res = await oembed(id);
    if (res.error) {
      console.log(`[!] ${title} / ${artist} (${id})  -> ERROR ${res.error}`);
    } else {
      console.log(`- ${title} / ${artist} (${id})`);
      console.log(`    video: "${res.title}"  @ ${res.author}`);
    }
  }
}
