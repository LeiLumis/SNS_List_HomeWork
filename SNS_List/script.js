const DATA_URL = "https://user-list.alphacamp.io/api/v1/users";
const SHOW_URL = DATA_URL + "/";
const dataPanel = document.querySelector("#data-panel");

//社群使用者資料的陣列
let users = [];
const followUsers = JSON.parse(localStorage.getItem('followedUsers')) || []

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
              <i class="${followUsers.some(followUser => followUser.id === item.id) ? "fa-solid" : "fa-regular"} fa-heart btn-add-follow" style="color:red;" data-id="${item.id}"></i>
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

//新增進追蹤清單
function addToFollow(id) {
  const list = JSON.parse(localStorage.getItem('followedUsers')) || []
  const user = users.find(user => user.id === id)

  if (list.some((user => user.id === id))) {
    return alert('已經在追蹤清單中！')
  } else {
    alert('成功加入追蹤清單！')
  }

  list.push(user)
  localStorage.setItem('followedUsers', JSON.stringify(list))
}

//點擊頭像的監聽事件
dataPanel.addEventListener("click", function onClickAvatar(event) {
  const targetId = Number(event.target.dataset.id);
  if (event.target.matches(".btn-show-user")) {
    showUserModal(targetId);
  } else if (event.target.matches('.btn-add-follow')) {
    addToFollow(Number(event.target.dataset.id))
    event.target.classList.remove('fa-regular')
    event.target.classList.add('fa-solid')
  }
});


//請求API資料，渲染頁面
axios
  .get(DATA_URL)
  .then((response) => {
    users.push(...response.data.results);
    renderUserList(users);
  })
  .catch((err) => console.log(err));
