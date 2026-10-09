// 2026-10-09 22:22 KST
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
  set[1] = makeQuestion({ id: "c0-2", source: undefined });
  assert.deepEqual(validateQuestions(set), [
    "c0-1: 해설(explanation)이 비어 있습니다.",
    "c0-2: 출처(source)에 name과 http(s)로 시작하는 url이 있어야 합니다.",
  ]);
});

test("출처가 { name, url } 모양이 아니면 경고한다", () => {
  const broken = [
    "문자열 출처",
    null,
    { name: "", url: "https://example.com" },
    { name: "출처", url: "" },
    { name: "출처", url: "example.com" },
    { name: "출처", url: "javascript:alert(1)" },
  ];
  for (const source of broken) {
    const set = makeValidSet();
    set[0] = makeQuestion({ id: "c0-1", source });
    assert.deepEqual(
      validateQuestions(set),
      ["c0-1: 출처(source)에 name과 http(s)로 시작하는 url이 있어야 합니다."],
      JSON.stringify(source),
    );
  }
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
