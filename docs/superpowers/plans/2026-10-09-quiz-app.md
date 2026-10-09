<!-- 2026-10-09 22:15 KST -->

# 상식 퀴즈 웹 앱 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 서버 없이 `index.html`을 열면 동작하는 4지선다 상식 퀴즈(연습, 스피드, 힌트 모드와 순위표)를 만든다.

**Architecture:** `script.js`를 "규칙" 부분과 "화면" 부분으로 나눈다. 규칙 부분은 DOM을 쓰지 않는 순수 함수(섞기, 채점, 힌트, 남은 시간, 순위표)라서 Node 테스트로 검사하고, 화면 부분은 `index.html`에 미리 둔 `<section>`을 보이거나 숨기며 규칙 함수를 부른다. 문항은 `questions.js`의 전역 상수 `QUESTIONS`에 두고, `file://`에서도 동작하도록 일반 `<script>` 태그로 불러온다.

**Tech Stack:** HTML, CSS, 바닐라 JavaScript(브라우저), Node.js 24 내장 테스트 러너(`node --test`, `node:assert/strict`)

**Spec:** `PRD.md`

## Global Constraints

- 앱 파일은 `index.html`, `style.css`, `script.js`, `questions.js` 4개다. 테스트는 개발용으로 `tests/` 폴더에 따로 둔다(사용자 결정).
- `file://`로 열어 동작해야 한다. `fetch`와 ES 모듈(`<script type="module">`, `import`, `export`)을 쓰지 않는다.
- `index.html`은 `questions.js`, `script.js` 순서로 일반 `<script>` 태그로 불러온다.
- 외부 라이브러리, 빌드 도구, `package.json`을 쓰지 않는다. 테스트는 Node 내장 기능만 쓴다.
- 휴대폰 화면 폭(약 360px)에서도 읽고 누를 수 있어야 한다.
- 문항 데이터는 `textContent`로만 화면에 넣는다. `innerHTML`을 쓰지 않는다.
- 연습 모드 안내 문구는 정확히 `순위표에 기록되지 않음`이다.
- 점수 표시: 정수면 `7`, 0.5가 있으면 `7.5`. 결과는 `7.5 / 10` 형식이다.
- localStorage 키는 `quizLeaderboard` 하나, 값은 `{ "speed:한국사": [{ score, date }], ... }` 형식, 날짜는 `YYYY-MM-DD HH:MM`이다.
- 사용자에게 보이는 한국어 문구: 열거에는 가운뎃점 대신 쉼표를 쓰고, 완결된 문장은 마침표로 끝내고, 버튼과 제목 같은 라벨에는 마침표를 붙이지 않고, 보조용언은 띄어 쓴다("확인해 주세요").
- 새로 만드는 파일은 첫 줄에 생성 일시 주석을 단다. 일시는 `TZ=KST-9 date "+%Y-%m-%d %H:%M"`(Git Bash)로 확인하고 `2026-10-09 22:15 KST` 형식으로 쓴다. 아래 코드의 `<생성 일시>`는 이 명령의 결과로 바꿔 쓴다. 기존 파일을 고칠 때는 달지 않는다.
- 커밋 메시지 끝에는 `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` 줄을 붙인다.

## 테스트와 확인 방법

- **규칙 함수**: 프로젝트 폴더에서 `node --test`를 실행한다. Node가 `tests/*.test.js`를 찾아 돌린다. `tests/helpers.js`는 이름이 테스트 패턴에 맞지 않아 테스트로 실행되지 않는다.
- **화면**: `index.html`을 `file://`로 직접 연다. 앱 안 브라우저에서는 `file:///C:/Users/ckei/Desktop/5장%20실습/study03_quiz/index.html`로 이동한다. 앱 안 브라우저가 `file://` 주소를 열지 못하면, 로컬 서버로 대신하지 말고 사용자에게 파일을 직접 열어 확인 목록대로 눌러 봐 달라고 요청한다. `file://` 제약을 확인하는 것이 목적이기 때문이다.
- 임시 문항은 정답 보기 글자가 항상 `정답 보기`라서, 섞인 뒤에도 어느 것이 정답인지 눈으로 알 수 있다.

## Review Focus

PRD가 직접 말하지 않지만 사용자가 실제로 겪기 쉬운 문제 5가지와, 각각을 확인하는 곳이다.

1. **같은 문항에 답이 두 번 들어감**(보기를 연달아 누름, 스피드 모드에서 0초가 되는 순간 보기를 누름): 첫 답만 반영해야 한다. → Task 3 테스트 "이미 답한 문항에 다시 답하면 무시한다"
2. **스피드 타이머가 화면을 떠난 뒤에도 돎**(결과 화면으로 넘어간 뒤, [다시 하기]로 새 판을 시작한 직후): 퀴즈 화면을 떠나면 타이머가 멈추고, 새 문항은 언제나 15초부터 세야 한다. → Task 6 브라우저 확인 6, 7
3. **사용자가 `questions.js`를 고치다 문법 오류를 냄**: 빈 화면 대신 "문항 파일(questions.js)을 읽지 못했습니다." 안내가 보여야 한다. → Task 4 브라우저 확인 9
4. **localStorage를 쓸 수 없거나 값이 깨짐**(사생활 보호 설정, 직접 고친 값): 앱이 멈추지 않고 빈 순위표로 시작하며, 저장하지 못했으면 결과 화면에 알려야 한다. → Task 8 테스트 "저장소를 쓸 수 없어도 멈추지 않는다", "loadBoard는 ... 깨져 있으면", Task 9 브라우저 확인 6
5. **다시 풀기를 여러 회차 한 뒤 [다시 하기]를 누름**: 남은 오답 판이 아니라 처음 카테고리의 10문항으로 새 판을 시작하고, 회차 표시도 사라져야 한다. → Task 7 브라우저 확인 6

---

## 파일 구조

| 파일 | 만드는 Task | 역할 |
|---|---|---|
| `questions.js` | 1 | 문항 데이터 `QUESTIONS`만 둔다. 지금은 임시 문항 40개다. |
| `script.js` | 1에서 만들고 2~9에서 고침 | 위쪽 `// ===== 규칙 =====`: 순수 함수. 아래쪽 `// ===== 화면 =====`: DOM 처리. 맨 끝: Node 테스트용 `module.exports` |
| `index.html` | 4에서 만들고 6, 7, 9에서 고침 | 시작, 퀴즈, 결과, 순위표 화면의 `<section>` |
| `style.css` | 4에서 만들고 6, 9에서 고침 | 모양 |
| `tests/helpers.js` | 1 | 테스트 도우미: `loadQuestions`, `makeQuestion`, `makeValidSet` |
| `tests/questions.test.js` | 1 | 문항 형식 검사 테스트 |
| `tests/round.test.js` | 2 | 섞기와 판 준비 테스트 |
| `tests/scoring.test.js` | 3 | 판 진행과 채점 테스트 |
| `tests/hint-timer.test.js` | 5 | 힌트와 남은 시간 테스트 |
| `tests/leaderboard.test.js` | 8 | 순위표 테스트 |

`script.js`의 최종 모양은 다음 순서다. 규칙 함수를 새로 넣을 때는 `// ===== 화면 =====` 줄 바로 위에(그 줄이 아직 없으면 `module.exports` 블록 바로 위에) 넣는다.

```
// 생성 일시, 파일 설명
// ===== 규칙 =====
상수, validateQuestions, isFilled                       (Task 1)
shuffle, prepareQuestion, prepareRound                  (Task 2)
scoreAnswer, formatScore, createRound, answerCurrent,
goNext, roundScore, correctCount, wrongQuestions        (Task 3)
useHint, SPEED_SECONDS, remainingSeconds                (Task 5)
LEADERBOARD_*, RANKED_MODES, boardKey, recordsFor,
addRecord, loadBoard, saveBoard, formatDate             (Task 8)
// ===== 화면 =====
MODE_NAMES, app, byId, setUpPage, ...                   (Task 4, 6, 7, 9)
if (typeof document !== "undefined") { setUpPage(); }
if (typeof module !== "undefined") { module.exports = {...}; }
```

---

