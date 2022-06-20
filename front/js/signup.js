const token = localStorage.getItem("x-access-token");

if (token) {
  alert("이미 로그인 상태입니다");
  location.href = "index.html";
}

// 입력값 유효성 검사

const inputEmail = document.getElementById("email");
const emailMessage = document.querySelector("div.email-message");
inputEmail.addEventListener("input", isValidEmail);

function isValidEmail(event) {
  const emailText = inputEmail.value;

  const emailReg =
    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

  const isNotValidEmail = !emailReg.test(emailText);

  if (isNotValidEmail) {
    emailMessage.style.visibility = "visible";
    return false;
  }

  emailMessage.style.visibility = "hidden";

  return true;
}

const inputPassword = document.getElementById("password");
const passwordMessage = document.querySelector("div.password-message");
inputPassword.addEventListener("input", isValidPassword);

function isValidPassword(event) {
  const passwordText = inputPassword.value;

  const passwordReg = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,20}$/;

  const isNotValidPassword = !passwordReg.test(passwordText);

  if (isNotValidPassword) {
    passwordMessage.style.visibility = "visible";
    return false;
  }

  passwordMessage.style.visibility = "hidden";

  return true;
}

const inputConfirm = document.getElementById("password-confirm");
const confirmMessage = document.querySelector("div.password-confirm-message");
inputConfirm.addEventListener("input", isValidConfirm);

function isValidConfirm(event) {
  const confirmText = inputConfirm.value;
  const passwordText = inputPassword.value;

  const isNotValidConfirm = passwordText !== confirmText;

  if (isNotValidConfirm) {
    confirmMessage.style.visibility = "visible";
    return false;
  }

  confirmMessage.style.visibility = "hidden";

  return true;
}

const inputNickname = document.getElementById("nickname");
const nicknameMessage = document.querySelector("div.nickname-message");
inputNickname.addEventListener("input", isValidNickname);

function isValidNickname(event) {
  const nicknameText = inputNickname.value;

  const isValidNickname = nicknameText.length < 2 || nicknameText.length > 10;

  if (isValidNickname) {
    nicknameMessage.style.visibility = "visible";
    return false;
  }

  nicknameMessage.style.visibility = "hidden";

  return true;
}

const buttonSignup = document.getElementById("signup");
buttonSignup.addEventListener("click", handleSignup);

async function handleSignup(event) {
  const isNotValidRequest = !(
    isValidEmail() &&
    isValidPassword() &&
    isValidConfirm() &&
    isValidNickname()
  );

  if (isNotValidRequest) {
    alert("회원 정보 검증 실패");
    return false;
  }

  const emailText = inputEmail.value;
  const passwordText = inputPassword.value;
  const nicknameText = inputNickname.value;

  const config = {
    method: "post",
    url: url + "/user",
    data: {
      email: emailText,
      password: passwordText,
      nickname: nicknameText,
    },
  };
  try {
    const res = await axios(config);

    if (res.data.code === 400) {
      alert(res.data.message);
      location.reload();
      return false;
    }

    if (res.data.code === 200) {
      alert(res.data.message);
      location.href = "signin.html";
      return true;
    }
  } catch (error) {
    console.error(error);
  }
}
