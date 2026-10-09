// 2026-10-09 22:22 KST
// 여러 테스트 파일이 함께 쓰는 도우미

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

// questions.js는 브라우저용 데이터 파일이라 내보내기가 없다.
// 파일을 따로 실행해서 QUESTIONS 값을 꺼낸다.
function loadQuestions() {
  const source = fs.readFileSync(path.join(__dirname, "..", "questions.js"), "utf8");
  return vm.runInNewContext(`${source}\nQUESTIONS;`);
}

// 형식이 올바른 문항 하나. 정답은 0번 보기 "정답"이다. 바꿀 칸만 overrides로 넘긴다.
function makeQuestion(overrides = {}) {
  return {
    id: "q-01",
    category: "한국사",
    question: "문제",
    choices: ["정답", "오답1", "오답2", "오답3"],
    answer: 0,
    explanation: "해설",
    source: { name: "출처", url: "https://example.com" },
    ...overrides,
  };
}

// 카테고리마다 10개씩, 형식이 올바른 40문항. id는 c0-1 ~ c3-10이다.
function makeValidSet() {
  const list = [];
  ["한국사", "세계지리", "과학", "예술과 문화"].forEach((category, c) => {
    for (let n = 1; n <= 10; n += 1) {
      list.push(makeQuestion({ id: `c${c}-${n}`, category }));
    }
  });
  return list;
}

module.exports = { loadQuestions, makeQuestion, makeValidSet };