## 1단계: 연습 모드와 점수

### Task 1: 저장소 준비, 문항 형식 검사, 임시 문항

**Files:**
- Create: `script.js`, `questions.js`, `tests/helpers.js`, `tests/questions.test.js`
- Commit: `PRD.md`, `docs/superpowers/plans/2026-10-09-quiz-app.md`(이 문서)

**Interfaces:**
- Consumes: 없음
- Produces:
  - `CATEGORIES: string[]` = `["한국사", "세계지리", "과학", "예술과 문화"]`
  - `validateQuestions(questions: any): string[]` 문제마다 완결된 문장 하나. 문제가 없으면 `[]`
  - 전역 `QUESTIONS: Array<{ id, category, question, choices: string[4], answer: 0..3, explanation, source }>`
  - `tests/helpers.js`: `loadQuestions(): QUESTIONS`, `makeQuestion(overrides?): 문항`(정답은 0번 `"정답"`), `makeValidSet(): 문항[40]`(id는 `c0-1`~`c3-10`)

- [ ] **Step 1: git 저장소를 만들고 문서를 커밋한다**

```bash
git init
git add PRD.md docs/superpowers/plans/2026-10-09-quiz-app.md
git commit -m "docs: PRD와 구현 계획 추가" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

git 사용자 이름이나 이메일이 설정되지 않아 커밋이 실패하면, 임의로 설정하지 말고 사용자에게 알린다.

- [ ] **Step 2: 테스트 도우미를 만든다**

`tests/helpers.js`:

```js
// <생성 일시> KST
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
    source: "출처",
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
```

- [ ] **Step 3: 실패하는 테스트를 쓴다**

`tests/questions.test.js`:

```js
// <생성 일시> KST
const test = require("node:test");
const assert = require("node:assert/strict");
const { validateQuestions } = require("../script.js");
const { loadQuestions, makeQuestion, makeValidSet } = require("./helpers.js");

test("형식이 올바른 40문항이면 경고가 없다", () => {
  assert.deepEqual(validateQuestions(makeValidSet()), []);
});

test("배열이 아니면 경고한다", () => {
  assert.deepEqual(validateQuestions(undefined), ["QUESTIONS가 배열이 아닙니다."]);
});

test("보기가 4개가 아니면 경고한다", () => {
  const set = makeValidSet();
  set[0] = makeQuestion({ id: "c0-1", choices: ["가", "나", "다"] });
  assert.deepEqual(validateQuestions(set), ["c0-1: 보기가 4개가 아닙니다."]);
});

test("answer가 0~3 사이의 정수가 아니면 경고한다", () => {
  for (const answer of [4, -1, 1.5, "0", undefined]) {
    const set = makeValidSet();
    set[0] = makeQuestion({ id: "c0-1", answer });
    assert.deepEqual(
      validateQuestions(set),
      ["c0-1: answer는 0~3 사이의 정수여야 합니다."],
      `answer: ${answer}`,
    );
  }
});

test("해설이나 출처가 비어 있으면 경고한다", () => {
  const set = makeValidSet();
  set[0] = makeQuestion({ id: "c0-1", explanation: "  " });
  set[1] = makeQuestion({ id: "c0-2", source: "" });
  assert.deepEqual(validateQuestions(set), [
    "c0-1: 해설(explanation)이 비어 있습니다.",
    "c0-2: 출처(source)가 비어 있습니다.",
  ]);
});

test("id가 비어 있거나 겹치면 경고한다", () => {
  const set = makeValidSet();
  set[0] = makeQuestion({ id: "" });
  set[2] = makeQuestion({ id: "c0-2" });
  assert.deepEqual(validateQuestions(set), [
    "1번째 문항: id가 비어 있습니다.",
    "c0-2: id가 다른 문항과 겹칩니다.",
  ]);
});

test("카테고리가 4개 중 하나가 아니거나 개수가 10개가 아니면 경고한다", () => {
  const set = makeValidSet();
  set[0] = makeQuestion({ id: "c0-1", category: "역사" });
  assert.deepEqual(validateQuestions(set), [
    'c0-1: 카테고리 "역사"는 정해진 4개 중 하나가 아닙니다.',
    '카테고리 "한국사"의 문항이 9개입니다. 10개여야 합니다.',
  ]);
});

test("questions.js의 문항은 형식 검사를 통과한다", () => {
  assert.deepEqual(validateQuestions(loadQuestions()), []);
});
```

- [ ] **Step 4: 테스트가 실패하는지 확인한다**

Run: `node --test`
Expected: FAIL. `Cannot find module '../script.js'`

- [ ] **Step 5: `script.js`에 형식 검사를 만든다**

`script.js`:

```js
// <생성 일시> KST
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

// Node 테스트에서 규칙 함수를 불러 쓰기 위한 부분이다. 브라우저에는 module이 없어 실행되지 않는다.
if (typeof module !== "undefined") {
  module.exports = { CATEGORIES, validateQuestions };
}
```

- [ ] **Step 6: questions.js만 없어서 실패하는지 확인한다**

Run: `node --test`
Expected: 7개 PASS, "questions.js의 문항은 형식 검사를 통과한다" 1개만 FAIL(`ENOENT`)

- [ ] **Step 7: 임시 문항 40개로 `questions.js`를 만든다**

아래 스크립트를 스크래치 폴더에 `make-temp-questions.js`로 저장하고, 프로젝트 폴더를 현재 폴더로 두고 한 번 실행한 뒤 스크립트는 지운다. 인자로 생성 일시를 넘긴다.

```js
// 임시 문항 40개로 questions.js를 만드는 일회용 스크립트
const fs = require("node:fs");

const categories = [
  ["korean-history", "한국사"],
  ["world-geography", "세계지리"],
  ["science", "과학"],
  ["arts-culture", "예술과 문화"],
];
const createdAt = process.argv[2];

const items = [];
for (const [prefix, name] of categories) {
  for (let n = 1; n <= 10; n += 1) {
    items.push([
      "  {",
      `    id: "${prefix}-${String(n).padStart(2, "0")}",`,
      `    category: "${name}",`,
      `    question: "${name} 임시 문항 ${n}",`,
      '    choices: ["정답 보기", "오답 보기 1", "오답 보기 2", "오답 보기 3"],',
      "    answer: 0,",
      `    explanation: "${name} 임시 문항 ${n}의 해설입니다.",`,
      '    source: "임시 출처"',
      "  }",
    ].join("\n"));
  }
}

const lines = [
  `// ${createdAt} KST`,
  "// 문항 데이터. 형식과 작성 규칙은 PRD.md 4장을 따른다.",
  "// 지금은 형식만 맞춘 임시 문항이다. 진짜 문항으로 바꿔 넣는다.",
  "const QUESTIONS = [",
  items.join(",\n"),
  "];",
  "",
];
fs.writeFileSync("questions.js", lines.join("\n"));
```

```bash
node "<스크래치 폴더>/make-temp-questions.js" "$(TZ=KST-9 date '+%Y-%m-%d %H:%M')"
```

만들어진 `questions.js`의 첫 문항은 다음과 같아야 한다.

```js
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
```

- [ ] **Step 8: 테스트가 모두 통과하는지 확인한다**

Run: `node --test`
Expected: 8개 모두 PASS

- [ ] **Step 9: 커밋한다**

```bash
git add script.js questions.js tests/helpers.js tests/questions.test.js
git commit -m "feat: 문항 형식 검사와 임시 문항 추가" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

### Task 2: 문항과 보기 섞기

**Files:**
- Modify: `script.js` (규칙 부분 끝과 `module.exports`)
- Create: `tests/round.test.js`

**Interfaces:**
- Consumes: `tests/helpers.js`의 `makeQuestion`
- Produces:
  - `shuffle(items: T[], random = Math.random): T[]` 새 배열. 원래 배열은 그대로
  - `prepareQuestion(question, random = Math.random): 문항` 보기를 섞고 `answer`를 섞인 위치로 옮긴 사본
  - `prepareRound(questions, random = Math.random): 문항[]` 문항 순서와 각 문항의 보기 순서를 섞은 사본

- [ ] **Step 1: 실패하는 테스트를 쓴다**

