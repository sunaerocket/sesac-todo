const {
  signup,
  signin,
  getNicknameByToken,
} = require("../controller/userController");

const { jwtMiddleware } = require("../../jwtMiddleware");

exports.userRouter = (app) => {
  app.post("/user", signup);
  app.post("/sign-in", signin);
  app.get("/jwt", jwtMiddleware, getNicknameByToken);
};
