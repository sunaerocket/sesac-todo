const {
  createTodo,
  readTodo,
  updateTodo,
  deleteTodo,
} = require("../controller/indexController");

const { jwtMiddleware } = require("../../jwtMiddleware");

exports.indexRouter = (app) => {
  app.post("/todo", jwtMiddleware, createTodo);
  app.get("/todos", jwtMiddleware, readTodo);
  app.patch("/todo", jwtMiddleware, updateTodo);
  app.delete("/todo/:todoIdx", jwtMiddleware, deleteTodo);

  app.get("/dummy", (req, res, next) => {
    console.log(1);
    next();
  });
};