`tests/round.test.js`:

```js
// <생성 일시> KST
const test = require("node:test");
const assert = require("node:assert/strict");
const { shuffle, prepareQuestion, prepareRound } = require("../script.js");
const { makeQuestion } = require("./helpers.js");

test("shuffle은 원래 배열을 바꾸지 않고 같은 원소를 가진 새 배열을 돌려준다", () => {
  const items = ["a", "b", "c", "d"];
  const result = shuffle(items);
  assert.deepEqual(items, ["a", "b", "c", "d"]);
  assert.notEqual(result, items);
  assert.deepEqual([...result].sort(), ["a", "b", "c", "d"]);
});

test("shuffle은 random 값에 따라 순서를 바꾼다", () => {
  assert.deepEqual(shuffle(["a", "b", "c", "d"], () => 0), ["b", "c", "d", "a"]);
  assert.deepEqual(shuffle(["a", "b", "c", "d"], () => 0.999), ["a", "b", "c", "d"]);
});

test("prepareQuestion은 보기를 섞고 정답 위치를 함께 옮긴다", () => {
  const question = makeQuestion();
  const prepared = prepareQuestion(question, () => 0);
  assert.deepEqual(prepared.choices, ["오답1", "오답2", "오답3", "정답"]);
  assert.equal(prepared.answer, 3);
  assert.equal(prepared.id, question.id);
  assert.deepEqual(question.choices, ["정답", "오답1", "오답2", "오답3"]);
  assert.equal(question.answer, 0);
});

test("prepareQuestion은 몇 번을 섞어도 정답 보기를 정확히 가리킨다", () => {
  const question = makeQuestion({ choices: ["오답1", "오답2", "정답", "오답3"], answer: 2 });
  for (let i = 0; i < 200; i += 1) {
    const prepared = prepareQuestion(question);
    assert.equal(prepared.choices[prepared.answer], "정답");
  }
});

test("prepareRound는 문항 순서와 보기 순서를 함께 섞는다", () => {
  const questions = [1, 2, 3, 4].map((n) => makeQuestion({ id: `q-${n}` }));
  const round = prepareRound(questions, () => 0);
  assert.deepEqual(round.map((q) => q.id), ["q-2", "q-3", "q-4", "q-1"]);
  round.forEach((q) => {
    assert.equal(q.choices[q.answer], "정답");
  });
  assert.deepEqual(questions.map((q) => q.id), ["q-1", "q-2", "q-3", "q-4"]);
});
```

- [ ] **Step 2: 테스트가 실패하는지 확인한다**

Run: `node --test tests/round.test.js`
Expected: FAIL. `shuffle is not a function`

- [ ] **Step 3: 섞기 함수를 만든다**

`script.js`의 `module.exports` 블록 바로 위에 넣는다.

```js
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
```

`module.exports` 블록을 다음으로 바꾼다.

```js
if (typeof module !== "undefined") {
  module.exports = { CATEGORIES, validateQuestions, shuffle, prepareQuestion, prepareRound };
}
```

- [ ] **Step 4: 테스트가 통과하는지 확인한다**

Run: `node --test`
Expected: 13개 모두 PASS

- [ ] **Step 5: 커밋한다**

```bash
git add script.js tests/round.test.js
git commit -m "feat: 문항과 보기 섞기" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

### Task 3: 판 진행과 채점

**Files:**
- Modify: `script.js` (규칙 부분 끝과 `module.exports`)
- Create: `tests/scoring.test.js`

**Interfaces:**
- Consumes: `tests/helpers.js`의 `makeQuestion`
- Produces:
  - `scoreAnswer(correct: boolean, usedHint: boolean): 0 | 0.5 | 1`
  - `formatScore(score: number): string` `7` → `"7"`, `7.5` → `"7.5"`
  - `createRound(mode: "practice"|"speed"|"hint", category: string, questions: 문항[]): Round`
    - `Round = { mode, category, questions, index: number, usedHint: boolean, results: Result[] }`
  - `answerCurrent(round, chosenIndex: number | null): Result | null` `null`은 시간 초과. 이미 답한 문항이면 `null`
    - `Result = { question, chosenIndex, correct: boolean, points: number }`
  - `goNext(round): boolean` 다음 문항이 있으면 `true`. `usedHint`를 `false`로 되돌린다
  - `roundScore(round): number`, `correctCount(round): number`, `wrongQuestions(round): 문항[]`

- [ ] **Step 1: 실패하는 테스트를 쓴다**

`tests/scoring.test.js`:

```js
// <생성 일시> KST
const test = require("node:test");
const assert = require("node:assert/strict");
const {
  scoreAnswer,
  formatScore,
  createRound,
  answerCurrent,
  goNext,
  roundScore,
  correctCount,
  wrongQuestions,
} = require("../script.js");
const { makeQuestion } = require("./helpers.js");

// 정답은 모두 0번 보기다.
function makeRound(mode = "practice", count = 3) {
  const questions = Array.from({ length: count }, (_, i) => makeQuestion({ id: `q-${i + 1}` }));
  return createRound(mode, "한국사", questions);
}

test("scoreAnswer: 맞히면 1점, 힌트를 쓰고 맞히면 0.5점, 틀리면 0점이다", () => {
  assert.equal(scoreAnswer(true, false), 1);
  assert.equal(scoreAnswer(true, true), 0.5);
  assert.equal(scoreAnswer(false, false), 0);
  assert.equal(scoreAnswer(false, true), 0);
});

test("formatScore는 정수면 정수로, 0.5가 있으면 소수 한 자리로 보여 준다", () => {
  assert.equal(formatScore(7), "7");
  assert.equal(formatScore(7.5), "7.5");
  assert.equal(formatScore(0), "0");
  assert.equal(formatScore(10), "10");
});

test("createRound는 첫 문항에서 시작한다", () => {
  const round = makeRound("speed");
  assert.equal(round.mode, "speed");
  assert.equal(round.category, "한국사");
  assert.equal(round.index, 0);
  assert.equal(round.usedHint, false);
  assert.deepEqual(round.results, []);
});

test("answerCurrent는 정답 여부와 점수를 기록한다", () => {
  const round = makeRound();
  const result = answerCurrent(round, 0);
  assert.equal(result.correct, true);
  assert.equal(result.points, 1);
  assert.equal(result.chosenIndex, 0);
  assert.equal(result.question.id, "q-1");
  assert.equal(roundScore(round), 1);
});

test("answerCurrent에 null을 넘기면 시간 초과로 0점이다", () => {
  const round = makeRound("speed");
  const result = answerCurrent(round, null);
  assert.equal(result.correct, false);
  assert.equal(result.points, 0);
  assert.equal(result.chosenIndex, null);
});

test("힌트를 쓴 문항을 맞히면 0.5점이다", () => {
  const round = makeRound("hint");
  round.usedHint = true;
  assert.equal(answerCurrent(round, 0).points, 0.5);
});

test("이미 답한 문항에 다시 답하면 무시한다", () => {
  const round = makeRound("speed");
  answerCurrent(round, 1);
  assert.equal(answerCurrent(round, 0), null);
  assert.equal(answerCurrent(round, null), null);
  assert.equal(round.results.length, 1);
  assert.equal(roundScore(round), 0);
});

test("goNext는 다음 문항으로 넘기고 힌트 사용 여부를 되돌린다", () => {
  const round = makeRound("hint", 2);
  round.usedHint = true;
  answerCurrent(round, 0);
  assert.equal(goNext(round), true);
  assert.equal(round.index, 1);
  assert.equal(round.usedHint, false);
  answerCurrent(round, 0);
  assert.equal(goNext(round), false);
});

