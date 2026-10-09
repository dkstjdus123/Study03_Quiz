// 2026-10-09 22:27 KST
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
