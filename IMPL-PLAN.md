<!-- 2026-10-09 22:15 KST -->

# 상식 퀴즈 웹 앱 구현 계획 (실습 규칙에 맞춘 3단계 재작업)

> **실행자에게:** 이 계획은 superpowers:executing-plans로 **이 세션에서 직접** 태스크 단위로 실행합니다. 진행 표시는 체크박스(`- [ ]`)로 합니다. 각 단계의 마지막 태스크에서 반드시 멈추고, 사용자가 승인하기 전에는 다음 태스크로 넘어가지 않습니다.

**목표:** 이미 완성된 퀴즈 앱을 수정된 [PRD.md](PRD.md)에 맞게 3단계로 고칩니다. 단계마다 점검하고, 사용자 확인을 받고, 배포합니다.

**구조:** `index.html`에 화면을 `<section>`으로 미리 두고 `hidden`으로 바꿉니다. `questions.js`는 전역 상수 `QUESTIONS` 하나를 선언하는 일반 스크립트입니다. `script.js`는 위에서 아래로 `규칙(순수 함수)`, `자체 점검`, `화면`의 세 구역입니다. 규칙과 자체 점검은 DOM을 쓰지 않아 Node에서도 돌릴 수 있습니다.

**기술:** HTML, CSS, 바닐라 JavaScript. 라이브러리, 빌드 도구, 테스트 프레임워크는 쓰지 않습니다. 점검용으로만 Node.js 24를 씁니다.

**명세:** [PRD.md](PRD.md). 실행자는 이 계획과 PRD를 함께 읽습니다.

## 전역 제약

- 앱 파일은 `index.html`, `style.css`, `script.js`, `questions.js` 4개뿐입니다. 테스트 파일, JSON, 이미지 같은 파일을 만들지 않습니다. 문서(`PRD.md`, `IMPL-PLAN.md`, `QUESTION-REVIEW.md`)와 `.gitignore`는 앱 파일이 아닙니다.
- `file://`로 열어 동작해야 합니다. `fetch`, `import`나 `export`, `<script type="module">`을 쓰지 않습니다. `index.html`은 `questions.js`를 `script.js`보다 먼저 불러옵니다.
- 카테고리는 `한국사`, `세계지리`, `과학`, `예술과 문화`이고, 카테고리마다 10문항, 모두 40문항입니다.
- 점수: 맞히면 1점, 힌트를 쓰고 맞히면 0.5점, 틀리거나 시간 초과면 0점입니다. 스피드 모드는 문항마다 15초입니다.
- 순위표는 스피드와 힌트 모드만 대상입니다. 모드×카테고리별 상위 5건, 점수 내림차순, 같으면 먼저 세운 기록이 위입니다. 기록은 `{ name, score, date }`이고, 이름은 앞뒤 공백을 지운 뒤 1~12자입니다. localStorage 키는 `quizLeaderboard`입니다.
- 화면 문구는 그대로 씁니다: `순위표에 기록되지 않음`, `문항 데이터에 오류가 있습니다. 개발자 도구(F12) 콘솔을 확인해 주세요.`, `이름을 입력해 주세요.`, `순위표에 기록했습니다.`, `이 브라우저에서는 순위표에 기록할 수 없습니다.`, `아직 기록이 없습니다.`
- 문항 텍스트와 이름은 `textContent`로만 화면에 넣습니다. `innerHTML`을 쓰지 않습니다.
- 폭 360px에서 가로 스크롤이 생기면 안 됩니다.
- 한국어 문구: 열거에는 가운뎃점 대신 쉼표, 완결된 문장은 마침표, 라벨에는 마침표 없음, 보조용언은 띄어 씁니다.
- 새로 만드는 파일은 첫 줄에 생성 일시 주석을 답니다(`TZ=KST-9 date "+%Y-%m-%d %H:%M"`, `2026-10-09 22:15 KST` 형식). 기존 파일에는 달지 않습니다.
- 커밋 작성자는 이 저장소에만 설정된 `dkstjdus123 <331831451+dkstjdus123@users.noreply.github.com>`입니다. 커밋 메시지 끝에는 `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`을 붙입니다.
- 태스크마다 **점검 명령**이 기대한 결과로 끝난 뒤에, 그 태스크에서 바꾼 파일만 커밋합니다.
- 각 단계의 마지막 태스크에서 **실행을 멈추고** 보고합니다. 사용자가 탐색기에서 `index.html`을 더블클릭해 확인하고 승인한 뒤에만 병합, 배포, 다음 단계를 진행합니다.

## 점검 명령

프로젝트 폴더에서 Git Bash로 실행합니다. `questions.js`와 `script.js`를 브라우저처럼 한 전역 공간에 차례로 불러오고, 주소에 `?test`가 붙은 것처럼 자체 점검을 돌립니다. 실패가 있거나 점검이 돌지 않으면 종료 코드가 1입니다.

```bash
node -e "const fs=require('fs'),vm=require('vm');const ctx=vm.createContext({console,location:{search:'?test'}});['questions.js','script.js'].forEach(f=>vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:f}));process.exitCode=ctx.selfCheckFailed===0?0:1"
```

## 문항 검수 명령

해설이 60자를 넘는 문항, 최상급 표현이 든 문제, 부정형 문제를 찾아 출력합니다. 출력된 최상급 문제는 기준과 시점이 문제 문장에 있는지 눈으로 확인합니다. 해설 60자 초과와 부정형은 0건이어야 합니다.

```bash
node -e "const fs=require('fs'),vm=require('vm');const ctx=vm.createContext({});vm.runInContext(fs.readFileSync('questions.js','utf8')+';globalThis.list=QUESTIONS;',ctx);ctx.list.forEach(q=>{if(q.explanation.length>60)console.log('해설 60자 초과:',q.id,q.explanation.length);if(/가장|최초|최대|최소|최고|최다|최장/.test(q.question))console.log('최상급 확인:',q.id,q.question);if(/아닌 것|않은 것/.test(q.question))console.log('부정형:',q.id,q.question)})"
```

## 화면 확인 방법 (Claude)

앱 안 브라우저는 `file://` 페이지의 스크립트를 실행하지 못합니다. Claude는 `.claude/launch.json`의 `quiz-static`(`python -m http.server 8123`)을 `preview_start`로 띄워 `http://localhost:8123/`에서 확인합니다. `file://` 확인은 사용자가 단계마다 더블클릭으로 합니다.

## Review Focus

PRD가 직접 말하지 않지만 사용자가 겪기 쉬운 경우와, 그것을 확인하는 곳입니다.

1. **이름 칸에 공백만 넣고 기록을 누름**: 기록되지 않고 "이름을 입력해 주세요."가 나와야 합니다. → Task 13 `cleanName` 점검, Task 15 확인 항목
2. **[순위표에 기록]을 연달아 누르거나 Enter를 두 번 누름**: 한 번만 기록되어야 합니다. → Task 15 확인 항목
3. **이전 버전에서 저장된 이름 없는 기록이 남아 있음**: 순위표에 "undefined" 대신 그 기록이 빠져야 합니다. → Task 13 `recordsFor` 점검
4. **`http://`로 시작하는 출처 주소**: 문항 검사에서 걸러져야 합니다. → Task 2 점검
5. **문항 데이터 오류가 있을 때**: [시작]은 막히지만 [순위표]는 열려야 합니다. → Task 3 확인

---

## 파일 구조

| 파일 | 바뀌는 태스크 | 역할 |
|---|---|---|
| `.gitignore` | 1 (새로 만듦) | `.claude/`를 저장소에서 뺌 |
| `tests/` | 1 (지움) | 자체 점검으로 옮김 |
| `script.js` | 1, 2, 3, 10, 13, 14 | 규칙, 자체 점검, 화면 |
| `index.html` | 3, 14 | 화면 구조 |
| `style.css` | 14 | 이름 입력 칸 모양 |
| `questions.js` | 4~7 | 문항 40개 |
| `QUESTION-REVIEW.md` | 4~7 (새로 만듦) | 문항 검수표 |

