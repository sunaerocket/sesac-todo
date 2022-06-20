const compression = require("compression");
const cors = require("cors");
const { indexRouter } = require("./src/router/indexRouter");
const { userRouter } = require("./src/router/userRouter");

const express = require("express");
const app = express();
const port = 3000;

// 개발 편의를 위해 cors 미들웨어 설정
app.use(
  cors({
    origin: ["http://127.0.0.1:5500"],
    credentials: true,
  })
);

// body json 파싱
app.use(express.json());

// HTTP 요청 압축
app.use(compression());

// 정적파일 제공
app.use(express.static("front"));

// 라우터 분리
indexRouter(app);
userRouter(app);

app.listen(port, () => {
  console.log(`Express app listening at port: ${port}`);
});
