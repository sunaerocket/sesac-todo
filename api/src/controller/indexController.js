const {
  insertTodo,
  selectTodoByType,
  selectValidTodo,
  updateTodo,
  removeTodo,
} = require("../dao/indexDao");

const validator = {
  isNotFullInput: (userIdx, contents, type) => !userIdx || !contents || !type,
  isOverLength: (contents) => contents.length > 20,
  isNotValidType: (type) =>
    !["do", "decide", "delete", "delegate"].includes(type),
  hasNotValidIds: (userIdx, todoIdx) => !userIdx || !todoIdx,
  hasNoContents: (contents) => !contents,
  hasNoStatus: (status) => !status,
  isNotValidTodoList: (todoList) => todoList.length < 1,
  isFalseUpdate: (updated) => !updated,
  isFalseDelete: (deleted) => !deleted,
};

exports.createTodo = async (req, res) => {
  const { userIdx } = req.verifiedToken;
  const { contents, type } = req.body;

  const { isNotFullInput, isOverLength, isNotValidType } = validator;

  if (isNotFullInput(userIdx, contents, type)) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "입력값 누락",
    });
  }

  if (isOverLength(contents)) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "콘텐츠 20글자 초과",
    });
  }

  if (isNotValidType(type)) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "타입 오류",
    });
  }

  const result = await insertTodo(userIdx, contents, type);

  if (!result) {
    return res.send({
      isSuccess: false,
      code: 403,
      message: "요청 실패",
    });
  }

  return res.send({
    isSuccess: true,
    code: 200,
    message: "일정 생성 성공",
  });
};

exports.readTodo = async (req, res) => {
  const { userIdx } = req.verifiedToken;

  const todos = {};

  const types = ["do", "decide", "delegate", "delete"];

  for (let type of types) {
    let todoByType = await selectTodoByType(userIdx, type);

    if (!todoByType) {
      return res.send({
        isSuccess: true,
        code: 400,
        message: "일정 조회 실패",
      });
    }

    todos[type] = todoByType;
  }

  return res.send({
    isSuccess: true,
    code: 200,
    message: "일정 조회 성공",
    result: todos,
  });
};

exports.updateTodo = async (req, res) => {
  const { userIdx } = req.verifiedToken;
  const { todoIdx } = req.body;
  let { contents, status } = req.body;

  const {
    hasNotValidIds,
    hasNoContents,
    hasNoStatus,
    isNotValidTodoList,
    isFalseUpdate,
  } = validator;

  if (hasNotValidIds(userIdx, todoIdx)) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "userIdx, todoIdx 필요",
    });
  }

  if (hasNoContents(contents)) {
    contents = null;
  }

  if (hasNoStatus(status)) {
    status = null;
  }

  const todoList = await selectValidTodo(userIdx, todoIdx);

  if (isNotValidTodoList(todoList)) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "요청 무효, userIdx와 todoIdx 확인",
    });
  }

  const updated = await updateTodo(userIdx, todoIdx, contents, status);

  if (isFalseUpdate(updated)) {
    req.send({
      isSuccess: false,
      code: 400,
      message: "수정 실패",
    });
  }
  return res.send({
    isSuccess: true,
    code: 200,
    message: "수정 성공",
  });
};

exports.deleteTodo = async (req, res) => {
  const { userIdx } = req.verifiedToken;
  const { todoIdx } = req.params;

  const { hasNotValidIds, isNotValidTodoList, isFalseDelete } = validator;

  if (hasNotValidIds(userIdx, todoIdx)) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "userIdx, todoIdx 확인",
    });
  }

  const todoList = await selectValidTodo(userIdx, todoIdx);

  if (isNotValidTodoList(todoList)) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "요청 무효, userIdx, todoIdx 확인",
    });
  }

  const deleted = await removeTodo(userIdx, todoIdx);

  if (isFalseDelete(deleted)) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "삭제 실패",
    });
  }

  return res.send({
    isSuccess: true,
    code: 200,
    message: "삭제 성공",
  });
};