---

# 1단계: 연습 모드와 점수 (+ 공통 기반 정리)

**만들 것**
- `script.js` 자체 점검 구역(섞기, 점수, 문항 검사)과 점검 명령. `tests/` 폴더와 `module.exports`는 없앰
- 문항 검사 강화(보기 중복, `https://`만 허용)
- 문항 데이터 오류의 화면 표시와 [시작] 막기
- 출처 규칙에 맞게 다시 확인한 문항 40개와 `QUESTION-REVIEW.md` 검수표
- `.gitignore`

**완료 기준**
- [ ] 점검 명령이 종료 코드 0, `자체 점검 결과: 통과 20, 실패 0`으로 끝난다.
- [ ] 문항 검수 명령에 해설 60자 초과와 부정형이 0건이고, 최상급 문제는 모두 기준과 시점이 있다.
- [ ] 출처 40개 중 위키백과, 나무위키, 블로그, 커뮤니티가 0건이다.
- [ ] `tests/` 폴더가 없다.

**브라우저에서 직접 확인할 항목** (탐색기에서 `index.html`을 더블클릭해서 엽니다)
- [ ] 시작 화면에 모드 3개, 카테고리 4개, [시작], [순위표]가 보이고, 연습을 고르면 "순위표에 기록되지 않음"이 보인다. 빨간 오류 문구는 없다.
- [ ] 연습, 한국사로 시작하면 상단에 "연습 모드, 한국사", "1 / 10", "점수 0"이 보인다.
- [ ] 정답을 고르면 그 보기가 초록색이 되고 "정답입니다.", 해설 한 줄, 출처 링크가 보인다.
- [ ] 오답을 고르면 고른 보기는 빨간색, 정답 보기는 초록색이 되고 "오답입니다."가 보인다.
- [ ] 답을 고른 뒤 다른 보기를 눌러도 아무 변화가 없다.
- [ ] 출처 링크를 누르면 새 탭에서 기관 페이지(위키백과가 아님)가 열린다.
- [ ] 마지막 문항에서는 버튼이 [결과 보기]로 바뀐다.
- [ ] 결과 화면의 점수가 실제로 맞힌 개수와 같고, "순위표에 기록되지 않음"이 보인다.
- [ ] [다시 하기]를 누르면 문항 순서와 보기 순서가 앞 판과 다르고, [처음으로]를 누르면 시작 화면으로 간다.
- [ ] 개발자 도구(F12)의 기기 툴바로 폭을 360px로 줄여도 가로 스크롤이 생기지 않는다.
- [ ] 주소 끝에 `?test`를 붙여 다시 열면 콘솔에 "자체 점검 결과: 통과 20, 실패 0"이 나온다.
- [ ] 네 카테고리를 한 판씩 풀면서 문제, 정답, 해설에 어색하거나 틀린 곳이 없는지 `QUESTION-REVIEW.md`와 함께 본다.

### Task 1: 단계 브랜치, `.gitignore`, 자체 점검 틀로 옮기기

**Files:**
- Create: `.gitignore`
- Delete: `tests/` (5개 파일)
- Modify: `script.js` (3번째 줄 주석, `// ===== 화면 =====` 위에 자체 점검 구역 추가, 맨 끝 실행부)

**Interfaces:**
- Consumes: 기존 규칙 함수 `shuffle`, `prepareQuestion`, `prepareRound`, `scoreAnswer`, `formatScore`, `createRound`, `answerCurrent`, `goNext`, `roundScore`, `correctCount`, `wrongQuestions`, `validateQuestions`, 화면 구역의 `readQuestions()`
- Produces: `check(name, fn)`, `expectEqual(actual, expected)`, `runSelfChecks(): number`(실패 수), `sampleQuestion(overrides)`, `sampleQuestionSet()`, `sampleRound(mode, count)`, `validateWithFirst(overrides)`, 전역 `selfCheckFailed`

- [ ] **Step 1: 단계 브랜치를 만든다**

```bash
git switch -c stage-1
```

- [ ] **Step 2: `.gitignore`를 만든다**

```
# <생성 일시> KST
# 이 PC에서만 쓰는 Claude 설정(화면 확인용 서버 설정 등)은 저장소에 올리지 않는다.
.claude/
```

- [ ] **Step 3: `script.js` 3번째 줄 주석을 바꾼다**

```js
// "규칙" 부분은 화면 없이 동작하는 함수라서, 아래 "자체 점검"(index.html?test 또는 IMPL-PLAN.md의 점검 명령)으로 확인한다.
```

- [ ] **Step 4: `// ===== 화면 =====` 줄 바로 위에 자체 점검 구역을 넣는다**

