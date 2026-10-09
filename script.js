// 2026-10-09 22:22 KST
// 상식 퀴즈의 규칙과 화면 동작.
// "규칙" 부분은 화면 없이 동작하는 함수라서 Node 테스트(tests 폴더)로 검사한다.

// ===== 규칙 =====

const CATEGORIES = ["한국사", "세계지리", "과학", "예술과 문화"];
const QUESTIONS_PER_CATEGORY = 10;
const CHOICE_COUNT = 4;

// 문항 데이터의 형식 문제를 찾아 문장 목록으로 돌려준다. 문제가 없으면 빈 배열이다.
// 정답이 하나뿐인지, 최상급 표현에 기준과 시점이 있는지는 사람이 확인한다.
function validateQuestions(questions) {
  if (!Array.isArray(questions)) {
    return ["QUESTIONS가 배열이 아닙니다."];
  }
  const messages = [];
  const seenIds = new Set();
  const counts = {};
  CATEGORIES.forEach((category) => {
    counts[category] = 0;
  });

  questions.forEach((q, i) => {
    const label = q.id || `${i + 1}번째 문항`;
    if (!q.id) {
      messages.push(`${label}: id가 비어 있습니다.`);
    } else if (seenIds.has(q.id)) {
      messages.push(`${label}: id가 다른 문항과 겹칩니다.`);
    }
    seenIds.add(q.id);

    if (CATEGORIES.includes(q.category)) {
      counts[q.category] += 1;
    } else {
      messages.push(`${label}: 카테고리 "${q.category}"는 정해진 4개 중 하나가 아닙니다.`);
    }
    if (!Array.isArray(q.choices) || q.choices.length !== CHOICE_COUNT) {
      messages.push(`${label}: 보기가 ${CHOICE_COUNT}개가 아닙니다.`);
    }
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= CHOICE_COUNT) {
      messages.push(`${label}: answer는 0~${CHOICE_COUNT - 1} 사이의 정수여야 합니다.`);
    }
    if (!isFilled(q.explanation)) {
      messages.push(`${label}: 해설(explanation)이 비어 있습니다.`);
    }
    if (!isFilled(q.source)) {
      messages.push(`${label}: 출처(source)가 비어 있습니다.`);
    }
  });

  CATEGORIES.forEach((category) => {
    if (counts[category] !== QUESTIONS_PER_CATEGORY) {
      messages.push(
        `카테고리 "${category}"의 문항이 ${counts[category]}개입니다. ${QUESTIONS_PER_CATEGORY}개여야 합니다.`,
      );
    }
  });
  return messages;
}

function isFilled(text) {
  return typeof text === "string" && text.trim() !== "";
}

// 피셔-예이츠 방식으로 섞은 새 배열을 돌려준다. 원래 배열은 그대로 둔다.
// random은 테스트에서 결과를 정해 두려고 받는다.
function shuffle(items, random = Math.random) {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// 보기 순서를 섞은 문항 사본을 만든다. answer도 섞인 위치로 옮긴다.
function prepareQuestion(question, random = Math.random) {
  const order = shuffle(question.choices.map((_, i) => i), random);
  return {
    ...question,
    choices: order.map((i) => question.choices[i]),
    answer: order.indexOf(question.answer),
  };
}

// 문항 순서와 각 문항의 보기 순서를 섞어 한 판을 준비한다.
function prepareRound(questions, random = Math.random) {
  return shuffle(questions, random).map((question) => prepareQuestion(question, random));
}

// 맞히면 1점, 힌트를 쓰고 맞히면 0.5점, 틀리거나 시간이 지나면 0점이다.
function scoreAnswer(correct, usedHint) {
  if (!correct) {
    return 0;
  }
  return usedHint ? 0.5 : 1;
}

// 7은 "7"로, 7.5는 "7.5"로 보여 준다.
function formatScore(score) {
  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}

// 한 판의 상태. mode는 "practice", "speed", "hint" 중 하나다.
function createRound(mode, category, questions) {
  return { mode, category, questions, index: 0, usedHint: false, results: [] };
}

// 지금 문항에 답한다. chosenIndex가 null이면 시간 초과다.
// 이미 답한 문항이면(보기를 연달아 누름, 0초와 클릭이 겹침) 아무것도 하지 않고 null을 돌려준다.
function answerCurrent(round, chosenIndex) {
  if (round.results.length > round.index) {
    return null;
  }
  const question = round.questions[round.index];
  const correct = chosenIndex === question.answer;
  const result = { question, chosenIndex, correct, points: scoreAnswer(correct, round.usedHint) };
  round.results.push(result);
  return result;
}

// 다음 문항으로 넘어간다. 남은 문항이 있으면 true를 돌려준다.
function goNext(round) {
  round.index += 1;
  round.usedHint = false;
  return round.index < round.questions.length;
}

function roundScore(round) {
  return round.results.reduce((sum, result) => sum + result.points, 0);
}

function correctCount(round) {
  return round.results.filter((result) => result.correct).length;
}

function wrongQuestions(round) {
  return round.results.filter((result) => !result.correct).map((result) => result.question);
}

// Node 테스트에서 규칙 함수를 불러 쓰기 위한 부분이다. 브라우저에는 module이 없어 실행되지 않는다.
if (typeof module !== "undefined") {
  module.exports = {
    CATEGORIES,
    validateQuestions,
    shuffle,
    prepareQuestion,
    prepareRound,
    scoreAnswer,
    formatScore,
    createRound,
    answerCurrent,
    goNext,
    roundScore,
    correctCount,
    wrongQuestions,
  };
}
