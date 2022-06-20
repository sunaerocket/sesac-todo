setHeader();

async function setHeader() {
  const token = localStorage.getItem("x-access-token");

  if (!token) {
    const signed = document.querySelector(".signed");

    signed.classList.add("hidden");
    return;
  }

  const config = {
    method: "get",
    url: url + "/jwt",
    headers: {
      "x-access-token": token,
    },
  };

  const res = await axios(config);

  if (res.data.code !== 200) {
    console.log("토큰 검증 실패");
    return;
  }

  const { nickname } = res.data.result;
  const spanNickname = document.querySelector("span.nickname");
  spanNickname.innerText = nickname;

  const unsigned = document.querySelector(".unsigned");
  unsigned.classList.add("hidden");
}

const buttonSignout = document.getElementById("sign-out");
buttonSignout.addEventListener("click", handleSignout);
function handleSignout() {
  localStorage.removeItem("x-access-token");
  location.reload();
}
