readTodo();

async function readTodo() {
  const token = localStorage.getItem("x-access-token");

  if (!token) {
    return;
  }

  const config = {
    method: "get",
    url: url + "/todos",
    headers: {
      "x-access-token": token,
    },
  };

  try {
    const res = await axios(config);
    if (res.data.code !== 200) {
      alert(res.data.message);
      return false;
    }

    const todos = res.data.result;

    for (let section in todos) {
      const sectionUi = document.querySelector(`#${section} ul`);
      const sectionItems = todos[section];

      let result = "";
      for (let todo of sectionItems) {
        let element = `
        <li class="list-item" id=${todo.todoIdx}>
            <div class="done-text-container">
                <input type="checkbox" class="todo-done" ${
                  todo.status === "C" ? "checked" : ""
                }/>
                <p class="todo-text">
                    ${todo.contents}
                </p>
            </div>
            <div class="update-delete-container">
                <i class="todo-update fas fa-pencil-alt"></i>
                <i class="todo-delete fas fa-trash-alt"></i>
            </div>
        </li>
        `;
        result += element;
      }

      sectionUi.innerHTML = result;
    }
  } catch (error) {
    console.error(error);
  }
}

const matrixContainer = document.querySelector(".matrix-container");
matrixContainer.addEventListener("keypress", handleCreate);
matrixContainer.addEventListener("click", handleUpdate);

function handleCreate(event) {
  const token = localStorage.getItem("x-access-token");

  if (!token) {
    return;
  }

  const {
    target: { tagName },
    type,
    key,
  } = event;

  const isInputEntered = tagName === "INPUT" && key === "Enter";

  if (isInputEntered) {
    createTodo(event, token);
    return;
  }
}

async function createTodo(event, token) {
  const contents = event.target.value;
  const type = event.target.closest(".matrix-item").id;

  if (!contents) {
    alert("내용을 입력해주세요");
    return false;
  }

  const config = {
    method: "post",
    url: url + "/todo",
    headers: { "x-access-token": token },
    data: {
      contents,
      type,
    },
  };

  try {
    const res = await axios(config);

    if (res.data.code !== 200) {
      alert(res.data.message);
      return false;
    }

    readTodo();
    event.target.value = "";
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

function handleUpdate(event) {
  const token = localStorage.getItem("x-access-token");

  if (!token) {
    return;
  }

  const { target, type, key } = event;

  const isDoneClicked = target.className === "todo-done" && type === "click";
  if (isDoneClicked) {
    updateTodoDone(event, token);
    return;
  }

  const isPencilClicked =
    target.className.split(" ")[0] === "todo-update" && type === "click";
  if (isPencilClicked) {
    updateTodoContents(event, token);
    return;
  }

  const isTrashClicked =
    target.className.split(" ")[0] === "todo-delete" && type === "click";
  if (isTrashClicked) {
    deleteTodo(event, token);
    return;
  }
}

async function updateTodoDone(event, token) {
  const status = event.target.checked ? "C" : "A";
  const todoIdx = event.target.closest(".list-item").id;

  const config = {
    method: "patch",
    url: url + "/todo",
    headers: { "x-access-token": token },
    data: { todoIdx, status },
  };

  try {
    const res = await axios(config);

    if (res.data.code !== 200) {
      alert(res.data.message);
      return false;
    }

    readTodo();
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function updateTodoContents(event, token) {
  const contents = prompt("내용을 입력해주세요.");
  const todoIdx = event.target.closest(".list-item").id;

  const config = {
    method: "patch",
    url: url + "/todo",
    headers: { "x-access-token": token },
    data: { todoIdx, contents },
  };

  try {
    const res = await axios(config);

    if (res.data.code !== 200) {
      alert(res.data.message);
      return false;
    }

    readTodo();
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function deleteTodo(event, token) {
  const confirmDelete = confirm("삭제하시겠습니까?");

  if (!confirmDelete) {
    return false;
  }

  const todoIdx = event.target.closest(".list-item").id;
  const config = {
    method: "delete",
    url: url + `/todo/${todoIdx}`,
    headers: { "x-access-token": token },
  };

  try {
    const res = await axios(config);

    if (res.data.code !== 200) {
      alert(res.data.message);
      return false;
    }

    readTodo();
  } catch (error) {
    console.error(error);
    return false;
  }
}
