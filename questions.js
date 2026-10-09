// 2026-10-09 22:22 KST
// 문항 데이터. 형식과 작성 규칙은 PRD.md 4장을 따른다.
// 출처는 모두 한국어 위키백과 문서에서 2026-10-09에 확인했다.
const QUESTIONS = [
  // ----- 한국사 -----
  {
    id: "korean-history-01",
    category: "한국사",
    question: "1443년 훈민정음을 창제한 조선의 왕은?",
    choices: ["세종", "태종", "세조", "정조"],
    answer: 0,
    explanation: "세종이 1443년 훈민정음을 창제하고 1446년 반포했다.",
    source: "한국어 위키백과 「훈민정음」, https://ko.wikipedia.org/wiki/훈민정음, 2026-10-09 확인"
  },
  {
    id: "korean-history-02",
    category: "한국사",
    question: "1592년 임진왜란 중 한산도 대첩에서 조선 수군을 이끈 장수는?",
    choices: ["이순신", "권율", "김시민", "곽재우"],
    answer: 0,
    explanation: "이순신이 이끈 조선 수군이 1592년 한산도 앞바다에서 일본 수군을 크게 물리쳤다.",
    source: "한국어 위키백과 「한산도 대첩」, https://ko.wikipedia.org/wiki/한산도_대첩, 2026-10-09 확인"
  },
  {
    id: "korean-history-03",
    category: "한국사",
    question: "676년 기벌포 전투에서 이겨 당나라 세력을 몰아내고 삼국 통일을 완수한 나라는?",
    choices: ["신라", "백제", "고구려", "가야"],
    answer: 0,
    explanation: "신라는 나당 전쟁에서 이겨 676년 당나라 군대를 대동강 북쪽으로 몰아냈다.",
    source: "한국어 위키백과 「나당전쟁」, https://ko.wikipedia.org/wiki/나당전쟁, 2026-10-09 확인"
  },
  {
    id: "korean-history-04",
    category: "한국사",
    question: "1392년 즉위하여 조선을 건국한 인물은?",
    choices: ["이성계", "정도전", "이방원", "최영"],
    answer: 0,
    explanation: "이성계(태조)가 1392년 즉위하여 조선을 세웠다.",
    source: "한국어 위키백과 「태조 (조선)」, https://ko.wikipedia.org/wiki/태조_(조선), 2026-10-09 확인"
  },
  {
    id: "korean-history-05",
    category: "한국사",
    question: "3·1 운동이 일어난 해는?",
    choices: ["1919년", "1910년", "1926년", "1945년"],
    answer: 0,
    explanation: "3·1 운동은 1919년 3월 1일 시작되어 전국으로 퍼졌다.",
    source: "한국어 위키백과 「3·1 운동」, https://ko.wikipedia.org/wiki/3·1_운동, 2026-10-09 확인"
  },
  {
    id: "korean-history-06",
    category: "한국사",
    question: "1377년 청주 흥덕사에서 금속 활자로 인쇄되어 2001년 유네스코 세계기록유산에 등재된 책은?",
    choices: ["직지심체요절", "팔만대장경", "삼국사기", "동의보감"],
    answer: 0,
    explanation: "직지심체요절은 1377년 흥덕사에서 금속 활자로 간행되었고 2001년 세계기록유산이 되었다.",
    source: "한국어 위키백과 「직지심체요절」, https://ko.wikipedia.org/wiki/직지심체요절, 2026-10-09 확인"
  },
  {
    id: "korean-history-07",
    category: "한국사",
    question: "1919년 4월 대한민국 임시 정부가 처음 수립된 도시는?",
    choices: ["상하이", "베이징", "충칭", "도쿄"],
    answer: 0,
    explanation: "대한민국 임시 정부는 1919년 4월 11일 중국 상하이에서 수립되었다.",
    source: "한국어 위키백과 「대한민국 임시정부」, https://ko.wikipedia.org/wiki/대한민국_임시정부, 2026-10-09 확인"
  },
  {
    id: "korean-history-08",
    category: "한국사",
    question: "『삼국유사』에 따르면 고조선을 세운 인물은?",
    choices: ["단군왕검", "주몽", "온조", "박혁거세"],
    answer: 0,
    explanation: "『삼국유사』와 『제왕운기』는 단군왕검이 고조선을 세웠다고 전한다.",
    source: "한국어 위키백과 「단군왕검」, https://ko.wikipedia.org/wiki/단군왕검, 2026-10-09 확인"
  },
  {
    id: "korean-history-09",
    category: "한국사",
    question: "『삼국사기』에 따르면 기원전 18년 백제를 세운 인물은?",
    choices: ["온조", "주몽", "박혁거세", "김수로"],
    answer: 0,
    explanation: "『삼국사기』는 온조가 기원전 18년 백제를 세웠다고 기록한다.",
    source: "한국어 위키백과 「온조왕」, https://ko.wikipedia.org/wiki/온조왕, 2026-10-09 확인"
  },
  {
    id: "korean-history-10",
    category: "한국사",
    question: "1794년부터 1796년까지 수원 화성을 쌓게 한 조선의 왕은?",
    choices: ["정조", "영조", "숙종", "순조"],
    answer: 0,
    explanation: "수원 화성은 정조 때인 1794년 착공해 1796년 완공되었다.",
    source: "한국어 위키백과 「수원 화성」, https://ko.wikipedia.org/wiki/수원_화성, 2026-10-09 확인"
  },

  // ----- 세계지리 -----
  {
    id: "world-geography-01",
    category: "세계지리",
    question: "오스트레일리아의 수도는?",
    choices: ["캔버라", "시드니", "멜버른", "퍼스"],
    answer: 0,
    explanation: "오스트레일리아의 수도는 캔버라이며, 시드니와 멜버른은 수도가 아니다.",
    source: "한국어 위키백과 「캔버라」, https://ko.wikipedia.org/wiki/캔버라, 2026-10-09 확인"
  },
  {
    id: "world-geography-02",
    category: "세계지리",
    question: "2026년 현재 국토 면적 기준으로 세계에서 가장 넓은 나라는?",
    choices: ["러시아", "캐나다", "중국", "미국"],
    answer: 0,
    explanation: "러시아의 면적은 약 1,709만 km²로 세계에서 가장 넓다.",
    source: "한국어 위키백과 「러시아」, https://ko.wikipedia.org/wiki/러시아, 2026-10-09 확인"
  },
  {
    id: "world-geography-03",
    category: "세계지리",
    question: "2026년 현재 해발 고도(해수면으로부터의 높이) 기준으로 세계에서 가장 높은 산은?",
    choices: ["에베레스트산", "K2", "칸첸중가", "킬리만자로산"],
    answer: 0,
    explanation: "에베레스트산은 해발 약 8,848.86m로, 해발 고도 기준 가장 높은 산이다.",
    source: "한국어 위키백과 「에베레스트산」, https://ko.wikipedia.org/wiki/에베레스트산, 2026-10-09 확인"
  },
  {
    id: "world-geography-04",
    category: "세계지리",
    question: "1869년 개통되어 지중해와 홍해를 잇는 운하는?",
    choices: ["수에즈 운하", "파나마 운하", "킬 운하", "코린트 운하"],
    answer: 0,
    explanation: "수에즈 운하는 1869년 개통되었으며 지중해와 홍해를 잇는다.",
    source: "한국어 위키백과 「수에즈 운하」, https://ko.wikipedia.org/wiki/수에즈_운하, 2026-10-09 확인"
  },
  {
    id: "world-geography-05",
    category: "세계지리",
    question: "브라질의 공용어는?",
    choices: ["포르투갈어", "스페인어", "영어", "프랑스어"],
    answer: 0,
    explanation: "브라질은 포르투갈의 식민지였던 역사로 포르투갈어를 공용어로 쓴다.",
    source: "한국어 위키백과 「브라질」, https://ko.wikipedia.org/wiki/브라질, 2026-10-09 확인"
  },
  {
    id: "world-geography-06",
    category: "세계지리",
    question: "사하라 사막이 있는 대륙은?",
    choices: ["아프리카", "아시아", "남아메리카", "오세아니아"],
    answer: 0,
    explanation: "사하라 사막은 아프리카 북부의 약 940만 km²를 차지한다.",
    source: "한국어 위키백과 「사하라 사막」, https://ko.wikipedia.org/wiki/사하라_사막, 2026-10-09 확인"
  },
  {
    id: "world-geography-07",
    category: "세계지리",
    question: "캐나다의 수도는?",
    choices: ["오타와", "토론토", "밴쿠버", "몬트리올"],
    answer: 0,
    explanation: "캐나다의 수도는 온타리오주에 있는 오타와이다.",
    source: "한국어 위키백과 「오타와」, https://ko.wikipedia.org/wiki/오타와, 2026-10-09 확인"
  },
  {
    id: "world-geography-08",
    category: "세계지리",
    question: "나일강이 이집트 북부에서 흘러드는 바다는?",
    choices: ["지중해", "홍해", "아라비아해", "흑해"],
    answer: 0,
    explanation: "나일강은 이집트 북부의 삼각주를 지나 지중해로 흘러든다.",
    source: "한국어 위키백과 「나일강」, https://ko.wikipedia.org/wiki/나일강, 2026-10-09 확인"
  },
  {
    id: "world-geography-09",
    category: "세계지리",
    question: "안데스산맥이 있는 대륙은?",
    choices: ["남아메리카", "북아메리카", "아프리카", "유럽"],
    answer: 0,
    explanation: "안데스산맥은 남아메리카 대륙의 서쪽 해안을 따라 뻗어 있다.",
    source: "한국어 위키백과 「안데스산맥」, https://ko.wikipedia.org/wiki/안데스산맥, 2026-10-09 확인"
  },
  {
    id: "world-geography-10",
    category: "세계지리",
    question: "튀르키예의 수도는?",
    choices: ["앙카라", "이스탄불", "이즈미르", "안탈리아"],
    answer: 0,
    explanation: "튀르키예의 수도는 앙카라이며, 가장 큰 도시인 이스탄불과 구별해야 한다.",
    source: "한국어 위키백과 「앙카라」, https://ko.wikipedia.org/wiki/앙카라, 2026-10-09 확인"
  },

  // ----- 과학 -----
  {
    id: "science-01",
    category: "과학",
    question: "물의 화학식은?",
    choices: ["H₂O", "CO₂", "O₂", "NaCl"],
    answer: 0,
    explanation: "물은 수소 원자 2개와 산소 원자 1개로 이루어진 H₂O이다.",
    source: "한국어 위키백과 「물」, https://ko.wikipedia.org/wiki/물, 2026-10-09 확인"
  },
  {
    id: "science-02",
    category: "과학",
    question: "태양으로부터의 평균 거리 기준으로 태양에 가장 가까운 행성은?",
    choices: ["수성", "금성", "지구", "화성"],
    answer: 0,
    explanation: "수성은 태양으로부터 평균 약 5,800만 km 떨어져 있어 태양에 가장 가깝다.",
    source: "한국어 위키백과 「수성」, https://ko.wikipedia.org/wiki/수성, 2026-10-09 확인"
  },
  {
    id: "science-03",
    category: "과학",
    question: "원소 기호가 Fe인 원소는?",
    choices: ["철", "불소", "납", "금"],
    answer: 0,
    explanation: "Fe는 원자 번호 26번인 철의 원소 기호이다.",
    source: "한국어 위키백과 「철」, https://ko.wikipedia.org/wiki/철, 2026-10-09 확인"
  },
  {
    id: "science-04",
    category: "과학",
    question: "식물이 빛 에너지를 이용해 이산화 탄소와 물로 양분(당)을 만드는 과정은?",
    choices: ["광합성", "세포 호흡", "증산 작용", "발효"],
    answer: 0,
    explanation: "광합성은 빛 에너지를 화학 에너지로 바꾸어 이산화 탄소와 물로부터 당을 만드는 과정이다.",
    source: "한국어 위키백과 「광합성」, https://ko.wikipedia.org/wiki/광합성, 2026-10-09 확인"
  },
  {
    id: "science-05",
    category: "과학",
    question: "진공에서 빛의 속력에 가장 가까운 값은?",
    choices: ["초속 약 30만 km", "초속 약 3만 km", "초속 약 300만 km", "초속 약 3천 km"],
    answer: 0,
    explanation: "진공에서 빛의 속력은 정확히 초속 299,792,458m, 곧 초속 약 30만 km이다.",
    source: "한국어 위키백과 「빛의 속력」, https://ko.wikipedia.org/wiki/빛의_속력, 2026-10-09 확인"
  },
  {
    id: "science-06",
    category: "과학",
    question: "사람의 적혈구 안에서 산소를 운반하는 단백질은?",
    choices: ["헤모글로빈", "인슐린", "케라틴", "콜라겐"],
    answer: 0,
    explanation: "헤모글로빈은 철을 포함한 단백질로, 적혈구에서 산소를 운반한다.",
    source: "한국어 위키백과 「헤모글로빈」, https://ko.wikipedia.org/wiki/헤모글로빈, 2026-10-09 확인"
  },
  {
    id: "science-07",
    category: "과학",
    question: "1기압(표준 대기압)에서 순수한 물이 끓는 온도는 약 몇 °C인가?",
    choices: ["100°C", "90°C", "80°C", "120°C"],
    answer: 0,
    explanation: "1기압에서 물의 끓는점은 약 100°C(정밀하게는 약 99.98°C)이다.",
    source: "한국어 위키백과 「물」, https://ko.wikipedia.org/wiki/물, 2026-10-09 확인"
  },
  {
    id: "science-08",
    category: "과학",
    question: "1687년 『프린키피아』에서 만유인력의 법칙을 발표한 과학자는?",
    choices: ["아이작 뉴턴", "갈릴레오 갈릴레이", "알베르트 아인슈타인", "요하네스 케플러"],
    answer: 0,
    explanation: "뉴턴은 1687년 『자연철학의 수학적 원리』(프린키피아)에서 만유인력의 법칙을 소개했다.",
    source: "한국어 위키백과 「만유인력의 법칙」, https://ko.wikipedia.org/wiki/만유인력의_법칙, 2026-10-09 확인"
  },
  {
    id: "science-09",
    category: "과학",
    question: "주기율표에서 원자 번호가 1번인 원소는?",
    choices: ["수소", "헬륨", "산소", "탄소"],
    answer: 0,
    explanation: "수소는 원자 번호 1번이며 원소 기호는 H이다.",
    source: "한국어 위키백과 「수소」, https://ko.wikipedia.org/wiki/수소, 2026-10-09 확인"
  },
  {
    id: "science-10",
    category: "과학",
    question: "1953년 DNA의 이중 나선 구조를 발표한 과학자들은?",
    choices: ["왓슨과 크릭", "멘델과 다윈", "퀴리 부부", "파스퇴르와 코흐"],
    answer: 0,
    explanation: "제임스 왓슨과 프랜시스 크릭이 1953년 DNA 이중 나선 구조를 발표했다.",
    source: "한국어 위키백과 「DNA」, https://ko.wikipedia.org/wiki/DNA, 2026-10-09 확인"
  },

  // ----- 예술과 문화 -----
  {
    id: "arts-culture-01",
    category: "예술과 문화",
    question: "프랑스 루브르 박물관에 있는 「모나리자」를 그린 화가는?",
    choices: ["레오나르도 다빈치", "미켈란젤로", "라파엘로", "렘브란트"],
    answer: 0,
    explanation: "「모나리자」는 레오나르도 다빈치의 작품으로 루브르 박물관에 소장되어 있다.",
    source: "한국어 위키백과 「모나리자」, https://ko.wikipedia.org/wiki/모나리자, 2026-10-09 확인"
  },
  {
    id: "arts-culture-02",
    category: "예술과 문화",
    question: "1889년 작품 「별이 빛나는 밤」을 그린 화가는?",
    choices: ["빈센트 반 고흐", "클로드 모네", "폴 세잔", "에드바르 뭉크"],
    answer: 0,
    explanation: "「별이 빛나는 밤」은 빈센트 반 고흐가 1889년 그린 작품이다.",
    source: "한국어 위키백과 「별이 빛나는 밤」, https://ko.wikipedia.org/wiki/별이_빛나는_밤, 2026-10-09 확인"
  },
  {
    id: "arts-culture-03",
    category: "예술과 문화",
    question: "흔히 「운명」이라는 별칭으로 불리는 교향곡 제5번의 작곡가는?",
    choices: ["베토벤", "모차르트", "바흐", "슈베르트"],
    answer: 0,
    explanation: "베토벤의 교향곡 제5번은 동양권에서 흔히 「운명」이라는 별칭으로 불린다.",
    source: "한국어 위키백과 「교향곡 5번 (베토벤)」, https://ko.wikipedia.org/wiki/교향곡_5번_(베토벤), 2026-10-09 확인"
  },
  {
    id: "arts-culture-04",
    category: "예술과 문화",
    question: "희곡 「로미오와 줄리엣」을 쓴 작가는?",
    choices: ["윌리엄 셰익스피어", "요한 볼프강 폰 괴테", "레프 톨스토이", "찰스 디킨스"],
    answer: 0,
    explanation: "「로미오와 줄리엣」은 윌리엄 셰익스피어의 희곡이다.",
    source: "한국어 위키백과 「로미오와 줄리엣」, https://ko.wikipedia.org/wiki/로미오와_줄리엣, 2026-10-09 확인"
  },
  {
    id: "arts-culture-05",
    category: "예술과 문화",
    question: "다음 중 현재 전하는 판소리 다섯 마당에 속하는 것은?",
    choices: ["춘향가", "아리랑", "정읍사", "청산별곡"],
    answer: 0,
    explanation: "판소리 다섯 마당은 춘향가, 흥보가, 심청가, 적벽가, 수궁가이다.",
    source: "한국어 위키백과 「판소리」, https://ko.wikipedia.org/wiki/판소리, 2026-10-09 확인"
  },
  {
    id: "arts-culture-06",
    category: "예술과 문화",
    question: "다음 중 파블로 피카소가 1937년에 그린 작품은?",
    choices: ["게르니카", "절규", "진주 귀걸이를 한 소녀", "수련"],
    answer: 0,
    explanation: "「게르니카」는 피카소가 1937년에 그린 작품이다.",
    source: "한국어 위키백과 「게르니카 (그림)」, https://ko.wikipedia.org/wiki/게르니카_(그림), 2026-10-09 확인"
  },
  {
    id: "arts-culture-07",
    category: "예술과 문화",
    question: "풍속화 「씨름」과 「서당」을 그린 조선 후기의 화가는?",
    choices: ["김홍도", "신윤복", "정선", "안견"],
    answer: 0,
    explanation: "김홍도는 「서당」, 「씨름」 같은 풍속화로 서민의 일상을 그렸다.",
    source: "한국어 위키백과 「김홍도」, https://ko.wikipedia.org/wiki/김홍도, 2026-10-09 확인"
  },
  {
    id: "arts-culture-08",
    category: "예술과 문화",
    question: "1853년 베네치아에서 초연된 오페라 「라 트라비아타」의 작곡가는?",
    choices: ["주세페 베르디", "자코모 푸치니", "리하르트 바그너", "조르주 비제"],
    answer: 0,
    explanation: "「라 트라비아타」는 베르디의 오페라로 1853년 라 페니체 극장에서 초연되었다.",
    source: "한국어 위키백과 「라 트라비아타」, https://ko.wikipedia.org/wiki/라_트라비아타, 2026-10-09 확인"
  },
  {
    id: "arts-culture-09",
    category: "예술과 문화",
    question: "대하소설 『토지』를 쓴 작가는?",
    choices: ["박경리", "박완서", "황순원", "이청준"],
    answer: 0,
    explanation: "『토지』는 소설가 박경리가 쓴 대하소설이다.",
    source: "한국어 위키백과 「토지 (소설)」, https://ko.wikipedia.org/wiki/토지_(소설), 2026-10-09 확인"
  },
  {
    id: "arts-culture-10",
    category: "예술과 문화",
    question: "2013년 유네스코 인류무형문화유산에 등재된, 김치를 담그고 나누는 한국의 문화는?",
    choices: ["김장", "강강술래", "줄다리기", "택견"],
    answer: 0,
    explanation: "'김장, 김치를 담그고 나누는 문화'는 2013년 인류무형문화유산에 등재되었다.",
    source: "한국어 위키백과 「김장」, https://ko.wikipedia.org/wiki/김장, 2026-10-09 확인"
  }
];