```js
// ===== 자체 점검 =====
// index.html?test로 열거나 IMPL-PLAN.md의 점검 명령을 실행하면 아래 항목을 차례로 확인한다.
// 항목마다 콘솔에 통과나 실패를 찍고, 마지막에 "자체 점검 결과: 통과 N, 실패 M"을 찍는다.

const SELF_CHECKS = [];

function check(name, fn) {
  SELF_CHECKS.push({ name, fn });
}

// 두 값을 JSON 문자열로 바꿔 비교한다. 다르면 기댓값과 실제 값을 담은 오류를 던진다.
function expectEqual(actual, expected) {
  const actualText = JSON.stringify(actual);
  const expectedText = JSON.stringify(expected);
  if (actualText !== expectedText) {
    throw new Error(`기댓값 ${expectedText}, 실제 ${actualText}`);
  }
}

// 모든 항목을 돌리고 실패 수를 돌려준다.
function runSelfChecks() {
  let passed = 0;
  let failed = 0;
  SELF_CHECKS.forEach(({ name, fn }) => {
    try {
      fn();
      passed += 1;
      console.log(`통과: ${name}`);
    } catch (error) {
      failed += 1;
      console.error(`실패: ${name} (${error.message})`);
    }
  });
  console.log(`자체 점검 결과: 통과 ${passed}, 실패 ${failed}`);
  return failed;
}

// 점검용 문항. 정답은 0번 보기 "정답"이다. 바꿀 칸만 overrides로 넘긴다.
function sampleQuestion(overrides = {}) {
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

// 카테고리마다 10개씩, 형식이 올바른 점검용 문항 40개. id는 c0-1 ~ c3-10이다.
function sampleQuestionSet() {
  const list = [];
  CATEGORIES.forEach((category, c) => {
    for (let n = 1; n <= QUESTIONS_PER_CATEGORY; n += 1) {
      list.push(sampleQuestion({ id: `c${c}-${n}`, category }));
    }
  });
  return list;
}

// 점검용 판. 문항의 정답은 모두 0번 보기다.
function sampleRound(mode, count) {
  const questions = [];
  for (let n = 1; n <= count; n += 1) {
    questions.push(sampleQuestion({ id: `q-${n}` }));
  }
  return createRound(mode, "한국사", questions);
}

// 점검용 문항 40개 중 첫 문항만 바꿔서 문항 검사 결과를 돌려준다.
function validateWithFirst(overrides) {
  const set = sampleQuestionSet();
  set[0] = sampleQuestion({ id: "c0-1", ...overrides });
  return validateQuestions(set);
}

// --- 1단계: 섞기, 점수, 문항 검사 ---

check("shuffle은 원래 배열을 바꾸지 않고 같은 원소를 가진 새 배열을 돌려준다", () => {
  const items = ["a", "b", "c", "d"];
  const result = shuffle(items);
  expectEqual(items, ["a", "b", "c", "d"]);
  expectEqual(result.slice().sort(), ["a", "b", "c", "d"]);
  if (result === items) {
    throw new Error("원래 배열을 그대로 돌려주었습니다.");
  }
});

check("shuffle은 random 값에 따라 순서를 바꾼다", () => {
  expectEqual(shuffle(["a", "b", "c", "d"], () => 0), ["b", "c", "d", "a"]);
  expectEqual(shuffle(["a", "b", "c", "d"], () => 0.999), ["a", "b", "c", "d"]);
});

check("prepareQuestion은 보기를 섞고 정답 위치를 함께 옮긴다", () => {
  const question = sampleQuestion();
  const prepared = prepareQuestion(question, () => 0);
  expectEqual(prepared.choices, ["오답1", "오답2", "오답3", "정답"]);
  expectEqual(prepared.answer, 3);
  expectEqual(question.choices, ["정답", "오답1", "오답2", "오답3"]);
});

check("prepareQuestion은 몇 번을 섞어도 정답 보기를 정확히 가리킨다", () => {
  const question = sampleQuestion({ choices: ["오답1", "오답2", "정답", "오답3"], answer: 2 });
  for (let i = 0; i < 200; i += 1) {
    const prepared = prepareQuestion(question);
    expectEqual(prepared.choices[prepared.answer], "정답");
  }
});

check("prepareRound는 문항 순서와 보기 순서를 함께 섞는다", () => {
  const questions = [1, 2, 3, 4].map((n) => sampleQuestion({ id: `q-${n}` }));
  const round = prepareRound(questions, () => 0);
  expectEqual(round.map((q) => q.id), ["q-2", "q-3", "q-4", "q-1"]);
  round.forEach((q) => {
    expectEqual(q.choices[q.answer], "정답");
  });
});

check("scoreAnswer: 맞히면 1점, 힌트를 쓰고 맞히면 0.5점, 틀리면 0점이다", () => {
  expectEqual(
    [scoreAnswer(true, false), scoreAnswer(true, true), scoreAnswer(false, false), scoreAnswer(false, true)],
    [1, 0.5, 0, 0],
  );
});

check("formatScore는 정수면 정수로, 0.5가 있으면 소수 한 자리로 보여 준다", () => {
  expectEqual([formatScore(7), formatScore(7.5), formatScore(0), formatScore(10)], ["7", "7.5", "0", "10"]);
});

check("answerCurrent는 정답 여부와 점수를 기록하고, null은 시간 초과로 0점이다", () => {
  const round = sampleRound("speed", 2);
  expectEqual(answerCurrent(round, 0).points, 1);
  goNext(round);
  const timeout = answerCurrent(round, null);
  expectEqual([timeout.correct, timeout.points], [false, 0]);
});

check("이미 답한 문항에 다시 답하면 무시한다", () => {
  const round = sampleRound("speed", 3);
  answerCurrent(round, 1);
  expectEqual(answerCurrent(round, 0), null);
  expectEqual(answerCurrent(round, null), null);
  expectEqual([round.results.length, roundScore(round)], [1, 0]);
});

check("한 판의 점수, 맞힌 수, 틀린 문항을 세고, 마지막 문항 뒤 goNext는 false다", () => {
  const round = sampleRound("hint", 4);
  answerCurrent(round, 0);
  goNext(round);
  round.usedHint = true;
  answerCurrent(round, 0);
  goNext(round);
  expectEqual(round.usedHint, false);
  answerCurrent(round, 2);
  goNext(round);
  answerCurrent(round, null);
  expectEqual(goNext(round), false);
  expectEqual([roundScore(round), correctCount(round)], [1.5, 2]);
  expectEqual(wrongQuestions(round).map((q) => q.id), ["q-3", "q-4"]);
});

check("validateQuestions: 형식이 올바른 40문항이면 경고가 없다", () => {
  expectEqual(validateQuestions(sampleQuestionSet()), []);
});

check("validateQuestions: 배열이 아니면 경고한다", () => {
  expectEqual(validateQuestions(undefined), ["QUESTIONS가 배열이 아닙니다."]);
});

check("validateQuestions: 보기가 4개가 아니면 경고한다", () => {
  expectEqual(validateWithFirst({ choices: ["가", "나", "다"] }), ["c0-1: 보기가 4개가 아닙니다."]);
});

check("validateQuestions: answer가 0~3 사이의 정수가 아니면 경고한다", () => {
  [4, -1, 1.5, "0", undefined].forEach((answer) => {
    expectEqual(validateWithFirst({ answer }), ["c0-1: answer는 0~3 사이의 정수여야 합니다."]);
  });
});

check("validateQuestions: 해설이 비어 있으면 경고한다", () => {
  expectEqual(validateWithFirst({ explanation: "  " }), ["c0-1: 해설(explanation)이 비어 있습니다."]);
});

check("validateQuestions: id가 비어 있거나 겹치면 경고한다", () => {
  const set = sampleQuestionSet();
  set[0] = sampleQuestion({ id: "" });
  set[2] = sampleQuestion({ id: "c0-2" });
  expectEqual(validateQuestions(set), ["1번째 문항: id가 비어 있습니다.", "c0-2: id가 다른 문항과 겹칩니다."]);
});

check("validateQuestions: 카테고리가 4개 중 하나가 아니거나 개수가 10개가 아니면 경고한다", () => {
  expectEqual(validateWithFirst({ category: "역사" }), [
    'c0-1: 카테고리 "역사"는 정해진 4개 중 하나가 아닙니다.',
    '카테고리 "한국사"의 문항이 9개입니다. 10개여야 합니다.',
  ]);
});

check("validateQuestions: 출처가 { name, url } 모양이 아니면 경고한다", () => {
  const broken = [
    "문자열 출처",
    null,
    { name: "", url: "https://example.com" },
    { name: "출처", url: "" },
    { name: "출처", url: "javascript:alert(1)" },
  ];
  broken.forEach((source) => {
    expectEqual(validateWithFirst({ source }), [
      "c0-1: 출처(source)에 name과 http(s)로 시작하는 url이 있어야 합니다.",
    ]);
  });
});

check("questions.js의 실제 문항이 문항 검사를 통과한다", () => {
  expectEqual(validateQuestions(readQuestions()), []);
});
```

- [ ] **Step 5: 맨 끝 실행부를 바꾸고 `module.exports`를 지운다**

`script.js` 맨 끝의 `if (typeof document !== "undefined") { setUpPage(); }`부터 `module.exports` 블록 끝까지를 다음으로 바꾼다.

```js
// index.html?test로 열거나 점검 명령으로 실행하면 자체 점검을 돈다. 점검 명령은 selfCheckFailed(실패 수)를 읽는다.
if (typeof location !== "undefined" && /[?&]test(&|=|$)/.test(location.search)) {
  globalThis.selfCheckFailed = runSelfChecks();
}

if (typeof document !== "undefined") {
  setUpPage();
}
```

- [ ] **Step 6: `tests/` 폴더를 지운다**

```bash
git rm -r -q tests
```

- [ ] **Step 7: 점검 명령을 실행한다**

Run: 점검 명령
Expected: 콘솔에 `통과: ...` 19줄과 `자체 점검 결과: 통과 19, 실패 0`, 종료 코드 0(`echo $?`가 `0`)

- [ ] **Step 8: 커밋한다**

```bash
git add .gitignore script.js tests
git commit -m "feat: 테스트 파일을 script.js 자체 점검으로 옮김" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

### Task 2: 문항 검사 강화 (보기 중복, `https://`만 허용)

**Files:**
- Modify: `script.js` (`validateQuestions`, `isValidSource`, 1단계 자체 점검)

