const jwt = require("jsonwebtoken");
const { jwtSecret } = require("./secret");

exports.jwtMiddleware = async function (req, res, next) {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.send({
      isSuccess: false,
      code: 403,
      message: "로그인이 되어 있지 않습니다.",
    });
  }

  try {
    const verifiedToken = jwt.verify(token, jwtSecret);
    req.verifiedToken = verifiedToken;
    next();
  } catch {
    return res.send({
      isSuccess: false,
      code: 403,
      message: "토큰 검증 실패",
    });
  }
};
