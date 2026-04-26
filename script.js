function login() {
  window.location.href = "dashboard.html";
}

function logout() {
  window.location.href = "index.html";
}

function addComment() {
  let input = document.getElementById("commentInput");
  let list = document.getElementById("commentsList");

  let li = document.createElement("li");
  li.innerHTML = input.value;

  list.appendChild(li);
  input.value = "";
}