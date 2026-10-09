// 2026-10-09 22:47 KST
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

test("recordsFor는 기록 모양이 아닌 항목을 버린다", () => {
  const board = { "speed:과학": [null, 1, "x", { date: "d" }, { score: 3, date: "d" }] };
  assert.deepEqual(recordsFor(board, "speed:과학"), [{ score: 3, date: "d" }]);
});

test("addRecord는 깨진 항목이 섞인 표에도 기록을 넣는다", () => {
  const board = addRecord({ "speed:과학": [null, { score: 5, date: "a" }] }, "speed:과학", { score: 7, date: "b" });
  assert.deepEqual(board["speed:과학"], [{ score: 7, date: "b" }, { score: 5, date: "a" }]);
});