test("한 판의 점수, 맞힌 수, 틀린 문항을 센다", () => {
  const round = makeRound("hint", 4);
  answerCurrent(round, 0); // 1점
  goNext(round);
  round.usedHint = true;
  answerCurrent(round, 0); // 0.5점
  goNext(round);
  answerCurrent(round, 2); // 오답
  goNext(round);
  answerCurrent(round, null); // 시간 초과
  goNext(round);
  assert.equal(roundScore(round), 1.5);
  assert.equal(correctCount(round), 2);
  assert.deepEqual(wrongQuestions(round).map((q) => q.id), ["q-3", "q-4"]);
});
```

- [ ] **Step 2: 테스트가 실패하는지 확인한다**

Run: `node --test tests/scoring.test.js`
Expected: FAIL. `scoreAnswer is not a function`

- [ ] **Step 3: 판 진행과 채점 함수를 만든다**

`script.js`의 `module.exports` 블록 바로 위에 넣는다.

```js
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
```

`module.exports` 블록을 다음으로 바꾼다.

```js
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
```

- [ ] **Step 4: 테스트가 통과하는지 확인한다**

Run: `node --test`
Expected: 22개 모두 PASS

- [ ] **Step 5: 커밋한다**

```bash
git add script.js tests/scoring.test.js
git commit -m "feat: 판 진행과 채점 규칙" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

### Task 4: 1단계 화면(연습 모드)

**Files:**
- Create: `index.html`, `style.css`
- Modify: `script.js` (규칙 부분과 `module.exports` 사이에 화면 부분 추가)

**Interfaces:**
- Consumes: `CATEGORIES`, `validateQuestions`, `prepareRound`, `createRound`, `answerCurrent`, `goNext`, `roundScore`, `correctCount`, `formatScore`, 전역 `QUESTIONS`
- Produces (뒤 Task가 고치는 화면 함수와 상태):
  - `MODE_NAMES = { practice: "연습", speed: "스피드", hint: "힌트" }`
  - `app = { mode, category, round }`
  - `byId(id)`, `setUpPage()`, `makeOptionButtons(containerId, values, labelOf, onSelect)`, `markSelected(containerId, selectedValue)`, `updateStartScreen()`, `showScreen(id)`, `startNewRound()`, `showQuestion()`, `handleAnswer(chosenIndex)`, `showFeedback(result)`, `feedbackMessage(result)`, `nextQuestion()`, `showResult()`
  - HTML id: `load-error`, `start-screen`, `category-buttons`, `start-notice`, `start-button`, `quiz-screen`, `round-label`, `progress`, `current-score`, `question-text`, `choices`, `feedback`, `feedback-result`, `feedback-explanation`, `feedback-source`, `next-button`, `result-screen`, `result-score`, `result-detail`, `result-notice`, `replay-button`, `home-button`

1단계에는 모드 선택이 없다. `app.mode`는 `"practice"`로 고정되고, 시작 화면에서 카테고리를 고른 뒤 [시작]을 누른다. 화면 코드는 Node 테스트 대상이 아니므로 브라우저 확인으로 검증한다.

- [ ] **Step 1: `index.html`을 만든다**

```html
<!-- <생성 일시> KST -->
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>상식 퀴즈</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main class="app">
    <h1>상식 퀴즈</h1>
    <p id="load-error" class="error" hidden>문항 파일(questions.js)을 읽지 못했습니다. 브라우저 콘솔에서 오류를 확인해 주세요.</p>

    <!-- 시작 화면 -->
    <section id="start-screen" class="screen">
      <h2>카테고리</h2>
      <div id="category-buttons" class="button-grid"></div>
      <p id="start-notice" class="notice">순위표에 기록되지 않음</p>
      <button id="start-button" class="primary" type="button">시작</button>
    </section>

    <!-- 퀴즈 화면 -->
    <section id="quiz-screen" class="screen" hidden>
      <p id="round-label" class="round-label"></p>
      <div class="quiz-header">
        <span id="progress"></span>
        <span id="current-score"></span>
      </div>
      <p id="question-text" class="question"></p>
      <div id="choices" class="choices"></div>
      <div id="feedback" class="feedback" hidden>
        <p id="feedback-result" class="feedback-result"></p>
        <p id="feedback-explanation"></p>
        <p id="feedback-source" class="source"></p>
        <button id="next-button" class="primary" type="button">다음</button>
      </div>
    </section>

    <!-- 결과 화면 -->
    <section id="result-screen" class="screen" hidden>
      <h2>결과</h2>
      <p id="result-score" class="result-score"></p>
      <p id="result-detail"></p>
      <p id="result-notice" class="notice">순위표에 기록되지 않음</p>
      <div class="actions">
        <button id="replay-button" type="button">다시 하기</button>
        <button id="home-button" type="button">처음으로</button>
      </div>
    </section>
  </main>

  <script src="questions.js"></script>
  <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: `style.css`를 만든다**

```css
/* <생성 일시> KST */

:root {
  --bg: #f6f7fb;
  --card: #ffffff;
  --text: #1f2430;
  --muted: #5d6475;
  --line: #d9dce5;
  --accent: #3157d5;
  --correct: #1f7a45;
  --correct-bg: #e3f5ea;
  --wrong: #b42828;
  --wrong-bg: #fdeaea;
}

* {
  box-sizing: border-box;
}

/* display를 지정한 요소도 hidden이면 숨긴다. */
[hidden] {
  display: none !important;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: system-ui, -apple-system, "Segoe UI", "Malgun Gothic", sans-serif;
  line-height: 1.6;
}

.app {
  max-width: 640px;
  margin: 0 auto;
  padding: 24px 16px 48px;
}

h1 {
  font-size: 1.6rem;
  margin: 0 0 16px;
}

h2 {
  font-size: 1.1rem;
  margin: 24px 0 8px;
}

button {
  font: inherit;
  padding: 10px 16px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--card);
  color: var(--text);
  cursor: pointer;
}

button:disabled {
  cursor: default;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 8px;
}

.option[aria-pressed="true"] {
  border-color: var(--accent);
  background: var(--accent);
  color: #ffffff;
}

.primary {
  width: 100%;
  margin-top: 16px;
  border-color: var(--accent);
  background: var(--accent);
  color: #ffffff;
  font-weight: 600;
}

.notice {
  color: var(--muted);
  font-size: 0.95rem;
}

.error {
  color: var(--wrong);
  font-weight: 600;
}

.round-label {
  margin: 0;
  color: var(--muted);
  font-size: 0.9rem;
}

.quiz-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px;
  color: var(--muted);
}

.question {
  margin: 16px 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.choices {
  display: grid;
  gap: 8px;
}

.choice {
  text-align: left;
}

.choice.correct {
  border-color: var(--correct);
  background: var(--correct-bg);
  color: var(--correct);
  font-weight: 600;
}

.choice.wrong {
  border-color: var(--wrong);
  background: var(--wrong-bg);
  color: var(--wrong);
}

.feedback {
  margin-top: 16px;
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--card);
}

.feedback p {
  margin: 0 0 8px;
}

.feedback-result {
  font-weight: 700;
}

.feedback-result.is-correct {
  color: var(--correct);
}

.feedback-result.is-wrong {
  color: var(--wrong);
}

.source {
  color: var(--muted);
  font-size: 0.9rem;
}

.result-score {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 24px;
}
```

- [ ] **Step 3: `script.js`에 화면 부분을 넣는다**

규칙 부분의 마지막 함수(`wrongQuestions`)와 `module.exports` 블록 사이에 넣는다.

```js
// ===== 화면 =====
// 아래는 브라우저에서만 실행된다. index.html의 <section>을 보이거나 숨겨서 화면을 바꾼다.

const MODE_NAMES = { practice: "연습", speed: "스피드", hint: "힌트" };

// 지금 고른 모드와 카테고리, 진행 중인 판
const app = {
  mode: "practice",
  category: CATEGORIES[0],
  round: null,
};

function byId(id) {
  return document.getElementById(id);
}

function setUpPage() {
  // questions.js에 문법 오류가 있으면 QUESTIONS가 만들어지지 않는다.
  if (typeof QUESTIONS === "undefined") {
    byId("load-error").hidden = false;
    byId("start-screen").hidden = true;
    return;
  }
  validateQuestions(QUESTIONS).forEach((message) => {
    console.warn(`[문항 검사] ${message}`);
  });

  makeOptionButtons("category-buttons", CATEGORIES, (category) => category, (category) => {
    app.category = category;
    updateStartScreen();
  });
  byId("start-button").addEventListener("click", startNewRound);
  byId("next-button").addEventListener("click", nextQuestion);
  byId("replay-button").addEventListener("click", startNewRound);
  byId("home-button").addEventListener("click", () => showScreen("start-screen"));

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
  markSelected("category-buttons", app.category);
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.hidden = screen.id !== id;
  });
}

