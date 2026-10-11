// 2026-10-09 22:22 KST
// 문항 데이터. 형식과 작성 규칙은 PRD.md 4장을 따른다.
// 출처는 모두 기관 자료이며 2026-10-10~12에 페이지를 열어 확인했다. 검수표는 QUESTION-REVIEW.md에 있다.
const QUESTIONS = [
  // ----- 한국사 -----
  {
    id: "korean-history-01",
    category: "한국사",
    question: "1443년 훈민정음을 창제한 조선의 왕은?",
    choices: ["세종", "태종", "세조", "정조"],
    answer: 0,
    explanation: "세종은 1443년(세종 25) 겨울에 훈민정음을 창제했다.",
    source: { name: "한국민족문화대백과사전 「훈민정음」", url: "https://encykorea.aks.ac.kr/Article/E0065805" }
  },
  {
    id: "korean-history-02",
    category: "한국사",
    question: "1592년 7월 한산섬 앞바다에서 일본 수군 주력을 무찌른 해전에서 조선 수군을 이끈 전라좌수사는?",
    choices: ["이순신", "권율", "김시민", "곽재우"],
    answer: 0,
    explanation: "한산도대첩은 전라좌수사 이순신 등이 이끈 조선 수군이 거둔 승리다.",
    source: { name: "한국민족문화대백과사전 「한산도대첩」", url: "https://encykorea.aks.ac.kr/Article/E0061676" }
  },
  {
    id: "korean-history-03",
    category: "한국사",
    question: "676년 기벌포에서 당나라 해군을 크게 깨뜨린 나라는?",
    choices: ["신라", "백제", "고구려", "가야"],
    answer: 0,
    explanation: "676년 신라 해군이 금강 하구 기벌포에서 당나라 해군을 크게 깨뜨렸다.",
    source: { name: "한국민족문화대백과사전 「기벌포전투」", url: "https://encykorea.aks.ac.kr/Article/E0008239" }
  },
  {
    id: "korean-history-04",
    category: "한국사",
    question: "1392년 7월 공양왕을 내쫓고 새 왕조 조선의 태조로 즉위한 인물은?",
    choices: ["이성계", "정도전", "이방원", "최영"],
    answer: 0,
    explanation: "이성계는 1392년 7월 공양왕을 내쫓고 새 왕조의 태조로 즉위했다.",
    source: { name: "한국민족문화대백과사전 「태조」", url: "https://encykorea.aks.ac.kr/Article/E0059033" }
  },
  {
    id: "korean-history-05",
    category: "한국사",
    question: "3·1운동이 일어난 해는?",
    choices: ["1919년", "1910년", "1926년", "1945년"],
    answer: 0,
    explanation: "3·1운동은 1919년 3월 1일을 기해 일어난 거족적인 독립만세운동이다.",
    source: { name: "한국민족문화대백과사전 「3·1운동」", url: "https://encykorea.aks.ac.kr/Article/E0026772" }
  },
  {
    id: "korean-history-06",
    category: "한국사",
    question: "1866년 흥선대원군의 천주교 탄압에 대한 보복으로 프랑스군이 강화도에 침입한 사건은?",
    choices: ["병인양요", "신미양요", "운요호 사건", "임오군란"],
    answer: 0,
    explanation: "병인양요는 1866년 프랑스군이 천주교 탄압의 보복으로 강화도에 침입한 사건이다.",
    source: { name: "한국민족문화대백과사전 「병인양요」", url: "https://encykorea.aks.ac.kr/Article/E0023142" }
  },
  {
    id: "korean-history-07",
    category: "한국사",
    question: "1894년 전라도 고부의 동학접주 전봉준 등을 지도자로 동학교도와 농민들이 일으킨 운동은?",
    choices: ["동학농민운동", "갑신정변", "임오군란", "홍경래의 난"],
    answer: 0,
    explanation: "동학농민운동은 1894년 전봉준 등을 지도자로 동학교도와 농민이 함께 일으켰다.",
    source: { name: "한국민족문화대백과사전 「동학운동」", url: "https://encykorea.aks.ac.kr/Article/E0016865" }
  },
  {
    id: "korean-history-08",
    category: "한국사",
    question: "『삼국유사』에 기록된 건국 이야기에서 고조선을 세운 인물은?",
    choices: ["단군왕검", "주몽", "온조", "박혁거세"],
    answer: 0,
    explanation: "단군에 관한 최초의 기록은 『삼국유사』이며, 단군이 고조선을 세웠다고 전한다.",
    source: { name: "한국민족문화대백과사전 「단군」", url: "https://encykorea.aks.ac.kr/Article/E0013538" }
  },
  {
    id: "korean-history-09",
    category: "한국사",
    question: "서기전 18년부터 재위한 백제의 제1대 왕은?",
    choices: ["온조왕", "동명왕", "박혁거세", "김수로왕"],
    answer: 0,
    explanation: "온조왕은 백제의 제1대 왕으로 서기전 18년부터 서기 28년까지 재위했다.",
    source: { name: "한국민족문화대백과사전 「온조왕」", url: "https://encykorea.aks.ac.kr/Article/E0038871" }
  },
  {
    id: "korean-history-10",
    category: "한국사",
    question: "1794년 정월에 착공해 1796년에 완성된 수원 화성을 쌓게 한 조선의 왕은?",
    choices: ["정조", "영조", "숙종", "순조"],
    answer: 0,
    explanation: "수원 화성은 정조 때 1794년 정월에 착공해 1796년에 완성되었다.",
    source: { name: "한국민족문화대백과사전 「수원 화성」", url: "https://encykorea.aks.ac.kr/Article/E0064671" }
  },

  // ----- 세계지리 -----
  {
    id: "world-geography-01",
    category: "세계지리",
    question: "칠레의 수도는?",
    choices: ["산티아고", "발파라이소", "리마", "부에노스아이레스"],
    answer: 0,
    explanation: "칠레공화국의 수도는 산티아고이다.",
    source: { name: "외교부 국가 정보 「칠레」", url: "https://www.mofa.go.kr/www/nation/m_3458/view.do?seq=69" }
  },
  {
    id: "world-geography-02",
    category: "세계지리",
    question: "국토 면적이 약 1,709만㎢로 한반도의 약 78배인 나라는?",
    choices: ["러시아", "캐나다", "중국", "미국"],
    answer: 0,
    explanation: "러시아 연방의 면적은 1,709만㎢로 한반도의 78배, 미국의 1.8배이다.",
    source: { name: "외교부 국가 정보 「러시아」", url: "https://www.mofa.go.kr/www/nation/m_3458/view.do?seq=84" }
  },
  {
    id: "world-geography-03",
    category: "세계지리",
    question: "2026년 현재 해발 고도(해수면으로부터의 높이) 기준으로 지구에서 가장 높은 산은?",
    choices: ["에베레스트산", "K2", "칸첸중가", "킬리만자로산"],
    answer: 0,
    explanation: "에베레스트산은 정상이 해발 8,848m로 지구에서 가장 높은 산이다.",
    source: { name: "NASA Earth Observatory 「North Col of Mount Everest」", url: "https://science.nasa.gov/earth/earth-observatory/north-col-of-mount-everest-48603/" }
  },
  {
    id: "world-geography-04",
    category: "세계지리",
    question: "1914년 8월 15일 개통되어 대서양과 태평양 사이를 잇는 운하는?",
    choices: ["파나마 운하", "수에즈 운하", "킬 운하", "코린트 운하"],
    answer: 0,
    explanation: "파나마 운하는 대서양과 태평양 사이에 있으며 1914년 8월 15일 개통했다.",
    source: { name: "파나마 운하청 「Trade Routes」", url: "https://pancanal.com/en/maritime-services/trade-routes/" }
  },
  {
    id: "world-geography-05",
    category: "세계지리",
    question: "브라질의 공용어는?",
    choices: ["포르투갈어", "스페인어", "영어", "프랑스어"],
    answer: 0,
    explanation: "브라질의 언어는 포르투갈어이며, 수도는 브라질리아이다.",
    source: { name: "외교부 국가 정보 「브라질」", url: "https://www.mofa.go.kr/www/nation/m_3458/view.do?seq=56" }
  },
  {
    id: "world-geography-06",
    category: "세계지리",
    question: "사하라 사막이 있는 대륙은?",
    choices: ["아프리카", "아시아", "남아메리카", "오세아니아"],
    answer: 0,
    explanation: "사하라 사막은 아프리카 북부에 펼쳐진 거대한 사막이다.",
    source: { name: "NASA Earth Observatory 「Dust Plumes Off North Africa Coast」", url: "https://science.nasa.gov/earth/earth-observatory/dust-plumes-off-north-africa-coast-14215" }
  },
  {
    id: "world-geography-07",
    category: "세계지리",
    question: "아이슬란드의 수도는?",
    choices: ["레이캬비크", "오슬로", "헬싱키", "코펜하겐"],
    answer: 0,
    explanation: "외교부 국가 정보에 따르면 아이슬란드의 수도는 레이캬비크이다.",
    source: { name: "외교부 국가 정보 「아이슬란드」", url: "https://www.mofa.go.kr/www/nation/m_3458/view.do?seq=108" }
  },
  {
    id: "world-geography-08",
    category: "세계지리",
    question: "이집트를 지나는 나일강이 흘러드는 바다는?",
    choices: ["지중해", "홍해", "아라비아해", "흑해"],
    answer: 0,
    explanation: "나일강은 이집트 북부를 지나 지중해로 흘러든다.",
    source: { name: "NASA 「The Nile River is pictured flowing toward the Mediterranean Sea」", url: "https://www.nasa.gov/image-article/nile-river-pictured-flowing-toward-mediterranean-sea/" }
  },
  {
    id: "world-geography-09",
    category: "세계지리",
    question: "남아메리카에서 칠레, 아르헨티나, 볼리비아 사이의 자연 경계를 이루는 산맥은?",
    choices: ["안데스산맥", "알프스산맥", "로키산맥", "우랄산맥"],
    answer: 0,
    explanation: "안데스산맥은 남아메리카에서 칠레, 아르헨티나, 볼리비아의 자연 경계를 이룬다.",
    source: { name: "NASA Earth Observatory 「Looking Down on the Andes」", url: "https://science.nasa.gov/earth/earth-observatory/looking-down-on-the-andes-151670/" }
  },
  {
    id: "world-geography-10",
    category: "세계지리",
    question: "튀르키예의 수도는?",
    choices: ["앙카라", "이스탄불", "이즈미르", "안탈리아"],
    answer: 0,
    explanation: "튀르키예공화국의 수도는 앙카라이며, 이스탄불은 수도가 아니다.",
    source: { name: "외교부 국가 정보 「튀르키예」", url: "https://www.mofa.go.kr/www/nation/m_3458/view.do?seq=126" }
  },

  // ----- 과학 -----
  {
    id: "science-01",
    category: "과학",
    question: "물의 화학식은?",
    choices: ["H₂O", "CO₂", "O₂", "NaCl"],
    answer: 0,
    explanation: "물은 수소 원자 2개와 산소 원자 1개로 이루어진 H₂O이다.",
    source: { name: "NIST Chemistry WebBook 「Water」", url: "https://webbook.nist.gov/cgi/cbook.cgi?ID=C7732185" }
  },
  {
    id: "science-02",
    category: "과학",
    question: "2026년 현재 태양계 행성 중 태양으로부터의 거리 기준으로 태양에 가장 가까운 행성은?",
    choices: ["수성", "금성", "지구", "화성"],
    answer: 0,
    explanation: "수성은 태양에 가장 가까운 행성이자 태양계에서 가장 작은 행성이다.",
    source: { name: "NASA Science 「Mercury」", url: "https://science.nasa.gov/mercury/" }
  },
  {
    id: "science-03",
    category: "과학",
    question: "원소 기호가 Fe인 원소는?",
    choices: ["철", "불소", "납", "금"],
    answer: 0,
    explanation: "Fe는 철(Iron)의 원소 기호이다.",
    source: { name: "PubChem(미국 국립보건원) 「Iron」", url: "https://pubchem.ncbi.nlm.nih.gov/element/26" }
  },
  {
    id: "science-04",
    category: "과학",
    question: "식물이 이산화 탄소와 햇빛을 흡수해 포도당 같은 당을 만드는 과정은?",
    choices: ["광합성", "세포 호흡", "증산 작용", "발효"],
    answer: 0,
    explanation: "광합성에서 식물은 이산화 탄소와 햇빛을 흡수해 포도당 같은 당을 만든다.",
    source: { name: "NASA Earth Observatory 「The Carbon Cycle」", url: "https://science.nasa.gov/earth/earth-observatory/the-carbon-cycle" }
  },
  {
    id: "science-05",
    category: "과학",
    question: "‘붉은 행성(Red Planet)’이라고도 불리는 태양계 행성은?",
    choices: ["화성", "금성", "목성", "수성"],
    answer: 0,
    explanation: "화성은 지구에서 밝은 붉은 점으로 보이며 ‘붉은 행성’으로 불린다.",
    source: { name: "NASA Science 「Mars」", url: "https://science.nasa.gov/mars/" }
  },
  {
    id: "science-06",
    category: "과학",
    question: "2026년 현재 NASA 자료 기준으로 태양계에서 가장 큰 행성은?",
    choices: ["목성", "토성", "지구", "해왕성"],
    answer: 0,
    explanation: "목성은 태양에서 다섯 번째 행성이며 태양계에서 가장 큰 행성이다.",
    source: { name: "NASA Science 「Jupiter」", url: "https://science.nasa.gov/jupiter/" }
  },
  {
    id: "science-07",
    category: "과학",
    question: "1기압에서 순수한 물이 끓는 온도는 약 몇 °C인가?",
    choices: ["100°C", "90°C", "80°C", "120°C"],
    answer: 0,
    explanation: "NIST 자료에서 물의 끓는점은 약 373.17 K로, 약 100°C이다.",
    source: { name: "NIST Chemistry WebBook 「Water, 상변화 자료」", url: "https://webbook.nist.gov/cgi/cbook.cgi?ID=C7732185&Mask=4" }
  },
  {
    id: "science-08",
    category: "과학",
    question: "만유인력 법칙으로 지상의 운동과 천체의 운동을 하나로 이어 설명한 과학자는?",
    choices: ["아이작 뉴턴", "갈릴레오 갈릴레이", "알베르트 아인슈타인", "요하네스 케플러"],
    answer: 0,
    explanation: "뉴턴의 만유인력 법칙은 지상과 천체의 운동을 하나의 법칙으로 이어 주었다.",
    source: { name: "미국 의회도서관 「Physical Astronomy for the Mechanistic Universe」", url: "https://www.loc.gov/static/collections/finding-our-place-in-the-cosmos-with-carl-sagan/articles-and-essays/modeling-the-cosmos/physical-astronomy-for-the-mechanistic-universe.html" }
  },
  {
    id: "science-09",
    category: "과학",
    question: "주기율표에서 원자 번호가 1번인 원소는?",
    choices: ["수소", "헬륨", "산소", "탄소"],
    answer: 0,
    explanation: "수소는 원자 번호 1번이며 원소 기호는 H이다.",
    source: { name: "로스앨러모스 국립연구소 주기율표 「Hydrogen」", url: "https://www.lanl.gov/science-engineering/periodic-table/element/hydrogen" }
  },
  {
    id: "science-10",
    category: "과학",
    question: "1796년 우두에 걸렸던 사람이 천연두를 피하는 데 착안해, 우두 물질을 소년에게 접종한 영국 의사는?",
    choices: ["에드워드 제너", "루이 파스퇴르", "로베르트 코흐", "알렉산더 플레밍"],
    answer: 0,
    explanation: "제너는 1796년 우두 물질을 소년 제임스 핍스에게 접종해 천연두 예방을 시험했다.",
    source: { name: "미국 질병통제예방센터(CDC) 「History of Smallpox」", url: "https://www.cdc.gov/smallpox/about/history.html" }
  },

  // ----- 예술과 문화 -----
  {
    id: "arts-culture-01",
    category: "예술과 문화",
    question: "1447년 안평대군이 꿈에서 본 도원 이야기를 듣고 그린 「몽유도원도」의 화가는?",
    choices: ["안견", "정선", "김홍도", "신윤복"],
    answer: 0,
    explanation: "「몽유도원도」는 안견이 1447년 안평대군의 꿈 이야기를 듣고 그린 산수화이다.",
    source: { name: "한국민족문화대백과사전 「몽유도원도」", url: "https://encykorea.aks.ac.kr/Article/E0018824" }
  },
  {
    id: "arts-culture-02",
    category: "예술과 문화",
    question: "1922년 7월 『개벽』에 처음 발표된 시 「진달래꽃」을 쓴 시인은?",
    choices: ["김소월", "윤동주", "한용운", "정지용"],
    answer: 0,
    explanation: "「진달래꽃」은 1922년 7월 『개벽』에 처음 발표한 김소월의 시이다.",
    source: { name: "한국민족문화대백과사전 「진달래꽃」", url: "https://encykorea.aks.ac.kr/Article/E0054623" }
  },
  {
    id: "arts-culture-03",
    category: "예술과 문화",
    question: "성진이 양소유로 태어나 부귀공명을 누리는 꿈을 꾸는 고전 소설 『구운몽』의 작가는?",
    choices: ["김만중", "허균", "박지원", "김시습"],
    answer: 0,
    explanation: "『구운몽』의 저자는 서포 김만중(1637~1692)이다.",
    source: { name: "한국민족문화대백과사전 「구운몽」", url: "https://encykorea.aks.ac.kr/Article/E0005948" }
  },
  {
    id: "arts-culture-04",
    category: "예술과 문화",
    question: "희곡 「로미오와 줄리엣」을 쓴 작가는?",
    choices: ["윌리엄 셰익스피어", "요한 볼프강 폰 괴테", "레프 톨스토이", "찰스 디킨스"],
    answer: 0,
    explanation: "「로미오와 줄리엣」은 셰익스피어의 희곡 가운데 가장 사랑받는 작품의 하나이다.",
    source: { name: "폴거 셰익스피어 도서관 「Romeo and Juliet」", url: "https://www.folger.edu/explore/shakespeares-works/romeo-and-juliet/" }
  },
  {
    id: "arts-culture-05",
    category: "예술과 문화",
    question: "다음 중 현재 전하는 판소리 다섯 바탕에 속하는 것은?",
    choices: ["춘향가", "아리랑", "정읍사", "청산별곡"],
    answer: 0,
    explanation: "현재 전하는 판소리는 춘향가, 심청가, 흥보가, 수궁가, 적벽가의 다섯 바탕이다.",
    source: { name: "한국민족문화대백과사전 「판소리」", url: "https://encykorea.aks.ac.kr/Article/E0059663" }
  },
  {
    id: "arts-culture-06",
    category: "예술과 문화",
    question: "2012년 유네스코 인류무형문화유산 대표목록에 오른 한국의 서정 민요는?",
    choices: ["아리랑", "강강술래", "판소리", "종묘제례악"],
    answer: 0,
    explanation: "‘아리랑, 한국의 서정 민요’는 2012년 인류무형문화유산 대표목록에 올랐다.",
    source: { name: "유네스코 무형유산 「Arirang, lyrical folk song in the Republic of Korea」", url: "https://ich.unesco.org/en/RL/arirang-lyrical-folk-song-in-the-republic-of-korea-00445" }
  },
  {
    id: "arts-culture-07",
    category: "예술과 문화",
    question: "1948년 정음사에서 간행된 유고 시집 『하늘과 바람과 별과 시』의 시인은?",
    choices: ["윤동주", "김소월", "이육사", "한용운"],
    answer: 0,
    explanation: "『하늘과 바람과 별과 시』는 윤동주의 시를 모아 1948년 정음사에서 펴낸 시집이다.",
    source: { name: "한국민족문화대백과사전 「하늘과 바람과 별과 시」", url: "https://encykorea.aks.ac.kr/Article/E0060561" }
  },
  {
    id: "arts-culture-08",
    category: "예술과 문화",
    question: "1853년 3월 6일 베네치아 라 페니체 극장에서 초연된 오페라 「라 트라비아타」의 작곡가는?",
    choices: ["주세페 베르디", "자코모 푸치니", "리하르트 바그너", "조르주 비제"],
    answer: 0,
    explanation: "「라 트라비아타」는 베르디의 오페라로 1853년 라 페니체 극장에서 초연되었다.",
    source: { name: "라 페니체 극장 「Verdi, La traviata」", url: "https://www.teatrolafenice.it/en/event/giuseppe-verdi-la-traviata/" }
  },
  {
    id: "arts-culture-09",
    category: "예술과 문화",
    question: "장편 대하소설 『토지』를 쓴 작가는?",
    choices: ["박경리", "박완서", "황순원", "이청준"],
    answer: 0,
    explanation: "『토지』는 박경리가 지은 장편소설이다.",
    source: { name: "한국민족문화대백과사전 「토지」", url: "https://encykorea.aks.ac.kr/Article/E0059209" }
  },
  {
    id: "arts-culture-10",
    category: "예술과 문화",
    question: "2013년 유네스코 인류무형문화유산 대표목록에 오른, 김치를 만들고 나누는 한국의 문화는?",
    choices: ["김장", "강강술래", "줄다리기", "택견"],
    answer: 0,
    explanation: "'김장, 김치를 담그고 나누는 문화'는 2013년 인류무형문화유산 대표목록에 올랐다.",
    source: { name: "유네스코 무형유산 「Kimjang, making and sharing kimchi in the Republic of Korea」", url: "https://ich.unesco.org/en/RL/kimjang-making-and-sharing-kimchi-in-the-republic-of-korea-00881" }
  }
];
