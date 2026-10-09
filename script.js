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

// 지금 문항에 힌트를 쓴다. 지울 오답 보기 2개의 위치를 돌려준다.
// 이미 힌트를 썼거나 답한 문항이면 null을 돌려준다.
function useHint(round, random = Math.random) {
  if (round.usedHint || round.results.length > round.index) {
    return null;
  }
  round.usedHint = true;
  const answer = round.questions[round.index].answer;
  const wrongChoices = [0, 1, 2, 3].filter((i) => i !== answer);
  return shuffle(wrongChoices, random).slice(0, 2);
}

const SPEED_SECONDS = 15;

// 마감 시각까지 남은 초(올림)를 돌려준다. 마감이 지났으면 0이다.
// 마감 시각을 기준으로 계산하므로, 탭을 벗어나 타이머가 늦게 불려도 시간이 어긋나지 않는다.
function remainingSeconds(deadline, now) {
  return Math.max(0, Math.ceil((deadline - now) / 1000));
}

const LEADERBOARD_KEY = "quizLeaderboard";
const LEADERBOARD_SIZE = 10;
const RANKED_MODES = ["speed", "hint"]; // 연습 모드는 순위표에 기록하지 않는다.

// 순위표는 { "speed:한국사": [{ score, date }, ...], ... } 모양이다.
function boardKey(mode, category) {
  return `${mode}:${category}`;
}

// 손으로 고친 저장값에는 기록이 아닌 항목이 섞일 수 있어 점수가 숫자인 객체만 남긴다.
function recordsFor(board, key) {
  if (!Array.isArray(board[key])) {
    return [];
  }
  return board[key].filter((record) => record !== null && typeof record === "object" && typeof record.score === "number");
}

// 기록을 넣고 점수 높은 순으로 상위 10개만 남긴 새 순위표를 돌려준다.
// sort는 안정 정렬이라 점수가 같으면 먼저 들어간(먼저 세운) 기록이 위에 남는다.
function addRecord(board, key, record) {
  const records = recordsFor(board, key).concat(record);
  records.sort((a, b) => b.score - a.score);
  return { ...board, [key]: records.slice(0, LEADERBOARD_SIZE) };
}

// 저장된 순위표를 읽는다. 저장소를 쓸 수 없거나 값이 깨져 있으면 빈 순위표를 돌려준다.
function loadBoard(storage) {
  try {
    const board = JSON.parse(storage.getItem(LEADERBOARD_KEY));
    return board && typeof board === "object" && !Array.isArray(board) ? board : {};
  } catch {
    return {};
  }
}

// 순위표를 저장한다. 저장소를 쓸 수 없으면 false를 돌려준다.
function saveBoard(storage, board) {
  try {
    storage.setItem(LEADERBOARD_KEY, JSON.stringify(board));
    return true;
  } catch {
    return false;
  }
}

// 2026-10-09 07:05 형식(브라우저 시각 기준)
function formatDate(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

// ===== 화면 =====
// 아래는 브라우저에서만 실행된다. index.html의 <section>을 보이거나 숨겨서 화면을 바꾼다.

const MODE_NAMES = { practice: "연습", speed: "스피드", hint: "힌트" };

// 지금 고른 모드와 카테고리, 진행 중인 판, 스피드 모드 타이머, 다시 풀기 상태, 순위표 화면에서 고른 표
const app = {
  mode: "practice",
  category: CATEGORIES[0],
  round: null,
  timerId: null,
  deadline: 0,
  firstRound: null, // 다시 풀기를 해도 점수는 이 판 기준이다.
  retryNumber: 0, // 0이면 처음 판, 1부터는 다시 풀기 회차
  boardMode: RANKED_MODES[0],
  boardCategory: CATEGORIES[0],
};

function byId(id) {
  return document.getElementById(id);
}

// questions.js를 읽지 못하면 undefined를 돌려준다.
// 문법 오류면 QUESTIONS가 아예 없고, 따옴표 없이 쓴 한글 값처럼 실행 중 오류가 나면
// QUESTIONS가 있어도 읽는 순간 오류가 나므로 try로 감싼다.
function readQuestions() {
  try {
    return QUESTIONS;
  } catch {
    return undefined;
  }
}

function setUpPage() {
  // questions.js를 읽지 못했거나 배열이 아니면 안내만 보여 준다.
  if (!Array.isArray(readQuestions())) {
    byId("load-error").hidden = false;
    byId("start-screen").hidden = true;
    return;
  }
  validateQuestions(QUESTIONS).forEach((message) => {
    console.warn(`[문항 검사] ${message}`);
  });

  makeOptionButtons("mode-buttons", Object.keys(MODE_NAMES), (mode) => MODE_NAMES[mode], (mode) => {
    app.mode = mode;
    updateStartScreen();
  });
  makeOptionButtons("category-buttons", CATEGORIES, (category) => category, (category) => {
    app.category = category;
    updateStartScreen();
  });
  byId("start-button").addEventListener("click", startNewRound);
  byId("next-button").addEventListener("click", nextQuestion);
  byId("hint-button").addEventListener("click", handleHint);
  byId("retry-wrong-button").addEventListener("click", startRetry);
  byId("replay-button").addEventListener("click", startNewRound);
  byId("home-button").addEventListener("click", () => showScreen("start-screen"));

  makeOptionButtons("board-mode-buttons", RANKED_MODES, (mode) => MODE_NAMES[mode], (mode) => {
    app.boardMode = mode;
    renderBoard();
  });
  makeOptionButtons("board-category-buttons", CATEGORIES, (category) => category, (category) => {
    app.boardCategory = category;
    renderBoard();
  });
  byId("board-button").addEventListener("click", showBoard);
  byId("board-home-button").addEventListener("click", () => showScreen("start-screen"));

  updateStartScreen();
}

// 하나만 고를 수 있는 버튼 묶음을 만든다. values의 값마다 버튼 하나를 만든다.
function makeOptionButtons(containerId, values, labelOf, onSelect) {
  const container = byId(containerId);
  values.forEach((value) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option";
    button.textContent = labelOf(value);
    button.dataset.value = value;
    button.addEventListener("click", () => onSelect(value));
    container.append(button);
  });
}

