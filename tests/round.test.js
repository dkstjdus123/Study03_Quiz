// 2026-10-09 22:25 KST
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
