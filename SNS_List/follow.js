const DATA_URL = "https://user-list.alphacamp.io/api/v1/users";
const SHOW_URL = DATA_URL + "/";
const dataPanel = document.querySelector("#data-panel");

//追蹤清單使用者資料的陣列
const users = JSON.parse(localStorage.getItem('followedUsers')) || []

//show出全部使用者資料的函示
function renderUserList(data) {
  let rawHTML = "";

  data.forEach((item) => {
    // title image
    rawHTML += `<div class="col-sm-3">
      <div class="mb-2">
        <div class="card">
          <img src="${item.avatar}" class="card-img-top btn-show-user" alt="User Avatar" data-id="${item.id}" style="border-radius: 50%;" data-bs-toggle="modal" data-bs-target="#user-modal">
          <div class="card-body">
          </div>
            <div class="card-footer d-flex justify-content-between">
            <h5 class="card-title">${item.name}</h5>
              <i class="fa-solid fa-heart btn-remove-follow" style="color:red;" data-id="${item.id}"></i>
            </div>
        </div>
      </div>
    </div>`;
  });

  dataPanel.innerHTML = rawHTML;
}

//使用者資料的Modal
function showUserModal(id) {
  const modalTitle = document.querySelector("#user-modal-title");
  const modalImage = document.querySelector("#user-modal-image");
  const modalInfo = document.querySelector("#user-modal-info");

  axios.get(SHOW_URL + id).then((response) => {
    const data = response.data;
    modalTitle.innerText = `${data.name} ${data.surname}`;
    modalImage.innerHTML = `<img
                  src="${data.avatar}"
                  alt="user-avatar" class="img-fuid">`;
    modalInfo.innerText = `Email: ${data.email}\nGender: ${data.gender}\n
Age: ${data.age}\n
Region: ${data.region}\n
Birthday: ${data.birthday}`;
  });
}

//從追蹤清單移除
function removeToFollow(id) {
  console.log("start")
  if (!users || !users.length) return
  const userID = users.findIndex(user => user.id === id)

  users.splice(userID, 1)

  localStorage.setItem('followedUsers', JSON.stringify(users))

  renderUserList(users)
}


//點擊頭像的監聽事件
dataPanel.addEventListener("click", function onClickAvatar(event) {
  const targetId = Number(event.target.dataset.id);
  if (event.target.matches(".btn-show-user")) {
    showUserModal(targetId);
  } else if (event.target.matches('.btn-remove-follow')) {
    removeToFollow(Number(event.target.dataset.id))
    event.target.classList.remove('fa-solid')
    event.target.classList.add('fa-regular')
  }
});


//渲染頁面
renderUserList(users);