function startNewRound() {
  const questions = QUESTIONS.filter((question) => question.category === app.category);
  app.round = createRound(app.mode, app.category, prepareRound(questions));
  showScreen("quiz-screen");
  showQuestion();
}

function showQuestion() {
  const round = app.round;
  const question = round.questions[round.index];
  byId("round-label").textContent = `${MODE_NAMES[round.mode]} 모드, ${round.category}`;
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
}

// chosenIndex가 null이면 시간 초과다.
function handleAnswer(chosenIndex) {
  const result = answerCurrent(app.round, chosenIndex);
  if (!result) {
    return; // 이미 답한 문항
  }
  showFeedback(result);
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
  return result.correct ? "정답입니다." : "오답입니다.";
}

function nextQuestion() {
  if (goNext(app.round)) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  const round = app.round;
  const total = round.questions.length;
  const correct = correctCount(round);
  byId("result-score").textContent = `${formatScore(roundScore(round))} / ${total}`;
  byId("result-detail").textContent = `${total}문제 중 ${correct}개 맞힘, ${total - correct}개 틀림`;
  byId("result-notice").hidden = round.mode !== "practice";
  showScreen("result-screen");
}

if (typeof document !== "undefined") {
  setUpPage();
}
```

- [ ] **Step 4: Node 테스트가 여전히 통과하는지 확인한다**

Run: `node --test`
Expected: 22개 모두 PASS. 화면 부분은 `document`가 없어서 Node에서 실행되지 않는다.

- [ ] **Step 5: 브라우저에서 확인한다 (PRD 8장 1단계 확인 목록)**

`index.html`을 `file://`로 열고 다음을 확인한다.

1. 콘솔에 `[문항 검사]` 경고와 오류가 없다.
2. 카테고리 4개 버튼이 보이고, 처음에는 "한국사"가 선택되어 있다. 다른 카테고리를 누르면 선택 표시가 옮겨 간다.
3. 각 카테고리로 시작하면 그 카테고리 문항("세계지리 임시 문항 3" 등)만 10개 나오고, 진행 표시가 `1 / 10`부터 `10 / 10`까지 오른다.
4. 판을 끝내고 [다시 하기]로 두세 판 해 보면 문항 순서와 `정답 보기`의 위치가 판마다 바뀐다.
5. `정답 보기`를 누르면 그 보기가 초록, "정답입니다."가 보이고 점수가 1 오른다. 다른 보기를 누르면 그 보기는 빨강, `정답 보기`는 초록, "오답입니다."가 보인다. 두 경우 모두 해설, "출처: 임시 출처", [다음]이 보이고 다른 보기는 눌리지 않는다.
6. 마지막 문항에서는 버튼이 [결과 보기]이고, 결과 화면의 점수, 맞힌 수, 틀린 수가 실제와 맞는다(예: 7개 맞히면 `7 / 10`, "10문제 중 7개 맞힘, 3개 틀림").
7. 시작 화면과 결과 화면에 "순위표에 기록되지 않음"이 보인다.
8. [다시 하기]는 같은 카테고리로 새 판을, [처음으로]는 시작 화면을 보여 준다.
9. (Review Focus 3) `questions.js`의 첫 문항에서 `},`의 쉼표를 지워 문법 오류를 낸 뒤 새로 고치면, "문항 파일(questions.js)을 읽지 못했습니다. 브라우저 콘솔에서 오류를 확인해 주세요."만 보인다. 확인 후 쉼표를 되돌린다.
10. 첫 문항의 `choices`에서 보기 하나를 지우고 새로 고치면 콘솔에 `[문항 검사] korean-history-01: 보기가 4개가 아닙니다.`가 나온다. 확인 후 되돌린다.
11. 창 폭을 375px로 줄여도 가로 스크롤 없이 읽고 누를 수 있다.

9, 10을 되돌린 뒤 `node --test`가 22개 모두 PASS인지 다시 확인한다.

- [ ] **Step 6: 커밋한다**

```bash
git add index.html style.css script.js
git commit -m "feat: 1단계 연습 모드 화면" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## 2단계: 스피드 모드, 힌트 모드, 모드 선택, 틀린 문제 다시 풀기

### Task 5: 힌트와 남은 시간 규칙

**Files:**
- Modify: `script.js` (`// ===== 화면 =====` 줄 바로 위, `module.exports`)
- Create: `tests/hint-timer.test.js`

**Interfaces:**
- Consumes: `shuffle`, `createRound`, `answerCurrent`, `tests/helpers.js`의 `makeQuestion`
- Produces:
  - `useHint(round, random = Math.random): number[] | null` 지울 오답 보기 위치 2개. 이미 힌트를 썼거나 답한 문항이면 `null`. 성공하면 `round.usedHint = true`
  - `SPEED_SECONDS = 15`
  - `remainingSeconds(deadline: number, now: number): number` 남은 초(올림), 지났으면 0

- [ ] **Step 1: 실패하는 테스트를 쓴다**

`tests/hint-timer.test.js`:

```js
// <생성 일시> KST
const test = require("node:test");
const assert = require("node:assert/strict");
const {
  createRound,
  answerCurrent,
  useHint,
  SPEED_SECONDS,
  remainingSeconds,
} = require("../script.js");
const { makeQuestion } = require("./helpers.js");

// 첫 문항은 정답이 0번, 둘째 문항은 정답이 1번이다.
function makeHintRound() {
  return createRound("hint", "한국사", [
    makeQuestion({ id: "q-1" }),
    makeQuestion({ id: "q-2", choices: ["오답1", "정답", "오답2", "오답3"], answer: 1 }),
  ]);
}

test("useHint는 정답이 아닌 보기 2개의 위치를 돌려준다", () => {
  const round = makeHintRound();
  assert.deepEqual(useHint(round, () => 0), [2, 3]);
  assert.equal(round.usedHint, true);
});

test("useHint는 어떤 경우에도 정답을 지우지 않는다", () => {
  for (let i = 0; i < 200; i += 1) {
    const round = makeHintRound();
    round.index = 1;
    const removed = useHint(round);
    assert.equal(removed.length, 2);
    assert.notEqual(removed[0], removed[1]);
    assert.ok(!removed.includes(1));
  }
});

test("useHint는 한 문항에 한 번만 쓸 수 있다", () => {
  const round = makeHintRound();
  useHint(round);
  assert.equal(useHint(round), null);
});

test("답한 뒤에는 힌트를 쓸 수 없다", () => {
  const round = makeHintRound();
  answerCurrent(round, 0);
  assert.equal(useHint(round), null);
  assert.equal(round.usedHint, false);
});

test("힌트를 쓰고 맞히면 0.5점이다", () => {
  const round = makeHintRound();
  useHint(round);
  assert.equal(answerCurrent(round, 0).points, 0.5);
});

test("스피드 모드 제한 시간은 15초다", () => {
  assert.equal(SPEED_SECONDS, 15);
});

test("remainingSeconds는 남은 시간을 초 단위로 올림하고, 지났으면 0이다", () => {
  assert.equal(remainingSeconds(15000, 0), 15);
  assert.equal(remainingSeconds(15000, 1), 15);
  assert.equal(remainingSeconds(15000, 1000), 14);
  assert.equal(remainingSeconds(15000, 14999), 1);
  assert.equal(remainingSeconds(15000, 15000), 0);
  assert.equal(remainingSeconds(15000, 20000), 0);
});
```

- [ ] **Step 2: 테스트가 실패하는지 확인한다**

Run: `node --test tests/hint-timer.test.js`
Expected: FAIL. `useHint is not a function`

- [ ] **Step 3: 힌트와 남은 시간 함수를 만든다**

`script.js`의 `// ===== 화면 =====` 줄 바로 위에 넣는다.

```js
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
```

`module.exports` 블록의 `wrongQuestions,` 다음 줄에 추가한다.

```js
    useHint,
    SPEED_SECONDS,
    remainingSeconds,
```