**Interfaces:**
- Consumes: Task 1의 `check`, `expectEqual`, `validateWithFirst`
- Produces: 출처 오류 문구 `"<id>: 출처(source)에 name과 https://로 시작하는 url이 있어야 합니다."`, 보기 중복 문구 `"<id>: 보기 중에 같은 것이 있습니다."`

- [ ] **Step 1: 점검 항목을 먼저 고친다**

`validateQuestions: 출처가 { name, url } 모양이 아니면 경고한다` 항목 전체를 다음으로 바꾼다.

```js
check("validateQuestions: 출처가 { name, url } 모양이 아니거나 https://가 아니면 경고한다", () => {
  const broken = [
    "문자열 출처",
    null,
    { name: "", url: "https://example.com" },
    { name: "출처", url: "" },
    { name: "출처", url: "http://example.com" },
    { name: "출처", url: "javascript:alert(1)" },
  ];
  broken.forEach((source) => {
    expectEqual(validateWithFirst({ source }), [
      "c0-1: 출처(source)에 name과 https://로 시작하는 url이 있어야 합니다.",
    ]);
  });
});
```

`validateQuestions: 보기가 4개가 아니면 경고한다` 항목 바로 아래에 넣는다.

```js
check("validateQuestions: 한 문항의 보기 중에 같은 것이 있으면 경고한다", () => {
  expectEqual(validateWithFirst({ choices: ["정답", "오답", "오답", "오답3"] }), [
    "c0-1: 보기 중에 같은 것이 있습니다.",
  ]);
});
```

- [ ] **Step 2: 점검이 실패하는지 확인한다**

Run: 점검 명령
Expected: `실패:` 2줄(출처, 보기 중복), `자체 점검 결과: 통과 18, 실패 2`, 종료 코드 1

- [ ] **Step 3: 문항 검사를 고친다**

`validateQuestions` 안의 보기 검사를 다음으로 바꾼다.

```js
    if (!Array.isArray(q.choices) || q.choices.length !== CHOICE_COUNT) {
      messages.push(`${label}: 보기가 ${CHOICE_COUNT}개가 아닙니다.`);
    } else if (new Set(q.choices).size !== CHOICE_COUNT) {
      messages.push(`${label}: 보기 중에 같은 것이 있습니다.`);
    }
```

출처 검사 문구를 다음으로 바꾼다.

```js
    if (!isValidSource(q.source)) {
      messages.push(`${label}: 출처(source)에 name과 https://로 시작하는 url이 있어야 합니다.`);
    }
```

`isValidSource`의 주석과 정규식을 다음으로 바꾼다.

```js
// 출처는 { name, url } 모양이다. url은 화면에서 링크가 되므로 https://로 시작해야 한다.
function isValidSource(source) {
  return (
    typeof source === "object" &&
    source !== null &&
    isFilled(source.name) &&
    isFilled(source.url) &&
    /^https:\/\//.test(source.url)
  );
}
```

- [ ] **Step 4: 점검이 통과하는지 확인한다**

Run: 점검 명령
Expected: `자체 점검 결과: 통과 20, 실패 0`, 종료 코드 0

- [ ] **Step 5: 커밋한다**

```bash
git add script.js
git commit -m "feat: 문항 검사에 보기 중복과 https 출처 확인 추가" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

### Task 3: 문항 데이터 오류를 시작 화면에 표시

**Files:**
- Modify: `index.html` (22번째 줄 `start-error`)
- Modify: `script.js` (`setUpPage`, `updateStartScreen`, `startNewRound`)

**Interfaces:**
- Consumes: `validateQuestions`, `readQuestions`
- Produces: HTML id `data-error`. `start-error`는 없어짐(문항 검사가 카테고리마다 10개를 보장하므로 빈 카테고리 안내가 필요 없어짐)

- [ ] **Step 1: `index.html`의 `start-error` 줄을 바꾼다**

```html
      <p id="data-error" class="error" hidden>문항 데이터에 오류가 있습니다. 개발자 도구(F12) 콘솔을 확인해 주세요.</p>
```

- [ ] **Step 2: `setUpPage`의 문항 검사 부분을 바꾼다**

`validateQuestions(QUESTIONS).forEach(...)` 세 줄을 다음으로 바꾼다.

```js
  const problems = validateQuestions(QUESTIONS);
  problems.forEach((message) => {
    console.warn(`[문항 검사] ${message}`);
  });
  // 문항 데이터에 오류가 있으면 [시작]을 막고 안내한다. 순위표는 볼 수 있다.
  if (problems.length > 0) {
    byId("data-error").hidden = false;
    byId("start-button").disabled = true;
  }
```

- [ ] **Step 3: 빈 카테고리 처리를 지운다**

`updateStartScreen`에서 `byId("start-error").hidden = true;` 줄을 지운다. `startNewRound`에서 다음 네 줄을 지운다.

```js
  if (questions.length === 0) {
    byId("start-error").hidden = false;
    return;
  }
```

- [ ] **Step 4: 점검 명령과 화면을 확인한다**

Run: 점검 명령 → `통과 20, 실패 0`, 종료 코드 0

`quiz-static` 서버로 `http://localhost:8123/`을 열어 확인한다.
1. 오류 문구가 보이지 않고 [시작]이 눌린다.
2. `questions.js` 첫 문항의 `choices`에서 두 보기를 같은 글자로 바꾸고 새로 고치면, 빨간 오류 문구가 보이고 [시작]이 눌리지 않으며 [순위표]는 열린다. 콘솔에 `[문항 검사] korean-history-01: 보기 중에 같은 것이 있습니다.`가 나온다.
3. `questions.js`를 되돌리고 `git diff questions.js`가 비어 있는지 확인한다.

- [ ] **Step 5: 커밋한다**

```bash
git add index.html script.js
git commit -m "feat: 문항 데이터 오류를 시작 화면에 알리고 시작을 막음" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

### Task 4~7 공통: 문항 다시 확인과 검수표 작성 절차

Task 4는 한국사, Task 5는 세계지리, Task 6은 과학, Task 7은 예술과 문화입니다. id(`korean-history-01` 등)와 형식은 그대로 둡니다.

1. 카테고리의 문항 10개를 하나씩 봅니다.
2. 문항마다 WebSearch로 기관 출처를 찾고, WebFetch로 **그 사실이 적힌 페이지**를 직접 열어 정답을 확인합니다.
   - 쓸 출처: 우리역사넷(contents.history.go.kr), 한국민족문화대백과사전(encykorea.aks.ac.kr), 국가유산청(heritage.go.kr), 브리태니커(britannica.com), 유네스코(unesco.org, whc.unesco.org, ich.unesco.org), NASA, 정부나 국제기구 누리집, 미술관이나 박물관 공식 누리집
   - 위키백과, 나무위키, 블로그, 커뮤니티 글은 쓰지 않습니다.
   - 페이지를 열 수 없거나 내용이 확인되지 않으면 그 문항을 버리고 다른 주제로 바꿉니다.
3. 문항을 고칩니다. 정답은 하나뿐이고 보기 4개는 서로 다릅니다. 부정형은 쓰지 않습니다. 최상급 표현에는 기준과 시점을 넣습니다. 해설은 정답 근거를 담은 60자 이내 한 줄입니다. 작성할 때 정답은 `choices`의 0번, `answer: 0`입니다.
4. `source`에 `{ name: "기관이나 문서 이름", url: "https://사실이 적힌 페이지" }`를 적습니다.
5. `QUESTION-REVIEW.md`의 해당 카테고리 표를 채웁니다. 열은 `id | 정답 | 출처에서 확인한 내용(한 줄) | 정답 하나뿐 | 출처 확인 | 최상급 기준과 시점`입니다. 해당 없는 칸은 `해당 없음`으로 적습니다.
6. 점검 명령과 문항 검수 명령을 실행합니다. 점검은 `통과 20, 실패 0`이어야 하고, 검수 명령에 해설 60자 초과와 부정형이 없어야 합니다.
7. 그 카테고리의 변경만 커밋합니다.

### Task 4: 한국사 10문항

**Files:**
- Modify: `questions.js` (첫머리 주석 3번째 줄, 한국사 10문항)
- Create: `QUESTION-REVIEW.md`

- [ ] **Step 1: `QUESTION-REVIEW.md`를 만든다**

```markdown
<!-- <생성 일시> KST -->

