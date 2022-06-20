const token = localStorage.getItem("x-access-token");

if (token) {
  alert("이미 로그인 상태입니다");
  location.href = "index.html";
}

const buttonSignin = document.getElementById("signin");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");

buttonSignin.addEventListener("click", handleSignin);

async function handleSignin(event) {
  const emailText = inputEmail.value;
  const passwordText = inputPassword.value;

  const isNotValidInput = !emailText || !passwordText;

  if (isNotValidInput) {
    return false;
  }

  const config = {
    method: "post",
    url: url + "/sign-in",
    data: {
      email: emailText,
      password: passwordText,
    },
  };

  try {
    const res = await axios(config);

    if (res.data.code !== 200) {
      alert(res.data.message);
      return false;
    }

    localStorage.setItem("x-access-token", res.data.result.token);

    alert(res.data.message);

    location.href = "index.html";

    return true;
  } catch (error) {
    console.error(error);
  }
}