- [ ] **Step 4: 테스트가 통과하는지 확인한다**

Run: `node --test`
Expected: 29개 모두 PASS

- [ ] **Step 5: 커밋한다**

```bash
git add script.js tests/hint-timer.test.js
git commit -m "feat: 힌트와 남은 시간 규칙" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

### Task 6: 모드 선택, 스피드 모드, 힌트 모드 화면

**Files:**
- Modify: `index.html`, `style.css`, `script.js` (화면 부분)

**Interfaces:**
- Consumes: Task 4의 화면 함수, `useHint`, `SPEED_SECONDS`, `remainingSeconds`
- Produces:
  - `app.timerId`, `app.deadline`
  - `handleHint()`, `startTimer()`, `updateTimer()`, `stopTimer()`
  - HTML id: `mode-buttons`, `timer`, `hint-button`
  - `showScreen(id)`는 항상 타이머를 멈춘다(Task 7, 9도 이에 기댄다)

- [ ] **Step 1: `index.html`을 고친다**

시작 화면의 `<h2>카테고리</h2>` 바로 위에 넣는다.

```html
      <h2>모드</h2>
      <div id="mode-buttons" class="button-grid"></div>
```

퀴즈 화면의 `quiz-header`를 다음으로 바꾼다.

```html
      <div class="quiz-header">
        <span id="progress"></span>
        <span id="timer" class="timer" hidden></span>
        <span id="current-score"></span>
      </div>
```

`<div id="choices" class="choices"></div>` 바로 아래에 넣는다.

```html
      <button id="hint-button" class="hint-button" type="button" hidden>힌트</button>
```

- [ ] **Step 2: `style.css` 끝에 추가한다**

```css
.timer {
  color: var(--accent);
  font-weight: 700;
}

.hint-button {
  margin-top: 12px;
}

.choice.removed {
  opacity: 0.35;
  text-decoration: line-through;
}
```

- [ ] **Step 3: `script.js` 화면 부분을 고친다**

`app` 객체를 다음으로 바꾼다.

```js
// 지금 고른 모드와 카테고리, 진행 중인 판, 스피드 모드 타이머
const app = {
  mode: "practice",
  category: CATEGORIES[0],
  round: null,
  timerId: null,
  deadline: 0,
};
```

`setUpPage`의 `makeOptionButtons("category-buttons", ...)` 호출 바로 위에 넣는다.

```js
  makeOptionButtons("mode-buttons", Object.keys(MODE_NAMES), (mode) => MODE_NAMES[mode], (mode) => {
    app.mode = mode;
    updateStartScreen();
  });
```

`setUpPage`의 `byId("next-button").addEventListener(...)` 줄 바로 아래에 넣는다.

```js
  byId("hint-button").addEventListener("click", handleHint);
```

`updateStartScreen`을 다음으로 바꾼다.

```js
function updateStartScreen() {
  markSelected("mode-buttons", app.mode);
  markSelected("category-buttons", app.category);
  byId("start-notice").hidden = app.mode !== "practice";
}
```

`showScreen`을 다음으로 바꾼다.

```js
// 화면을 바꿀 때는 언제나 스피드 모드 타이머를 멈춘다.
function showScreen(id) {
  stopTimer();
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.hidden = screen.id !== id;
  });
}
```

`showQuestion`의 마지막 줄 `byId("feedback").hidden = true;` 바로 아래에 넣는다.

```js

  const hintButton = byId("hint-button");
  hintButton.hidden = round.mode !== "hint";
  hintButton.disabled = false;
  byId("timer").hidden = round.mode !== "speed";
  if (round.mode === "speed") {
    startTimer();
  }
```

`handleAnswer`를 다음으로 바꾼다.

```js
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
```

`feedbackMessage`를 다음으로 바꾼다.

```js
function feedbackMessage(result) {
  if (result.chosenIndex === null) {
    return "시간 초과로 오답입니다.";
  }
  if (!result.correct) {
    return "오답입니다.";
  }
  return result.points === 0.5 ? "정답입니다. 힌트를 써서 0.5점입니다." : "정답입니다.";
}
```

`handleAnswer` 바로 아래에 넣는다.

```js
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
```

- [ ] **Step 4: Node 테스트가 여전히 통과하는지 확인한다**

Run: `node --test`
Expected: 29개 모두 PASS

- [ ] **Step 5: 브라우저에서 확인한다 (PRD 8장 2단계 확인 목록 중 모드 선택, 스피드, 힌트)**

1. 시작 화면에 모드 3개(연습, 스피드, 힌트)와 카테고리 4개가 보이고, 처음에는 연습과 한국사가 선택되어 있다.
2. "순위표에 기록되지 않음"은 연습을 골랐을 때만 보이고, 스피드나 힌트를 고르면 사라진다. 결과 화면에서도 연습 모드일 때만 보인다.
3. 스피드: "남은 시간 15초"부터 줄어든다. 아무것도 누르지 않으면 0초에 "시간 초과로 오답입니다.", `정답 보기` 초록, 해설이 보이고 점수는 그대로다.
4. 스피드: 답을 고르면 남은 시간 표시가 그 자리에서 멈춘다. [다음]을 누르면 "남은 시간 15초"부터 다시 센다.
5. 스피드: 문항이 보이는 중에 다른 탭에 5초쯤 다녀오면, 남은 시간이 약 5초 줄어 있다.
6. (Review Focus 2) 스피드 판을 끝내고 결과 화면에서 20초를 기다려도 아무 일이 없고, [다시 하기]를 누르면 첫 문항이 15초부터 센다.
7. (Review Focus 2) 스피드 판에서 답을 고른 뒤 해설이 보이는 상태로 20초를 기다려도 "시간 초과"로 바뀌지 않고 점수도 그대로다.
8. 힌트: [힌트] 버튼이 보인다. 누르면 오답 보기 2개가 흐려지고 줄이 그어지며 눌리지 않는다. `정답 보기`는 지워지지 않는다. [힌트] 버튼은 꺼진다.
9. 힌트: 힌트를 쓰고 `정답 보기`를 누르면 "정답입니다. 힌트를 써서 0.5점입니다."가 보이고 점수가 0.5 오른다. 힌트 없이 맞히면 1점, 틀리면 0점이다. 결과 화면 점수가 `7.5 / 10`처럼 맞게 나온다.
10. 힌트: 힌트를 쓰지 않고 답을 고르면 [힌트] 버튼이 꺼진다. 다음 문항에서는 다시 켜진다.
11. 연습과 스피드에는 [힌트] 버튼이 없고, 연습과 힌트에는 남은 시간이 없다.

- [ ] **Step 6: 커밋한다**

```bash
git add index.html style.css script.js
git commit -m "feat: 모드 선택, 스피드 모드, 힌트 모드" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

### Task 7: 틀린 문제 다시 풀기

**Files:**
- Modify: `index.html`, `style.css`, `script.js` (화면 부분)

**Interfaces:**
- Consumes: Task 4, 6의 화면 함수, `wrongQuestions`, `prepareRound`, `createRound`, `correctCount`
- Produces:
  - `app.firstRound`(처음 판), `app.retryNumber`(다시 풀기 회차, 처음 판은 0)
  - `startRetry()`
  - HTML id: `result-retry`, `all-cleared`, `retry-wrong-button`
  - `showResult()`는 처음 판(`app.firstRound`) 점수를 보여 준다(Task 9가 이 함수를 이어서 고친다)

- [ ] **Step 1: `index.html` 결과 화면을 고친다**

`<p id="result-notice" ...>` 바로 아래에 넣는다.

```html
      <p id="result-retry" hidden></p>
      <p id="all-cleared" class="cleared" hidden>틀린 문제를 모두 맞혔습니다.</p>
```

결과 화면 `actions`를 다음으로 바꾼다.

```html
      <div class="actions">
        <button id="retry-wrong-button" type="button" hidden>틀린 문제 다시 풀기</button>
        <button id="replay-button" type="button">다시 하기</button>
        <button id="home-button" type="button">처음으로</button>
      </div>
```

- [ ] **Step 2: `script.js` 화면 부분을 고친다**