# 문항 검수표

출처는 모두 기관 자료이며, 문항마다 그 사실이 적힌 페이지를 직접 열어 확인했습니다. 최종 검수는 사용자가 이 표와 함께 문항을 보며 합니다.

## 한국사

| id | 정답 | 출처에서 확인한 내용 | 정답 하나뿐 | 출처 확인 | 최상급 기준과 시점 |
|---|---|---|---|---|---|

## 세계지리

| id | 정답 | 출처에서 확인한 내용 | 정답 하나뿐 | 출처 확인 | 최상급 기준과 시점 |
|---|---|---|---|---|---|

## 과학

| id | 정답 | 출처에서 확인한 내용 | 정답 하나뿐 | 출처 확인 | 최상급 기준과 시점 |
|---|---|---|---|---|---|

## 예술과 문화

| id | 정답 | 출처에서 확인한 내용 | 정답 하나뿐 | 출처 확인 | 최상급 기준과 시점 |
|---|---|---|---|---|---|
```

- [ ] **Step 2: `questions.js` 첫머리 주석 3번째 줄을 바꾼다**

```js
// 출처는 모두 기관 자료이며 <확인한 날짜>에 페이지를 열어 확인했다. 검수표는 QUESTION-REVIEW.md에 있다.
```

- [ ] **Step 3: 공통 절차 1~6으로 한국사 10문항을 고치고 검수표를 채운다** (교체 대상 `korean-history-06`, `korean-history-07`)

- [ ] **Step 4: 점검 명령과 문항 검수 명령을 실행한다**

Expected: 점검 `통과 20, 실패 0`, 종료 코드 0. 검수 명령에 한국사 문항의 해설 60자 초과와 부정형 없음

- [ ] **Step 5: 커밋한다**

```bash
git add questions.js QUESTION-REVIEW.md
git commit -m "content: 한국사 10문항 출처 재확인과 교체" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

### Task 5: 세계지리 10문항

**Files:**
- Modify: `questions.js` (세계지리 10문항), `QUESTION-REVIEW.md` (세계지리 표)

- [ ] **Step 1: 공통 절차 1~6으로 세계지리 10문항을 고치고 검수표를 채운다** (교체 대상 `world-geography-04`)
- [ ] **Step 2: 점검 명령과 문항 검수 명령을 실행한다**

Expected: 점검 `통과 20, 실패 0`, 종료 코드 0. 검수 명령에 세계지리 문항의 해설 60자 초과와 부정형 없음. 최상급 문제(`world-geography-02`, `world-geography-03` 등)는 기준과 시점이 문제에 있음

- [ ] **Step 3: 커밋한다**

```bash
git add questions.js QUESTION-REVIEW.md
git commit -m "content: 세계지리 10문항 출처 재확인과 교체" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

### Task 6: 과학 10문항

**Files:**
- Modify: `questions.js` (과학 10문항), `QUESTION-REVIEW.md` (과학 표)

- [ ] **Step 1: 공통 절차 1~6으로 과학 10문항을 고치고 검수표를 채운다** (교체 대상 `science-06`, `science-10`)
- [ ] **Step 2: 점검 명령과 문항 검수 명령을 실행한다**

Expected: 점검 `통과 20, 실패 0`, 종료 코드 0. 검수 명령에 과학 문항의 해설 60자 초과와 부정형 없음

- [ ] **Step 3: 커밋한다**

```bash
git add questions.js QUESTION-REVIEW.md
git commit -m "content: 과학 10문항 출처 재확인과 교체" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

### Task 7: 예술과 문화 10문항

**Files:**
- Modify: `questions.js` (예술과 문화 10문항), `QUESTION-REVIEW.md` (예술과 문화 표)

- [ ] **Step 1: 공통 절차 1~6으로 예술과 문화 10문항을 고치고 검수표를 채운다** (교체 대상 `arts-culture-07`)
- [ ] **Step 2: 점검 명령, 문항 검수 명령, 공통 절차 5의 겹침 확인을 40문항 전체에 대해 실행한다**

Expected: 점검 `통과 20, 실패 0`. 검수 명령에 해설 60자 초과와 부정형 0건. 겹침 확인에서 같은 사실을 묻는 문항 0건. `grep -c "wikipedia\|namu.wiki\|blog" questions.js`가 `0`

- [ ] **Step 3: 커밋한다**

```bash
git add questions.js QUESTION-REVIEW.md
git commit -m "content: 예술과 문화 10문항 출처 재확인과 교체" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

### Task 8: 1단계 점검과 보고 (여기서 멈춤)

- [ ] **Step 1: 점검 명령, 문항 검수 명령을 다시 실행하고 `git status`가 깨끗한지 확인한다**
- [ ] **Step 2: `quiz-static` 서버로 1단계 "브라우저에서 직접 확인할 항목"을 Claude가 먼저 확인한다** (`http://localhost:8123/`, `?test` 포함, 360px는 `resize_window`로 확인한 뒤 원래대로 되돌림)
- [ ] **Step 3: 보고하고 멈춘다**

보고에는 다음을 넣습니다.
- 점검 명령과 문항 검수 명령 결과
- 바꾼 문항 목록(교체한 주제와 이유)과 `QUESTION-REVIEW.md` 링크
- Claude가 확인한 항목과 확인하지 못한 항목. `file://` 더블클릭 확인은 사용자 몫이라고 밝힘
- 사용자가 확인할 1단계 "브라우저에서 직접 확인할 항목" 목록

**사용자가 "1단계 확인 끝났어"라고 하기 전에는 Task 9로 가지 않습니다.**

### Task 9: 1단계 병합과 GitHub Pages 배포 (사용자 승인 뒤, 끝나면 멈춤)

- [ ] **Step 1: GitHub의 기록이 이메일 정리 뒤의 기록인지 확인한다**

```bash
git fetch origin
git log -1 --format='%ae' origin/main
```

Expected: `331831451+dkstjdus123@users.noreply.github.com`. 실제 이메일이 나오면 사용자가 아직 강제 푸시를 하지 않은 것이므로, 멈추고 사용자에게 알린다.

- [ ] **Step 2: `stage-1`을 `main`에 병합한다**

```bash
git switch main
git merge --no-ff stage-1 -m "Merge branch 'stage-1': 1단계 연습 모드와 점수, 공통 기반 정리" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 3: 점검 명령을 실행한다** → `통과 20, 실패 0`
- [ ] **Step 4: GitHub에 올린다**

```bash
git push origin main
```

- [ ] **Step 5: GitHub Pages를 켠다** (이미 켜져 있으면 409 응답이 나오며 그대로 둔다)

```bash
gh api -X POST repos/dkstjdus123/Study03_Quiz/pages -f "source[branch]=main" -f "source[path]=/"
```

- [ ] **Step 6: 빌드가 끝났는지 확인한다**

```bash
gh api repos/dkstjdus123/Study03_Quiz/pages/builds/latest --jq .status
```

Expected: `built`. `building`이면 잠시 뒤 다시 확인한다.

- [ ] **Step 7: 배포 주소를 연다**: 앱 안 브라우저로 `https://dkstjdus123.github.io/Study03_Quiz/`와 `?test`를 열어 시작 화면과 `통과 20, 실패 0`을 확인한다.
- [ ] **Step 8: 배포 주소를 보고하고 멈춘다.** 사용자가 2단계를 시작하라고 하기 전에는 Task 10으로 가지 않는다.