// 고른 버튼에만 aria-pressed="true"를 붙인다.
function markSelected(containerId, selectedValue) {
  byId(containerId).querySelectorAll("button").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.value === selectedValue));
  });
}

function updateStartScreen() {
  markSelected("mode-buttons", app.mode);
  markSelected("category-buttons", app.category);
  byId("start-notice").hidden = app.mode !== "practice";
  byId("start-error").hidden = true;
}

// 화면을 바꿀 때는 언제나 스피드 모드 타이머를 멈춘다.
function showScreen(id) {
  stopTimer();
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.hidden = screen.id !== id;
  });
}

function startNewRound() {
  const questions = QUESTIONS.filter((question) => question.category === app.category);
  if (questions.length === 0) {
    byId("start-error").hidden = false;
    return;
  }
  app.round = createRound(app.mode, app.category, prepareRound(questions));
  app.firstRound = app.round;
  app.retryNumber = 0;
  showScreen("quiz-screen");
  showQuestion();
}

// 바로 앞 판에서 틀린 문항만 순서와 보기를 다시 섞어서 푼다(연습 모드만).
function startRetry() {
  const wrong = wrongQuestions(app.round);
  app.round = createRound("practice", app.round.category, prepareRound(wrong));
  app.retryNumber += 1;
  showScreen("quiz-screen");
  showQuestion();
}

function showQuestion() {
  const round = app.round;
  const question = round.questions[round.index];
  const label = `${MODE_NAMES[round.mode]} 모드, ${round.category}`;
  byId("round-label").textContent =
    app.retryNumber > 0 ? `${label}, 다시 풀기 ${app.retryNumber}회차` : label;
  byId("progress").textContent = `${round.index + 1} / ${round.questions.length}`;
  byId("current-score").textContent = `점수 ${formatScore(roundScore(round))}`;
  byId("question-text").textContent = question.question;

  const choices = byId("choices");
  choices.replaceChildren();
  question.choices.forEach((text, i) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice";
    button.textContent = text;
    button.addEventListener("click", () => handleAnswer(i));
    choices.append(button);
  });
  byId("feedback").hidden = true;

  const hintButton = byId("hint-button");
  hintButton.hidden = round.mode !== "hint";
  hintButton.disabled = false;
  byId("timer").hidden = round.mode !== "speed";
  if (round.mode === "speed") {
    startTimer();
  }
}

// chosenIndex가 null이면 시간 초과다.
function handleAnswer(chosenIndex) {
  const result = answerCurrent(app.round, chosenIndex);
  if (!result) {
    return; // 이미 답한 문항
  }
  stopTimer(); // 해설이 보이는 동안 타이머를 멈춘다.
  byId("hint-button").disabled = true;
  showFeedback(result);
}

function handleHint() {
  const removed = useHint(app.round);
  if (!removed) {
    return;
  }
  const buttons = byId("choices").querySelectorAll("button");
  removed.forEach((i) => {
    buttons[i].disabled = true;
    buttons[i].classList.add("removed");
  });
  byId("hint-button").disabled = true;
}

function startTimer() {
  stopTimer();
  app.deadline = Date.now() + SPEED_SECONDS * 1000;
  updateTimer();
  app.timerId = setInterval(updateTimer, 200);
}

function updateTimer() {
  const left = remainingSeconds(app.deadline, Date.now());
  byId("timer").textContent = `남은 시간 ${left}초`;
  if (left === 0) {
    stopTimer();
    handleAnswer(null);
  }
}