`app` 객체를 다음으로 바꾼다.

```js
// 지금 고른 모드와 카테고리, 진행 중인 판, 스피드 모드 타이머, 다시 풀기 상태
const app = {
  mode: "practice",
  category: CATEGORIES[0],
  round: null,
  timerId: null,
  deadline: 0,
  firstRound: null, // 다시 풀기를 해도 점수는 이 판 기준이다.
  retryNumber: 0, // 0이면 처음 판, 1부터는 다시 풀기 회차
};
```

`setUpPage`의 `byId("replay-button").addEventListener(...)` 줄 바로 위에 넣는다.

```js
  byId("retry-wrong-button").addEventListener("click", startRetry);
```

`startNewRound`를 다음으로 바꾸고, 그 아래에 `startRetry`를 넣는다.

```js
function startNewRound() {
  const questions = QUESTIONS.filter((question) => question.category === app.category);
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
```

`showQuestion`의 `byId("round-label").textContent = ...;` 줄을 다음으로 바꾼다.

```js
  const label = `${MODE_NAMES[round.mode]} 모드, ${round.category}`;
  byId("round-label").textContent =
    app.retryNumber > 0 ? `${label}, 다시 풀기 ${app.retryNumber}회차` : label;
```

`showResult`를 다음으로 바꾼다.

```js
function showResult() {
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
  showScreen("result-screen");
}
```

- [ ] **Step 3: `style.css` 끝에 추가한다**

```css
.cleared {
  color: var(--correct);
  font-weight: 600;
}
```

- [ ] **Step 4: Node 테스트가 여전히 통과하는지 확인한다**

Run: `node --test`
Expected: 29개 모두 PASS

- [ ] **Step 5: 브라우저에서 확인한다 (PRD 8장 2단계 확인 목록 중 다시 풀기)**

1. 연습 모드에서 3문항을 일부러 틀리고 끝내면, 결과는 `7 / 10`이고 [틀린 문제 다시 풀기]가 보인다.
2. [틀린 문제 다시 풀기]를 누르면 틀린 3문항만 나오고, 위에 "연습 모드, 한국사, 다시 풀기 1회차"와 `1 / 3`이 보인다. 해설과 출처도 보인다.
3. 그중 1문항을 또 틀리고 끝내면, 결과 화면에 "처음 점수 7 / 10", "10문제 중 7개 맞힘, 3개 틀림", "다시 풀기 1회차: 3문제 중 2개 맞힘"과 [남은 문제 다시 풀기]가 보인다.
4. [남은 문제 다시 풀기]로 남은 1문항을 맞히면 "다시 풀기 2회차: 1문제 중 1개 맞힘", "틀린 문제를 모두 맞혔습니다."가 보이고 다시 풀기 버튼은 사라진다. 처음 점수는 여전히 `7 / 10`이다.
5. 10문항을 모두 맞힌 연습 판에는 [틀린 문제 다시 풀기]도 "틀린 문제를 모두 맞혔습니다."도 없다.
6. (Review Focus 5) 다시 풀기 2회차 결과에서 [다시 하기]를 누르면 같은 카테고리 10문항으로 새 판이 시작되고, 위의 회차 표시가 없다. 그 판의 결과 화면에도 회차 줄이 없다.
7. 스피드 모드와 힌트 모드 결과 화면에는 틀린 문항이 있어도 [틀린 문제 다시 풀기]가 없다.

- [ ] **Step 6: 커밋한다**

```bash
git add index.html style.css script.js
git commit -m "feat: 연습 모드 틀린 문제 다시 풀기" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## 3단계: 점수 저장과 순위표

### Task 8: 순위표 규칙

**Files:**
- Modify: `script.js` (`// ===== 화면 =====` 줄 바로 위, `module.exports`)
- Create: `tests/leaderboard.test.js`

**Interfaces:**
- Consumes: 없음
- Produces:
  - `LEADERBOARD_KEY = "quizLeaderboard"`, `LEADERBOARD_SIZE = 10`, `RANKED_MODES = ["speed", "hint"]`
  - `boardKey(mode, category): string` 예: `"speed:한국사"`
  - `recordsFor(board, key): Array<{ score, date }>` 없거나 배열이 아니면 `[]`
  - `addRecord(board, key, record): board` 새 객체. 점수 내림차순, 같은 점수는 먼저 넣은 기록이 위, 상위 10개
  - `loadBoard(storage | null): board` 읽을 수 없으면 `{}`
  - `saveBoard(storage | null, board): boolean` 저장했으면 `true`
  - `formatDate(date: Date): string` `"YYYY-MM-DD HH:MM"`

- [ ] **Step 1: 실패하는 테스트를 쓴다**

`tests/leaderboard.test.js`:

```js
// <생성 일시> KST
const test = require("node:test");
const assert = require("node:assert/strict");
const {
  LEADERBOARD_KEY,
  boardKey,
  recordsFor,
  addRecord,
  loadBoard,
  saveBoard,
  formatDate,
} = require("../script.js");

// localStorage 대신 쓰는 가짜 저장소
function fakeStorage(initial = {}) {
  const data = { ...initial };
  return {
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = String(value);
    },
  };
}

test("저장 키는 quizLeaderboard다", () => {
  assert.equal(LEADERBOARD_KEY, "quizLeaderboard");
});

test("boardKey는 모드와 카테고리를 합친다", () => {
  assert.equal(boardKey("speed", "한국사"), "speed:한국사");
});

test("addRecord는 점수 높은 순으로 넣고 원래 순위표는 바꾸지 않는다", () => {
  const empty = {};
  const b1 = addRecord(empty, "speed:과학", { score: 6, date: "d1" });
  const b2 = addRecord(b1, "speed:과학", { score: 9, date: "d2" });
  const b3 = addRecord(b2, "speed:과학", { score: 7.5, date: "d3" });
  assert.deepEqual(b3["speed:과학"].map((r) => r.score), [9, 7.5, 6]);
  assert.deepEqual(empty, {});
  assert.equal(b1["speed:과학"].length, 1);
});

test("점수가 같으면 먼저 세운 기록이 위에 있다", () => {
  let board = addRecord({}, "hint:과학", { score: 8, date: "먼저" });
  board = addRecord(board, "hint:과학", { score: 8, date: "나중" });
  assert.deepEqual(board["hint:과학"].map((r) => r.date), ["먼저", "나중"]);
});

test("표마다 상위 10개만 남긴다", () => {
  let board = {};
  for (let score = 1; score <= 11; score += 1) {
    board = addRecord(board, "speed:과학", { score, date: `d${score}` });
  }
  assert.deepEqual(board["speed:과학"].map((r) => r.score), [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);
  board = addRecord(board, "speed:과학", { score: 1, date: "낮은 점수" });
  assert.equal(board["speed:과학"].length, 10);
  assert.ok(!board["speed:과학"].some((r) => r.date === "낮은 점수"));
});

test("다른 표의 기록은 건드리지 않는다", () => {
  const board = addRecord({ "hint:한국사": [{ score: 5, date: "d" }] }, "speed:한국사", { score: 3, date: "e" });
  assert.deepEqual(board["hint:한국사"], [{ score: 5, date: "d" }]);
  assert.deepEqual(board["speed:한국사"], [{ score: 3, date: "e" }]);
});

test("recordsFor는 기록이 없거나 배열이 아니면 빈 배열을 돌려준다", () => {
  assert.deepEqual(recordsFor({}, "speed:과학"), []);
  assert.deepEqual(recordsFor({ "speed:과학": "깨진 값" }, "speed:과학"), []);
});

test("addRecord는 깨진 표를 빈 표로 보고 새 기록을 넣는다", () => {
  const board = addRecord({ "speed:과학": "깨진 값" }, "speed:과학", { score: 3, date: "d" });
  assert.deepEqual(board["speed:과학"], [{ score: 3, date: "d" }]);
});

test("saveBoard로 저장한 순위표를 loadBoard로 다시 읽는다", () => {
  const storage = fakeStorage();
  const board = addRecord({}, "speed:과학", { score: 7, date: "2026-10-09 21:50" });
  assert.equal(saveBoard(storage, board), true);
  assert.deepEqual(loadBoard(storage), board);
});

test("loadBoard는 저장된 값이 없거나 깨져 있으면 빈 순위표를 돌려준다", () => {
  assert.deepEqual(loadBoard(fakeStorage()), {});
  for (const broken of ["{깨짐", "[1,2]", "null", "3", '"글자"']) {
    assert.deepEqual(loadBoard(fakeStorage({ quizLeaderboard: broken })), {}, broken);
  }
});

test("저장소를 쓸 수 없어도 멈추지 않는다", () => {
  const blocked = {
    getItem() {
      throw new Error("막힘");
    },
    setItem() {
      throw new Error("막힘");
    },
  };
  assert.deepEqual(loadBoard(blocked), {});
  assert.equal(saveBoard(blocked, {}), false);
  assert.deepEqual(loadBoard(null), {});
  assert.equal(saveBoard(null, {}), false);
});

test("formatDate는 YYYY-MM-DD HH:MM 형식으로 바꾼다", () => {
  assert.equal(formatDate(new Date(2026, 9, 9, 7, 5)), "2026-10-09 07:05");
});
```