---

# 2단계: 스피드 모드, 힌트 모드, 모드 선택, 틀린 문제 다시 풀기

**만들 것**
- 자체 점검에 힌트와 남은 시간 항목 추가
- 기능은 이미 있으므로 확인 항목대로 다시 점검하고, 어긋난 곳만 고침

**완료 기준**
- [ ] 점검 명령이 `자체 점검 결과: 통과 26, 실패 0`으로 끝난다.
- [ ] PRD 8장 2단계 항목을 모두 만족한다.

**브라우저에서 직접 확인할 항목** (`index.html` 더블클릭)
- [ ] 시작 화면에서 모드를 바꾸면 "순위표에 기록되지 않음"은 연습을 골랐을 때만 보인다.
- [ ] 스피드: 상단에 "남은 시간 15초"가 보이고 1초씩 줄어든다.
- [ ] 스피드: 아무것도 누르지 않으면 0초에 "시간 초과로 오답입니다."가 나오고 정답 보기가 초록색이 된다. 점수는 그대로다.
- [ ] 스피드: 답을 고르면 남은 시간이 그 자리에서 멈추고, [다음]을 누르면 15초부터 다시 센다.
- [ ] 스피드: 결과 화면에서 20초를 기다려도 아무 일이 없고, [다시 하기]를 누르면 15초부터 센다.
- [ ] 힌트: [힌트]를 누르면 오답 보기 2개가 흐려지고 눌리지 않으며, 정답은 지워지지 않는다. [힌트]는 꺼진다.
- [ ] 힌트: 힌트를 쓰고 맞히면 "정답입니다. 힌트를 써서 0.5점입니다."가 나오고 점수가 0.5 오른다. 결과 점수가 `8.5 / 10`처럼 맞게 나온다.
- [ ] 연습: 몇 문제를 틀리고 끝내면 [틀린 문제 다시 풀기]가 보이고, 누르면 틀린 문제만 나온다.
- [ ] 연습: 다시 풀기 결과에 "처음 점수"는 그대로이고 "다시 풀기 1회차: n문제 중 m개 맞힘"이 따로 나온다. 남은 문제가 없을 때까지 반복할 수 있고, 다 맞히면 "틀린 문제를 모두 맞혔습니다."가 나온다.
- [ ] 스피드와 힌트의 결과 화면에는 [틀린 문제 다시 풀기]가 없다.
- [ ] `?test` 콘솔에 "자체 점검 결과: 통과 26, 실패 0"이 나온다.

### Task 10: 힌트와 남은 시간 자체 점검 추가

**Files:**
- Modify: `script.js` (자체 점검 구역, 1단계 항목 다음)

**Interfaces:**
- Consumes: `createRound`, `answerCurrent`, `useHint`, `SPEED_SECONDS`, `remainingSeconds`, `sampleQuestion`, `check`, `expectEqual`
- Produces: `sampleHintRound()`

- [ ] **Step 1: 단계 브랜치를 만든다**

```bash
git switch -c stage-2
```

- [ ] **Step 2: 1단계 점검 항목 마지막(`questions.js의 실제 문항이 ...`) 바로 아래에 넣는다**

```js
// --- 2단계: 힌트, 남은 시간 ---

// 첫 문항은 정답이 0번, 둘째 문항은 정답이 1번인 힌트 모드 판
function sampleHintRound() {
  return createRound("hint", "한국사", [
    sampleQuestion({ id: "q-1" }),
    sampleQuestion({ id: "q-2", choices: ["오답1", "정답", "오답2", "오답3"], answer: 1 }),
  ]);
}

check("useHint는 정답이 아닌 보기 2개의 위치를 돌려준다", () => {
  const round = sampleHintRound();
  expectEqual(useHint(round, () => 0), [2, 3]);
  expectEqual(round.usedHint, true);
});

check("useHint는 어떤 경우에도 정답을 지우지 않는다", () => {
  for (let i = 0; i < 200; i += 1) {
    const round = sampleHintRound();
    round.index = 1;
    const removed = useHint(round);
    if (removed.length !== 2 || removed[0] === removed[1] || removed.includes(1)) {
      throw new Error(`지운 보기 ${JSON.stringify(removed)}`);
    }
  }
});

check("useHint는 한 문항에 한 번만, 답하기 전에만 쓸 수 있다", () => {
  const first = sampleHintRound();
  useHint(first);
  expectEqual(useHint(first), null);
  const second = sampleHintRound();
  answerCurrent(second, 0);
  expectEqual([useHint(second), second.usedHint], [null, false]);
});

check("힌트를 쓰고 맞히면 0.5점이다", () => {
  const round = sampleHintRound();
  useHint(round);
  expectEqual(answerCurrent(round, 0).points, 0.5);
});

check("스피드 모드 제한 시간은 15초다", () => {
  expectEqual(SPEED_SECONDS, 15);
});

check("remainingSeconds는 남은 시간을 초 단위로 올림하고, 지났으면 0이다", () => {
  expectEqual(
    [
      remainingSeconds(15000, 0),
      remainingSeconds(15000, 1),
      remainingSeconds(15000, 1000),
      remainingSeconds(15000, 14999),
      remainingSeconds(15000, 15000),
      remainingSeconds(15000, 20000),
    ],
    [15, 15, 14, 1, 0, 0],
  );
});
```

- [ ] **Step 3: 점검 명령을 실행한다**

Expected: `자체 점검 결과: 통과 26, 실패 0`, 종료 코드 0. 기능은 이미 있으므로 처음부터 통과하는 것이 정상이다. 실패하면 그 기능의 코드를 PRD 6장에 맞게 고친 뒤 다시 실행한다.

- [ ] **Step 4: 커밋한다**

```bash
git add script.js
git commit -m "feat: 힌트와 남은 시간 자체 점검 추가" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

### Task 11: 2단계 점검과 보고 (여기서 멈춤)

- [ ] **Step 1: `quiz-static` 서버로 2단계 "브라우저에서 직접 확인할 항목"을 Claude가 먼저 확인한다.** 어긋난 곳이 있으면 고치고, 점검 명령 `통과 26, 실패 0`을 확인한 뒤 `fix: <고친 내용>`으로 커밋한다.
- [ ] **Step 2: 보고하고 멈춘다.** 점검 결과, Claude가 확인한 항목, 사용자가 확인할 2단계 항목 목록을 적는다. **사용자가 "2단계 확인 끝났어"라고 하기 전에는 Task 12로 가지 않는다.**

### Task 12: 2단계 병합과 배포 (사용자 승인 뒤, 끝나면 멈춤)

- [ ] **Step 1: 병합하고 점검한다**

```bash
git switch main
git merge --no-ff stage-2 -m "Merge branch 'stage-2': 2단계 스피드, 힌트, 틀린 문제 다시 풀기" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

점검 명령 → `통과 26, 실패 0`

- [ ] **Step 2: 올리고 배포를 확인한다**

```bash
git push origin main
gh api repos/dkstjdus123/Study03_Quiz/pages/builds/latest --jq .status
```

Expected: `built`. 배포 주소의 `?test`에서 `통과 26, 실패 0`

- [ ] **Step 3: 보고하고 멈춘다.** 사용자가 3단계를 시작하라고 하기 전에는 Task 13으로 가지 않는다.

---

# 3단계: 점수 저장과 순위표

**만들 것**
- 순위표 규칙: 상위 5건, 기록에 이름, 이름 정리 함수 `cleanName`
- 결과 화면의 이름 입력과 [순위표에 기록], 순위표의 이름 열
- 자체 점검에 순위표 항목 추가

