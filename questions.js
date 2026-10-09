// 2026-10-09 22:22 KST
// 문항 데이터. 형식과 작성 규칙은 PRD.md 4장을 따른다.
// 출처는 모두 기관 자료이며 2026-10-10에 페이지를 열어 확인했다. 검수표는 QUESTION-REVIEW.md에 있다.
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
    question: "오스트레일리아(호주)의 수도는?",
    choices: ["캔버라", "시드니", "멜버른", "퍼스"],
    answer: 0,
    explanation: "호주의 수도는 캔버라이며, 시드니와 멜버른은 수도가 아니다.",
    source: { name: "외교부 국가 정보 「호주」", url: "https://www.mofa.go.kr/www/nation/m_3458/view.do?seq=41" }
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
    question: "브라질에서 쓰는 언어는?",
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
    source: { name: "한국어 위키백과 「물」", url: "https://ko.wikipedia.org/wiki/물" }
  },
  {
    id: "science-02",
    category: "과학",
    question: "태양으로부터의 평균 거리 기준으로 태양에 가장 가까운 행성은?",
    choices: ["수성", "금성", "지구", "화성"],
    answer: 0,
    explanation: "수성은 태양으로부터 평균 약 5,800만 km 떨어져 있어 태양에 가장 가깝다.",
    source: { name: "한국어 위키백과 「수성」", url: "https://ko.wikipedia.org/wiki/수성" }
  },
  {
    id: "science-03",
    category: "과학",
    question: "원소 기호가 Fe인 원소는?",
    choices: ["철", "불소", "납", "금"],
    answer: 0,
    explanation: "Fe는 원자 번호 26번인 철의 원소 기호이다.",
    source: { name: "한국어 위키백과 「철」", url: "https://ko.wikipedia.org/wiki/철" }
  },
  {
    id: "science-04",
    category: "과학",
    question: "식물이 빛 에너지를 이용해 이산화 탄소와 물로 양분(당)을 만드는 과정은?",
    choices: ["광합성", "세포 호흡", "증산 작용", "발효"],
    answer: 0,
    explanation: "광합성은 빛 에너지를 화학 에너지로 바꾸어 이산화 탄소와 물로부터 당을 만드는 과정이다.",
    source: { name: "한국어 위키백과 「광합성」", url: "https://ko.wikipedia.org/wiki/광합성" }
  },
  {
    id: "science-05",
    category: "과학",
    question: "진공에서 빛의 속력에 가장 가까운 값은?",
    choices: ["초속 약 30만 km", "초속 약 3만 km", "초속 약 300만 km", "초속 약 3천 km"],
    answer: 0,
    explanation: "진공에서 빛의 속력은 정확히 초속 299,792,458m, 곧 초속 약 30만 km이다.",
    source: { name: "한국어 위키백과 「빛의 속력」", url: "https://ko.wikipedia.org/wiki/빛의_속력" }
  },
  {
    id: "science-06",
    category: "과학",
    question: "사람의 적혈구 안에서 산소를 운반하는 단백질은?",
    choices: ["헤모글로빈", "인슐린", "케라틴", "콜라겐"],
    answer: 0,
    explanation: "헤모글로빈은 철을 포함한 단백질로, 적혈구에서 산소를 운반한다.",
    source: { name: "한국어 위키백과 「헤모글로빈」", url: "https://ko.wikipedia.org/wiki/헤모글로빈" }
  },
  {
    id: "science-07",
    category: "과학",
    question: "1기압(표준 대기압)에서 순수한 물이 끓는 온도는 약 몇 °C인가?",
    choices: ["100°C", "90°C", "80°C", "120°C"],
    answer: 0,
    explanation: "1기압에서 물의 끓는점은 약 100°C(정밀하게는 약 99.98°C)이다.",
    source: { name: "한국어 위키백과 「물」", url: "https://ko.wikipedia.org/wiki/물" }
  },
  {
    id: "science-08",
    category: "과학",
    question: "1687년 『프린키피아』에서 만유인력의 법칙을 발표한 과학자는?",
    choices: ["아이작 뉴턴", "갈릴레오 갈릴레이", "알베르트 아인슈타인", "요하네스 케플러"],
    answer: 0,
    explanation: "뉴턴은 1687년 『자연철학의 수학적 원리』(프린키피아)에서 만유인력의 법칙을 소개했다.",
    source: { name: "한국어 위키백과 「만유인력의 법칙」", url: "https://ko.wikipedia.org/wiki/만유인력의_법칙" }
  },
  {
    id: "science-09",
    category: "과학",
    question: "주기율표에서 원자 번호가 1번인 원소는?",
    choices: ["수소", "헬륨", "산소", "탄소"],
    answer: 0,
    explanation: "수소는 원자 번호 1번이며 원소 기호는 H이다.",
    source: { name: "한국어 위키백과 「수소」", url: "https://ko.wikipedia.org/wiki/수소" }
  },
  {
    id: "science-10",
    category: "과학",
    question: "1953년 DNA의 이중 나선 구조를 발표한 과학자들은?",
    choices: ["왓슨과 크릭", "멘델과 다윈", "퀴리 부부", "파스퇴르와 코흐"],
    answer: 0,
    explanation: "제임스 왓슨과 프랜시스 크릭이 1953년 DNA 이중 나선 구조를 발표했다.",
    source: { name: "한국어 위키백과 「DNA」", url: "https://ko.wikipedia.org/wiki/DNA" }
  },

  // ----- 예술과 문화 -----
  {
    id: "arts-culture-01",
    category: "예술과 문화",
    question: "프랑스 루브르 박물관에 있는 「모나리자」를 그린 화가는?",
    choices: ["레오나르도 다빈치", "미켈란젤로", "라파엘로", "렘브란트"],
    answer: 0,
    explanation: "「모나리자」는 레오나르도 다빈치의 작품으로 루브르 박물관에 소장되어 있다.",
    source: { name: "한국어 위키백과 「모나리자」", url: "https://ko.wikipedia.org/wiki/모나리자" }
  },
  {
    id: "arts-culture-02",
    category: "예술과 문화",
    question: "1889년 작품 「별이 빛나는 밤」을 그린 화가는?",
    choices: ["빈센트 반 고흐", "클로드 모네", "폴 세잔", "에드바르 뭉크"],
    answer: 0,
    explanation: "「별이 빛나는 밤」은 빈센트 반 고흐가 1889년 그린 작품이다.",
    source: { name: "한국어 위키백과 「별이 빛나는 밤」", url: "https://ko.wikipedia.org/wiki/별이_빛나는_밤" }
  },
  {
    id: "arts-culture-03",
    category: "예술과 문화",
    question: "흔히 「운명」이라는 별칭으로 불리는 교향곡 제5번의 작곡가는?",
    choices: ["베토벤", "모차르트", "바흐", "슈베르트"],
    answer: 0,
    explanation: "베토벤의 교향곡 제5번은 동양권에서 흔히 「운명」이라는 별칭으로 불린다.",
    source: { name: "한국어 위키백과 「교향곡 5번 (베토벤)」", url: "https://ko.wikipedia.org/wiki/교향곡_5번_(베토벤)" }
  },
  {
    id: "arts-culture-04",
    category: "예술과 문화",
    question: "희곡 「로미오와 줄리엣」을 쓴 작가는?",
    choices: ["윌리엄 셰익스피어", "요한 볼프강 폰 괴테", "레프 톨스토이", "찰스 디킨스"],
    answer: 0,
    explanation: "「로미오와 줄리엣」은 윌리엄 셰익스피어의 희곡이다.",
    source: { name: "한국어 위키백과 「로미오와 줄리엣」", url: "https://ko.wikipedia.org/wiki/로미오와_줄리엣" }
  },
  {
    id: "arts-culture-05",
    category: "예술과 문화",
    question: "다음 중 현재 전하는 판소리 다섯 마당에 속하는 것은?",
    choices: ["춘향가", "아리랑", "정읍사", "청산별곡"],
    answer: 0,
    explanation: "판소리 다섯 마당은 춘향가, 흥보가, 심청가, 적벽가, 수궁가이다.",
    source: { name: "한국어 위키백과 「판소리」", url: "https://ko.wikipedia.org/wiki/판소리" }
  },
  {
    id: "arts-culture-06",
    category: "예술과 문화",
    question: "다음 중 파블로 피카소가 1937년에 그린 작품은?",
    choices: ["게르니카", "절규", "진주 귀걸이를 한 소녀", "수련"],
    answer: 0,
    explanation: "「게르니카」는 피카소가 1937년에 그린 작품이다.",
    source: { name: "한국어 위키백과 「게르니카 (그림)」", url: "https://ko.wikipedia.org/wiki/게르니카_(그림)" }
  },
  {
    id: "arts-culture-07",
    category: "예술과 문화",
    question: "풍속화 「씨름」과 「서당」을 그린 조선 후기의 화가는?",
    choices: ["김홍도", "신윤복", "정선", "안견"],
    answer: 0,
    explanation: "김홍도는 「서당」, 「씨름」 같은 풍속화로 서민의 일상을 그렸다.",
    source: { name: "한국어 위키백과 「김홍도」", url: "https://ko.wikipedia.org/wiki/김홍도" }
  },
  {
    id: "arts-culture-08",
    category: "예술과 문화",
    question: "1853년 베네치아에서 초연된 오페라 「라 트라비아타」의 작곡가는?",
    choices: ["주세페 베르디", "자코모 푸치니", "리하르트 바그너", "조르주 비제"],
    answer: 0,
    explanation: "「라 트라비아타」는 베르디의 오페라로 1853년 라 페니체 극장에서 초연되었다.",
    source: { name: "한국어 위키백과 「라 트라비아타」", url: "https://ko.wikipedia.org/wiki/라_트라비아타" }
  },
  {
    id: "arts-culture-09",
    category: "예술과 문화",
    question: "대하소설 『토지』를 쓴 작가는?",
    choices: ["박경리", "박완서", "황순원", "이청준"],
    answer: 0,
    explanation: "『토지』는 소설가 박경리가 쓴 대하소설이다.",
    source: { name: "한국어 위키백과 「토지 (소설)」", url: "https://ko.wikipedia.org/wiki/토지_(소설)" }
  },
  {
    id: "arts-culture-10",
    category: "예술과 문화",
    question: "2013년 유네스코 인류무형문화유산에 등재된, 김치를 담그고 나누는 한국의 문화는?",
    choices: ["김장", "강강술래", "줄다리기", "택견"],
    answer: 0,
    explanation: "'김장, 김치를 담그고 나누는 문화'는 2013년 인류무형문화유산에 등재되었다.",
    source: { name: "한국어 위키백과 「김장」", url: "https://ko.wikipedia.org/wiki/김장" }
  }
];