- [ ] **Step 2: 테스트가 실패하는지 확인한다**

Run: `node --test tests/leaderboard.test.js`
Expected: FAIL. `boardKey is not a function`

- [ ] **Step 3: 순위표 함수를 만든다**

`script.js`의 `// ===== 화면 =====` 줄 바로 위에 넣는다.

```js
const LEADERBOARD_KEY = "quizLeaderboard";
const LEADERBOARD_SIZE = 10;
const RANKED_MODES = ["speed", "hint"]; // 연습 모드는 순위표에 기록하지 않는다.

// 순위표는 { "speed:한국사": [{ score, date }, ...], ... } 모양이다.
function boardKey(mode, category) {
  return `${mode}:${category}`;
}

function recordsFor(board, key) {
  return Array.isArray(board[key]) ? board[key] : [];
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
```

`module.exports` 블록의 `remainingSeconds,` 다음 줄에 추가한다.

```js
    LEADERBOARD_KEY,
    boardKey,
    recordsFor,
    addRecord,
    loadBoard,
    saveBoard,
    formatDate,
```

- [ ] **Step 4: 테스트가 통과하는지 확인한다**

Run: `node --test`
Expected: 41개 모두 PASS

- [ ] **Step 5: 커밋한다**

```bash
git add script.js tests/leaderboard.test.js
git commit -m "feat: 순위표 규칙" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

### Task 9: 점수 저장과 순위표 화면

**Files:**
- Modify: `index.html`, `style.css`, `script.js` (화면 부분)

**Interfaces:**
- Consumes: Task 4, 6, 7의 화면 함수, `RANKED_MODES`, `boardKey`, `recordsFor`, `addRecord`, `loadBoard`, `saveBoard`, `formatDate`
- Produces:
  - `app.boardMode`, `app.boardCategory`
  - `browserStorage()`, `recordResult(round): boolean`, `showBoard()`, `renderBoard()`
  - `showResult(saved: boolean | null)` `null`은 기록 대상이 아님(연습 모드)
  - HTML id: `board-button`, `result-saved`, `leaderboard-screen`, `board-mode-buttons`, `board-category-buttons`, `board-table`, `board-rows`, `board-empty`, `board-home-button`

- [ ] **Step 1: `index.html`을 고친다**

시작 화면의 `<button id="start-button" ...>` 바로 아래에 넣는다.

```html
      <button id="board-button" class="board-button" type="button">순위표</button>
```

결과 화면의 `<p id="all-cleared" ...>` 바로 아래에 넣는다.

```html
      <p id="result-saved" class="notice" hidden></p>
```

결과 화면 `</section>` 바로 아래(`</main>` 위)에 넣는다.

```html

    <!-- 순위표 화면 -->
    <section id="leaderboard-screen" class="screen" hidden>
      <h2>순위표</h2>
      <div id="board-mode-buttons" class="button-grid"></div>
      <div id="board-category-buttons" class="button-grid board-categories"></div>
      <table id="board-table" class="board-table">
        <thead>
          <tr><th>순위</th><th>점수</th><th>날짜</th></tr>
        </thead>
        <tbody id="board-rows"></tbody>
      </table>
      <p id="board-empty" class="notice" hidden>아직 기록이 없습니다.</p>
      <div class="actions">
        <button id="board-home-button" type="button">처음으로</button>
      </div>
    </section>
```

- [ ] **Step 2: `style.css` 끝에 추가한다**

```css
.board-button {
  width: 100%;
  margin-top: 8px;
}

.board-categories {
  margin-top: 8px;
}

.board-table {
  width: 100%;
  margin-top: 16px;
  border-collapse: collapse;
  background: var(--card);
}

.board-table th,
.board-table td {
  padding: 8px;
  border-bottom: 1px solid var(--line);
  text-align: left;
}
```

- [ ] **Step 3: `script.js` 화면 부분을 고친다**

`app` 객체를 다음으로 바꾼다.

```js
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
```

`setUpPage`의 `updateStartScreen();` 줄(마지막 줄) 바로 위에 넣는다.

```js
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

```

`nextQuestion`을 다음으로 바꾼다.

```js
function nextQuestion() {
  if (goNext(app.round)) {
    showQuestion();
    return;
  }
  // 스피드 모드와 힌트 모드만 판이 끝날 때 한 번 기록한다.
  const saved = RANKED_MODES.includes(app.round.mode) ? recordResult(app.round) : null;
  showResult(saved);
}
```

`showResult`를 다음으로 바꾼다.

```js
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
```

`showResult` 바로 아래에 넣는다.

```js
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
```

- [ ] **Step 4: Node 테스트가 여전히 통과하는지 확인한다**

Run: `node --test`
Expected: 41개 모두 PASS

- [ ] **Step 5: 브라우저에서 확인한다 (PRD 8장 3단계 확인 목록)**

시작 전에 개발자 도구 콘솔에서 `localStorage.removeItem("quizLeaderboard")`로 기록을 비운다.

1. 시작 화면에서 [순위표]를 누르면 스피드, 힌트 버튼과 카테고리 4개가 보이고, 기록이 없으므로 "아직 기록이 없습니다."가 보인다.
2. 스피드 모드 과학 판을 끝내면 결과 화면에 "순위표에 기록했습니다."가 보이고, 순위표의 스피드, 과학 표에 그 점수와 오늘 날짜(`YYYY-MM-DD HH:MM`)가 1위로 보인다. 다른 표에는 없다.
3. 힌트 모드에서 0.5점이 섞인 판을 끝내면 힌트 표에 `7.5점`처럼 보인다.
4. 연습 판을 끝내면 "순위표에 기록했습니다."가 보이지 않고 순위표에도 기록이 늘지 않는다. 다시 풀기 결과 화면에서도 마찬가지다.
5. 같은 표에 점수가 다른 기록을 몇 개 쌓으면 점수 높은 순이고, 같은 점수는 먼저 세운 기록이 위다. 브라우저를 껐다 켜도 기록이 남아 있다. 상위 10개 제한은 Task 8 테스트로 확인했으므로 손으로 11판을 할 필요는 없다.
6. (Review Focus 4) 콘솔에서 `localStorage.setItem("quizLeaderboard", "{깨짐")`을 실행하고 [순위표]를 열면 앱이 멈추지 않고 "아직 기록이 없습니다."가 보인다. 이어서 스피드 판을 끝내면 정상으로 기록된다.
7. 창 폭을 375px로 줄여도 순위표가 가로 스크롤 없이 보인다.

- [ ] **Step 6: 커밋한다**

```bash
git add index.html style.css script.js
git commit -m "feat: 점수 저장과 순위표 화면" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## 완료 후

- PRD 8장의 1~3단계 확인 목록이 모두 체크되었는지 PRD와 대조한다.
- 진짜 문항으로 바꾸는 일은 사용자가 한다. 바꾼 뒤 `node --test`의 "questions.js의 문항은 형식 검사를 통과한다"와 브라우저 콘솔의 `[문항 검사]` 경고로 형식을 확인할 수 있다.