**완료 기준**
- [ ] 점검 명령이 `자체 점검 결과: 통과 36, 실패 0`으로 끝난다.
- [ ] PRD 7장과 8장 3단계 항목을 모두 만족한다.

**브라우저에서 직접 확인할 항목** (`index.html` 더블클릭)
- [ ] 시작 화면의 [순위표]를 누르면 스피드, 힌트 버튼과 카테고리 4개가 보이고, 기록이 없는 표에는 "아직 기록이 없습니다."가 보인다.
- [ ] 스피드 판을 끝내면 결과 화면에 "이름(별명)" 입력 칸과 [순위표에 기록]이 보인다. 연습 판 결과 화면에는 보이지 않는다.
- [ ] 이름을 비우거나 공백만 넣고 [순위표에 기록]을 누르면 "이름을 입력해 주세요."가 나오고 기록되지 않는다.
- [ ] 이름을 넣고 누르거나 Enter를 누르면 "순위표에 기록했습니다."가 나오고 입력 칸과 버튼이 잠긴다. 여러 번 눌러도 한 번만 기록된다.
- [ ] 순위표의 해당 표에 순위, 이름, 점수, 날짜가 보인다.
- [ ] 같은 표에 기록을 6개 이상 쌓으면 점수가 높은 5개만 남고, 같은 점수는 먼저 세운 기록이 위다.
- [ ] 기록하지 않고 [다시 하기]나 [처음으로]를 누른 판은 순위표에 없다.
- [ ] 브라우저를 완전히 닫았다가 다시 열어도 기록이 남아 있다.
- [ ] 폭 360px에서 결과 화면의 이름 입력 칸과 순위표가 가로 스크롤 없이 보인다.
- [ ] `?test` 콘솔에 "자체 점검 결과: 통과 36, 실패 0"이 나온다.

### Task 13: 순위표 규칙 (상위 5건, 이름)

**Files:**
- Modify: `script.js` (순위표 상수와 함수, 자체 점검 구역)

**Interfaces:**
- Consumes: `check`, `expectEqual`, `LEADERBOARD_KEY`, `boardKey`, `addRecord`, `loadBoard`, `saveBoard`, `formatDate`
- Produces: `LEADERBOARD_SIZE = 5`, `NAME_MAX_LENGTH = 12`, `cleanName(text): string | null`, `recordsFor(board, key)`가 `name`이 문자열이고 `score`가 숫자인 기록만 돌려줌, 기록 모양 `{ name, score, date }`

- [ ] **Step 1: 단계 브랜치를 만든다**

```bash
git switch -c stage-3
```

- [ ] **Step 2: 2단계 점검 항목 마지막 바로 아래에 순위표 점검을 넣는다**

```js
// --- 3단계: 순위표 ---

check("boardKey는 모드와 카테고리를 합친다", () => {
  expectEqual(boardKey("speed", "한국사"), "speed:한국사");
});

check("addRecord는 점수 높은 순으로 넣고 원래 순위표는 바꾸지 않는다", () => {
  const empty = {};
  const b1 = addRecord(empty, "speed:과학", { name: "가", score: 6, date: "d1" });
  const b2 = addRecord(b1, "speed:과학", { name: "나", score: 9, date: "d2" });
  const b3 = addRecord(b2, "speed:과학", { name: "다", score: 7.5, date: "d3" });
  expectEqual(b3["speed:과학"].map((r) => r.name), ["나", "다", "가"]);
  expectEqual([empty, b1["speed:과학"].length], [{}, 1]);
});

check("점수가 같으면 먼저 세운 기록이 위에 있다", () => {
  let board = addRecord({}, "hint:과학", { name: "먼저", score: 8, date: "d1" });
  board = addRecord(board, "hint:과학", { name: "나중", score: 8, date: "d2" });
  expectEqual(board["hint:과학"].map((r) => r.name), ["먼저", "나중"]);
});

check("표마다 상위 5개만 남긴다", () => {
  let board = {};
  for (let score = 1; score <= 6; score += 1) {
    board = addRecord(board, "speed:과학", { name: `n${score}`, score, date: `d${score}` });
  }
  expectEqual(board["speed:과학"].map((r) => r.score), [6, 5, 4, 3, 2]);
});

check("다른 표의 기록은 건드리지 않는다", () => {
  const before = { "hint:한국사": [{ name: "가", score: 5, date: "d" }] };
  const board = addRecord(before, "speed:한국사", { name: "나", score: 3, date: "e" });
  expectEqual(board["hint:한국사"], [{ name: "가", score: 5, date: "d" }]);
});

check("recordsFor는 이름이나 점수가 없는 항목을 버린다", () => {
  const board = {
    "speed:과학": [null, 1, "x", { score: 3, date: "예전 기록" }, { name: "가", date: "d" }, { name: "나", score: 4, date: "d" }],
  };
  expectEqual(recordsFor(board, "speed:과학"), [{ name: "나", score: 4, date: "d" }]);
  expectEqual(recordsFor({ "speed:과학": "깨진 값" }, "speed:과학"), []);
});

check("saveBoard로 저장한 순위표를 loadBoard로 다시 읽고, 깨진 값은 빈 순위표다", () => {
  const data = {};
  const storage = {
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = String(value);
    },
  };
  const board = addRecord({}, "speed:과학", { name: "가", score: 7, date: "2026-10-09 21:50" });
  expectEqual(saveBoard(storage, board), true);
  expectEqual(loadBoard(storage), board);
  ["{깨짐", "[1,2]", "null", "3"].forEach((broken) => {
    data[LEADERBOARD_KEY] = broken;
    expectEqual(loadBoard(storage), {});
  });
});

check("저장소를 쓸 수 없어도 멈추지 않는다", () => {
  const blocked = {
    getItem() {
      throw new Error("막힘");
    },
    setItem() {
      throw new Error("막힘");
    },
  };
  expectEqual([loadBoard(blocked), saveBoard(blocked, {}), loadBoard(null), saveBoard(null, {})], [{}, false, {}, false]);
});

check("formatDate는 YYYY-MM-DD HH:MM 형식으로 바꾼다", () => {
  expectEqual(formatDate(new Date(2026, 9, 9, 7, 5)), "2026-10-09 07:05");
});

check("cleanName은 앞뒤 공백을 지우고, 1~12자가 아니면 null이다", () => {
  expectEqual(
    [cleanName("  민수 "), cleanName("   "), cleanName(""), cleanName("가".repeat(12)), cleanName("가".repeat(13))],
    ["민수", null, null, "가".repeat(12), null],
  );
});
```

- [ ] **Step 3: 점검이 실패하는지 확인한다**

Run: 점검 명령
Expected: `실패:` 3줄(상위 5개, recordsFor, cleanName), `자체 점검 결과: 통과 33, 실패 3`, 종료 코드 1

- [ ] **Step 4: 순위표 규칙을 고친다**

`const LEADERBOARD_SIZE = 10;`을 다음 두 줄로 바꾼다.

```js
const LEADERBOARD_SIZE = 5;
const NAME_MAX_LENGTH = 12;
```

`boardKey` 위의 주석을 바꾼다.

```js
// 순위표는 { "speed:한국사": [{ name, score, date }, ...], ... } 모양이다.
```

`recordsFor`와 그 주석을 다음으로 바꾼다.

```js
// 손으로 고친 저장값이나 이름이 없던 예전 기록이 섞일 수 있어, 이름이 글자이고 점수가 숫자인 기록만 남긴다.
function recordsFor(board, key) {
  if (!Array.isArray(board[key])) {
    return [];
  }
  return board[key].filter(
    (record) =>
      record !== null &&
      typeof record === "object" &&
      typeof record.name === "string" &&
      typeof record.score === "number",
  );
}
```