function stopTimer() {
  clearInterval(app.timerId);
  app.timerId = null;
}

function showFeedback(result) {
  const round = app.round;
  byId("choices").querySelectorAll("button").forEach((button, i) => {
    button.disabled = true;
    if (i === result.question.answer) {
      button.classList.add("correct");
    } else if (i === result.chosenIndex) {
      button.classList.add("wrong");
    }
  });

  const resultLine = byId("feedback-result");
  resultLine.textContent = feedbackMessage(result);
  resultLine.className = result.correct ? "feedback-result is-correct" : "feedback-result is-wrong";
  byId("feedback-explanation").textContent = result.question.explanation;
  byId("feedback-source").textContent = `출처: ${result.question.source}`;
  byId("current-score").textContent = `점수 ${formatScore(roundScore(round))}`;

  const isLast = round.index === round.questions.length - 1;
  byId("next-button").textContent = isLast ? "결과 보기" : "다음";
  byId("feedback").hidden = false;
  byId("next-button").focus();
}

function feedbackMessage(result) {
  if (result.chosenIndex === null) {
    return "시간 초과로 오답입니다.";
  }
  if (!result.correct) {
    return "오답입니다.";
  }
  return result.points === 0.5 ? "정답입니다. 힌트를 써서 0.5점입니다." : "정답입니다.";
}

function nextQuestion() {
  if (goNext(app.round)) {
    showQuestion();
    return;
  }
  // 스피드 모드와 힌트 모드만 판이 끝날 때 한 번 기록한다.
  const saved = RANKED_MODES.includes(app.round.mode) ? recordResult(app.round) : null;
  showResult(saved);
}

// saved: 순위표에 기록했으면 true, 기록하지 못했으면 false, 기록 대상이 아니면 null
function showResult(saved) {
  const first = app.firstRound;
  const round = app.round;
  const total = first.questions.length;
  const correct = correctCount(first);
  const scoreText = `${formatScore(roundScore(first))} / ${total}`;
  byId("result-score").textContent = app.retryNumber > 0 ? `처음 점수 ${scoreText}` : scoreText;
  byId("result-detail").textContent = `${total}문제 중 ${correct}개 맞힘, ${total - correct}개 틀림`;
  byId("result-notice").hidden = round.mode !== "practice";

  const retryLine = byId("result-retry");
  retryLine.hidden = app.retryNumber === 0;
  retryLine.textContent =
    `다시 풀기 ${app.retryNumber}회차: ${round.questions.length}문제 중 ${correctCount(round)}개 맞힘`;

  const remaining = wrongQuestions(round).length;
  const retryButton = byId("retry-wrong-button");
  retryButton.hidden = round.mode !== "practice" || remaining === 0;
  retryButton.textContent = app.retryNumber === 0 ? "틀린 문제 다시 풀기" : "남은 문제 다시 풀기";
  byId("all-cleared").hidden = app.retryNumber === 0 || remaining > 0;

  const savedLine = byId("result-saved");
  savedLine.hidden = saved === null;
  savedLine.textContent = saved
    ? "순위표에 기록했습니다."
    : "이 브라우저에서는 순위표에 기록할 수 없습니다.";
  showScreen("result-screen");
}

// 브라우저 설정에 따라 localStorage에 접근하는 것만으로 오류가 날 수 있어 감싼다.
function browserStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

// 끝난 판의 점수를 순위표에 넣는다. 저장했으면 true를 돌려준다.
function recordResult(round) {
  const storage = browserStorage();
  const record = { score: roundScore(round), date: formatDate(new Date()) };
  const board = addRecord(loadBoard(storage), boardKey(round.mode, round.category), record);
  return saveBoard(storage, board);
}

function showBoard() {
  renderBoard();
  showScreen("leaderboard-screen");
}

function renderBoard() {
  markSelected("board-mode-buttons", app.boardMode);
  markSelected("board-category-buttons", app.boardCategory);
  const records = recordsFor(loadBoard(browserStorage()), boardKey(app.boardMode, app.boardCategory));

  const rows = byId("board-rows");
  rows.replaceChildren();
  records.forEach((record, i) => {
    const row = document.createElement("tr");
    [`${i + 1}위`, `${formatScore(record.score)}점`, record.date].forEach((text) => {
      const cell = document.createElement("td");
      cell.textContent = text;
      row.append(cell);
    });
    rows.append(row);
  });
  byId("board-table").hidden = records.length === 0;
  byId("board-empty").hidden = records.length > 0;
}

if (typeof document !== "undefined") {
  setUpPage();
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
    useHint,
    SPEED_SECONDS,
    remainingSeconds,
    LEADERBOARD_KEY,
    boardKey,
    recordsFor,
    addRecord,
    loadBoard,
    saveBoard,
    formatDate,
  };
}
