// 2026-10-09 22:22 KST
// 문항 데이터. 형식과 작성 규칙은 PRD.md 4장을 따른다.
// 지금은 형식만 맞춘 임시 문항이다. 진짜 문항으로 바꿔 넣는다.
const QUESTIONS = [
  {
    id: "korean-history-01",
    category: "한국사",
    question: "한국사 임시 문항 1",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "한국사 임시 문항 1의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "korean-history-02",
    category: "한국사",
    question: "한국사 임시 문항 2",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "한국사 임시 문항 2의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "korean-history-03",
    category: "한국사",
    question: "한국사 임시 문항 3",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "한국사 임시 문항 3의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "korean-history-04",
    category: "한국사",
    question: "한국사 임시 문항 4",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "한국사 임시 문항 4의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "korean-history-05",
    category: "한국사",
    question: "한국사 임시 문항 5",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "한국사 임시 문항 5의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "korean-history-06",
    category: "한국사",
    question: "한국사 임시 문항 6",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "한국사 임시 문항 6의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "korean-history-07",
    category: "한국사",
    question: "한국사 임시 문항 7",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "한국사 임시 문항 7의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "korean-history-08",
    category: "한국사",
    question: "한국사 임시 문항 8",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "한국사 임시 문항 8의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "korean-history-09",
    category: "한국사",
    question: "한국사 임시 문항 9",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "한국사 임시 문항 9의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "korean-history-10",
    category: "한국사",
    question: "한국사 임시 문항 10",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "한국사 임시 문항 10의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "world-geography-01",
    category: "세계지리",
    question: "세계지리 임시 문항 1",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "세계지리 임시 문항 1의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "world-geography-02",
    category: "세계지리",
    question: "세계지리 임시 문항 2",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "세계지리 임시 문항 2의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "world-geography-03",
    category: "세계지리",
    question: "세계지리 임시 문항 3",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "세계지리 임시 문항 3의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "world-geography-04",
    category: "세계지리",
    question: "세계지리 임시 문항 4",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "세계지리 임시 문항 4의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "world-geography-05",
    category: "세계지리",
    question: "세계지리 임시 문항 5",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "세계지리 임시 문항 5의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "world-geography-06",
    category: "세계지리",
    question: "세계지리 임시 문항 6",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "세계지리 임시 문항 6의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "world-geography-07",
    category: "세계지리",
    question: "세계지리 임시 문항 7",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "세계지리 임시 문항 7의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "world-geography-08",
    category: "세계지리",
    question: "세계지리 임시 문항 8",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "세계지리 임시 문항 8의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "world-geography-09",
    category: "세계지리",
    question: "세계지리 임시 문항 9",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "세계지리 임시 문항 9의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "world-geography-10",
    category: "세계지리",
    question: "세계지리 임시 문항 10",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "세계지리 임시 문항 10의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "science-01",
    category: "과학",
    question: "과학 임시 문항 1",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "과학 임시 문항 1의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "science-02",
    category: "과학",
    question: "과학 임시 문항 2",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "과학 임시 문항 2의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "science-03",
    category: "과학",
    question: "과학 임시 문항 3",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "과학 임시 문항 3의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "science-04",
    category: "과학",
    question: "과학 임시 문항 4",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "과학 임시 문항 4의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "science-05",
    category: "과학",
    question: "과학 임시 문항 5",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "과학 임시 문항 5의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "science-06",
    category: "과학",
    question: "과학 임시 문항 6",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "과학 임시 문항 6의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "science-07",
    category: "과학",
    question: "과학 임시 문항 7",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "과학 임시 문항 7의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "science-08",
    category: "과학",
    question: "과학 임시 문항 8",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "과학 임시 문항 8의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "science-09",
    category: "과학",
    question: "과학 임시 문항 9",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "과학 임시 문항 9의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "science-10",
    category: "과학",
    question: "과학 임시 문항 10",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "과학 임시 문항 10의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "arts-culture-01",
    category: "예술과 문화",
    question: "예술과 문화 임시 문항 1",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "예술과 문화 임시 문항 1의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "arts-culture-02",
    category: "예술과 문화",
    question: "예술과 문화 임시 문항 2",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "예술과 문화 임시 문항 2의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "arts-culture-03",
    category: "예술과 문화",
    question: "예술과 문화 임시 문항 3",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "예술과 문화 임시 문항 3의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "arts-culture-04",
    category: "예술과 문화",
    question: "예술과 문화 임시 문항 4",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "예술과 문화 임시 문항 4의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "arts-culture-05",
    category: "예술과 문화",
    question: "예술과 문화 임시 문항 5",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "예술과 문화 임시 문항 5의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "arts-culture-06",
    category: "예술과 문화",
    question: "예술과 문화 임시 문항 6",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "예술과 문화 임시 문항 6의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "arts-culture-07",
    category: "예술과 문화",
    question: "예술과 문화 임시 문항 7",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "예술과 문화 임시 문항 7의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "arts-culture-08",
    category: "예술과 문화",
    question: "예술과 문화 임시 문항 8",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "예술과 문화 임시 문항 8의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "arts-culture-09",
    category: "예술과 문화",
    question: "예술과 문화 임시 문항 9",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "예술과 문화 임시 문항 9의 해설입니다.",
    source: "임시 출처"
  },
  {
    id: "arts-culture-10",
    category: "예술과 문화",
    question: "예술과 문화 임시 문항 10",
    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],
    answer: 0,
    explanation: "예술과 문화 임시 문항 10의 해설입니다.",
    source: "임시 출처"
  }
];