`addRecord` 위 주석의 "상위 10개"를 "상위 5개"로 바꾼다.

`formatDate` 함수 바로 아래에 넣는다.

```js
// 입력한 이름의 앞뒤 공백을 지운다. 1~12자가 아니면 null을 돌려준다.
function cleanName(text) {
  const name = typeof text === "string" ? text.trim() : "";
  return name.length >= 1 && name.length <= NAME_MAX_LENGTH ? name : null;
}
```

- [ ] **Step 5: 점검이 통과하는지 확인한다**

Run: 점검 명령
Expected: `자체 점검 결과: 통과 36, 실패 0`, 종료 코드 0

- [ ] **Step 6: 커밋한다**

```bash
git add script.js
git commit -m "feat: 순위표를 상위 5건과 이름 기록으로 바꿈" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

### Task 14: 결과 화면 이름 입력과 순위표 이름 열

**Files:**
- Modify: `index.html` (54번째 줄 `result-saved`, 69번째 줄 순위표 머리글)
- Modify: `style.css` (끝에 추가)
- Modify: `script.js` (`setUpPage`, `nextQuestion`, `showResult`, `recordResult`, `renderBoard`, 새 함수 `handleRecord`)

**Interfaces:**
- Consumes: `cleanName`, `RANKED_MODES`, `addRecord`, `loadBoard`, `saveBoard`, `boardKey`, `formatDate`, `roundScore`
- Produces: HTML id `record-form`, `name-input`, `record-button`. `showResult()`는 인자가 없어짐. `recordResult(round, name): boolean`

- [ ] **Step 1: `index.html` 결과 화면의 `result-saved` 줄을 다음으로 바꾼다**

```html
      <form id="record-form" class="record-form" hidden>
        <label for="name-input">이름(별명)</label>
        <input id="name-input" type="text" maxlength="12" autocomplete="off">
        <button id="record-button" type="submit">순위표에 기록</button>
      </form>
      <p id="result-saved" class="notice" hidden></p>
```

- [ ] **Step 2: 순위표 머리글을 바꾼다**

```html
          <tr><th>순위</th><th>이름</th><th>점수</th><th>날짜</th></tr>
```

- [ ] **Step 3: `style.css` 끝에 추가한다**

```css
.record-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
}

.record-form input {
  flex: 1 1 140px;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  font: inherit;
}
```

- [ ] **Step 4: `setUpPage`의 `byId("home-button")...` 줄 바로 아래에 넣는다**

```js
  byId("record-form").addEventListener("submit", handleRecord);
```

- [ ] **Step 5: `nextQuestion`을 다음으로 바꾼다** (판이 끝날 때 자동 기록하지 않음)

```js
function nextQuestion() {
  if (goNext(app.round)) {
    showQuestion();
    return;
  }
  showResult();
}
```

- [ ] **Step 6: `showResult`를 바꾼다**

주석 줄 `// saved: 순위표에 기록했으면 ...`을 지우고, `function showResult(saved) {`를 `function showResult() {`로 바꾼다. 함수 끝의 `savedLine` 블록(`const savedLine = ...`부터 `"이 브라우저에서는 순위표에 기록할 수 없습니다.";`까지)을 다음으로 바꾼다.

```js
  // 스피드 모드와 힌트 모드만 이름을 받아 기록한다. 새 결과 화면마다 입력 칸을 비우고 다시 연다.
  byId("record-form").hidden = !RANKED_MODES.includes(round.mode);
  byId("name-input").value = "";
  byId("name-input").disabled = false;
  byId("record-button").disabled = false;
  byId("result-saved").hidden = true;
```

- [ ] **Step 7: `showResult` 바로 아래에 `handleRecord`를 넣는다**

```js
// 결과 화면에서 이름을 받아 이번 판을 순위표에 기록한다. 기록하면 다시 기록하지 못하게 잠근다.
function handleRecord(event) {
  event.preventDefault();
  const savedLine = byId("result-saved");
  savedLine.hidden = false;
  const name = cleanName(byId("name-input").value);
  if (name === null) {
    savedLine.textContent = "이름을 입력해 주세요.";
    return;
  }
  byId("name-input").disabled = true;
  byId("record-button").disabled = true;
  savedLine.textContent = recordResult(app.round, name)
    ? "순위표에 기록했습니다."
    : "이 브라우저에서는 순위표에 기록할 수 없습니다.";
}
```

- [ ] **Step 8: `recordResult`를 다음으로 바꾼다**

```js
// 끝난 판의 점수를 이름과 함께 순위표에 넣는다. 저장했으면 true를 돌려준다.
function recordResult(round, name) {
  const storage = browserStorage();
  const record = { name, score: roundScore(round), date: formatDate(new Date()) };
  const board = addRecord(loadBoard(storage), boardKey(round.mode, round.category), record);
  return saveBoard(storage, board);
}
```

- [ ] **Step 9: `renderBoard`의 칸 목록에 이름을 넣는다**

```js
    [`${i + 1}위`, record.name, `${formatScore(record.score)}점`, record.date].forEach((text) => {
```

- [ ] **Step 10: 점검 명령과 화면을 확인한다**

Run: 점검 명령 → `통과 36, 실패 0`, 종료 코드 0

`quiz-static` 서버로 3단계 "브라우저에서 직접 확인할 항목"을 확인한다. 확인이 끝나면 `localStorage.removeItem("quizLeaderboard")`로 점검 기록을 지운다.

- [ ] **Step 11: 커밋한다**

```bash
git add index.html style.css script.js
git commit -m "feat: 결과 화면에서 이름을 받아 순위표에 기록" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

### Task 15: 3단계 점검과 보고 (여기서 멈춤)

- [ ] **Step 1: 점검 명령, 문항 검수 명령, `git status`를 확인한다.**
- [ ] **Step 2: 보고하고 멈춘다.** 점검 결과, Claude가 확인한 항목, 사용자가 확인할 3단계 항목 목록을 적는다. **사용자가 "3단계 확인 끝났어"라고 하기 전에는 Task 16으로 가지 않는다.**

### Task 16: 3단계 병합과 배포 (사용자 승인 뒤)

- [ ] **Step 1: 병합하고 점검한다**

```bash
git switch main
git merge --no-ff stage-3 -m "Merge branch 'stage-3': 3단계 점수 저장과 순위표" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

점검 명령 → `통과 36, 실패 0`

- [ ] **Step 2: 올리고 배포를 확인한다**

```bash
git push origin main
gh api repos/dkstjdus123/Study03_Quiz/pages/builds/latest --jq .status
```

Expected: `built`. 배포 주소의 `?test`에서 `통과 36, 실패 0`

- [ ] **Step 3: 최종 보고한다.** 배포 주소, 단계별 커밋 목록, 남은 결정 사항을 적는다.

---

## PRD 대응표

| PRD | 태스크 |
|---|---|
| 2장 범위, 3장 앱 파일 4개 | 1 (`tests/` 삭제, 자체 점검) |
| 4.1 형식 | 4~7 |
| 4.2 작성 규칙 | 4~7 (문항 검수 명령) |
| 4.3 출처 규칙과 검수표 | 4~7 (`QUESTION-REVIEW.md`) |
| 4.4 문항 데이터 검사 | 1, 2 (검사), 3 (화면 표시) |
| 5장 화면 흐름, 6장 연습 모드 | 8 (확인) |
| 6장 스피드, 힌트, 다시 풀기 | 10, 11 |
| 7장 순위표 | 13, 14 |
| 8장 단계별 멈춤, 커밋, 배포 | 8, 9, 11, 12, 15, 16 |
| 9장 검증 방법 | 1 (점검 명령, `?test`), 각 단계 확인 항목 |
