const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../secret");
const {
  insertUser,
  selectUserByEmail,
  selectUser,
  selectNicknameByUserIdx,
} = require("../dao/userDao");

const emailRegex =
  /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,20}$/;

const validator = {
  signup: {
    hasIncompleteInput: (email, password, nickname) =>
      !email || !password || !nickname,
    isNotValidEmail: (email) => !emailRegex.test(email),
    isNotValidPassword: (password) => !passwordRegex.test(password),
    isNotValidNickname: (nickname) =>
      nickname.length < 2 || nickname.length > 10,
    isFalseCreate: (created) => !created,
    isDuplicated: (duplicated) => duplicated.length > 0,
  },
  signin: {
    isIncompleteInput: (email, password) => !email || !password,
    isNotValidUser: (selected) => !selected || selected < 1,
  },
};

exports.signup = async (req, res) => {
  const { email, password, nickname } = req.body;

  const {
    hasIncompleteInput,
    isNotValidEmail,
    isNotValidPassword,
    isNotValidNickname,
    isFalseCreate,
    isDuplicated,
  } = validator.signup;

  if (hasIncompleteInput(email, password, nickname)) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "회원가입 데이터 누락",
    });
  }

  if (isNotValidEmail(email)) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "이메일 형식 검증 실패",
    });
  }

  if (isNotValidPassword(password)) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "패스워드 형식 검증 실패",
    });
  }

  if (isNotValidNickname(nickname)) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "닉네임 형식 검증 실패",
    });
  }

  const duplicated = await selectUserByEmail(email);

  if (isDuplicated(duplicated)) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "중복 가입",
    });
  }

  const created = await insertUser(email, password, nickname);

  if (isFalseCreate(created)) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "회원가입 실패",
    });
  }

  return res.send({
    isSuccess: true,
    code: 200,
    message: "회원가입 성공",
  });
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  const { isIncompleteInput, isNotValidUser } = validator.signin;

  if (isIncompleteInput(email, password)) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "로그인 데이터 누락",
    });
  }

  const selected = await selectUserByEmail(email, password);

  if (isNotValidUser(selected)) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "회원 검증 실패",
    });
  }

  const [user] = selected;
  const { userIdx } = user;

  const token = jwt.sign(
    {
      userIdx,
    },
    jwtSecret
  );

  return res.send({
    isSuccess: true,
    code: 200,
    message: "토큰 발행 성공",
    result: { token },
  });
};

exports.getNicknameByToken = async (req, res) => {
  const { userIdx } = req.verifiedToken;

  const [userInfo] = await selectNicknameByUserIdx(userIdx);

  const nickname = userInfo.nickname;

  return res.send({
    result: { nickname },
    isSuccess: true,
    code: 200,
    message: "토큰 검증 성공",
  });
};
