// 2026-10-09 22:36 KST
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
