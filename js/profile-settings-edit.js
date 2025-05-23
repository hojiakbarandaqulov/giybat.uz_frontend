window.onload = function () {
    const userDetailJon = localStorage.getItem("userDetail");
    if (!userDetailJon) {
        return;
    }

    const userDetailObj = JSON.parse(userDetailJon);

    document.getElementById("profile_settings_name").value = userDetailObj.name;
    document.getElementById("profile_settings_username").value = userDetailObj.username;
    if (userDetailObj.photo) {
        document.getElementById("profile_settings_photo").src = userDetailObj.photo.url;
    }
};

function profileDetailUpdate(message) {
    const name = document.getElementById("profile_settings_name").value
    if (!name) {
        alert("Enter the name input.")
    }
    const body = {
        "name": name
    }
    const jwt = localStorage.getItem("jwtToken");
    if (!jwt) {
        window.location.href = './login.html';
        return;
    }
    const lang = document.getElementById("current-lang").textContent;

    fetch("http://localhost:8080/api/v1/profile/detail", {
        method: 'PUT', headers: {
            'Content-Type': 'application/json', 'Accept-Language': lang, 'Authorization': 'Bearer ' + jwt
        }, body: JSON.stringify(body)
    }).then(response => {
        if (!response.ok) {
            return response.json()
        } else {
            return Promise.reject(response.text());
        }
    }).then(data => {
        alert(data.message);
        document.getElementById("profile_settings_current_pswd").value = "";
        document.getElementById("profile_settings_new_pswd").value = "";
    }).catch(error => {
        error.then(errMessage => {
            alert(errMessage)
            const userDetailJon = localStorage.getItem("userDetail");
            const userDetail = JSON.parse(userDetailJon);
            userDetail.name = name
            localStorage.setItem("userDetail", JSON.stringify(userDetail));
            const headerUserNameSpan = document.getElementById("header_user_name_id")
            headerUserNameSpan.textContent = name
        })
    })
}

function profilePasswordUpdate() {
    const currentPassword = document.getElementById("profile_settings_current_pswd").value
    const newPswd = document.getElementById("profile_settings_new_pswd").value
    if (!currentPassword) {
        alert("Enter the currentPswd input.")
    }
    const body = {
        "currentPassword": currentPassword,
        "newPassword": newPswd
    }
    const jwt = localStorage.getItem("jwtToken");
    if (!jwt) {
        window.location.href = './login.html';
        return;
    }
    const lang = document.getElementById("current-lang").textContent;
    fetch("http://localhost:8080/api/v1/profile/update/password", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwt,
            'Accept-Language': lang
        },
        body: JSON.stringify(body)
    }).then(response => {
        if (response.ok) {
            return response.json()
        } else {
            return Promise.reject(response.text());
        }
    }).then(data => {
        alert(data.message)
        console.log(data)
    }).catch(error => {
        error.then(errMessage => {
            alert(errMessage);
        })
    })
}

/*  const currentPswd = localStorage.getItem("currentPassword");
           const userDetail = JSON.parse(currentPswd);
           userDetail.name = name
           localStorage.setItem("userDetail", JSON.stringify(userDetail));*/
function profileUserNameChange() {
    const username = document.getElementById("profile_settings_username").value
    if (!username) {
        alert("Enter the currentPswd input.")
    }
    const body = {
        "username": username,
    }
    const jwt = localStorage.getItem("jwtToken");
    if (!jwt) {
        window.location.href = './login.html';
        return;
    }
    const lang = document.getElementById("current-lang").textContent;

    fetch("http://localhost:8080/api/v1/profile/update/username", {
        method: 'PUT', headers: {
            'Content-Type': 'application/json', 'Accept-Language': lang, 'Authorization': 'Bearer ' + jwt
        }, body: JSON.stringify(body)
    }).then(response => {
        if (response.ok) {
            return response.json()
        } else {
            return Promise.reject(response.text());
        }
    }).then(data => {
        document.getElementById("confirmModalResultId").textContent = data.message;
        openModal()
    }).catch(error => {
        closeModal();
        error.then(errMessage => {
            alert(errMessage);
        })
    })
}

function profileUserNameChangeConfirm() {
    const confirmCode = document.getElementById("profileUserNameChaneConfirmInputId").value

    if (!confirmCode) {
        alert("Enter the currentPswd input.")
        return;
    }
    closeModal();
    const body = {
        "code": confirmCode,
    }
    const jwt = localStorage.getItem("jwtToken");
    if (!jwt) {
        window.location.href = './login.html';
        return;
    }
    const lang = document.getElementById("current-lang").textContent;

    fetch("http://localhost:8080/api/v1/profile/update/confirm", {
        method: 'POST', headers: {
            'Content-Type': 'application/json',
            'Accept-Language': lang,
            'Authorization': 'Bearer ' + jwt
        }, body: JSON.stringify(body)
    }).then(response => {
        if (response.ok) {
            return response.json()
        } else {
            return Promise.reject(response.text());
        }
    }).then(data => {
        alert(data.message)
        localStorage.setItem("jwtToken", data.data);

        const username = document.getElementById("profile_settings_username").value;
        const userDeatilJon = localStorage.getItem("userDetail");
        const userDetail = JSON.parse(userDeatilJon);
        userDetail.username = username;
        userDetail.jwt = data.data
        localStorage.setItem("userDetail", JSON.stringify(userDetail));
        localStorage.setItem("userDetail", username);
    }).catch(error => {
        error.then(errMessage => {
            alert(errMessage);
        })
    })
}

//------------ Change username confirm modal start ------------
const modal = document.getElementById('simpleModalId');

function openModal() {
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = "none";
}

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

//------------ Change username confirm modal end ------------

// ------------ Image preview ------------
function previewImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function () {
        const img = document.getElementById('profile_settings_photo');
        img.src = reader.result;
    };

    if (file) {
        reader.readAsDataURL(file);
        document.getElementById('profile_settings_upload_img_btn_id').style.display = 'inline-block';
    }
}

// ------------ Image upload ------------
function uploadImage() {
    const fileInput = document.getElementById('imageUpload');
    const file = fileInput.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const jwt = localStorage.getItem('jwtToken');
        if (!jwt) {
            window.location.href = './login.html';
            return;
        }
        const lang = document.getElementById("current-lang").textContent;

        fetch('http://localhost:8080/api/v1/attach/upload', {
            method: 'POST', headers: {
                'Accept-Language': lang, 'Authorization': 'Bearer ' + jwt
            }, body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // console.log("Success:", data);
                if (data.id) {
                    updateProfileImage(data.id); // profile update image

                    const userDetailJon = localStorage.getItem("userDetail");
                    const userDetail = JSON.parse(userDetailJon);
                    userDetail.photo = {};
                    userDetail.photo.id = data.id;
                    userDetail.photo.url = data.url;
                    localStorage.setItem("userDetail", JSON.stringify(userDetail));

                    document.getElementById("header_user_image_id").src = data.url;
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

function updateProfileImage(photoId) {
    // d1d4fbc7-d819-4226-a8b9-f6f3a3d7ba7f.png

    if (!photoId) {
        alert("Enter the name input.")
    }
    const body = {
        "photoId": photoId
    }
    const jwt = localStorage.getItem("jwtToken");
    if (!jwt) {
        window.location.href = './login.html';
        return;
    }
    const lang = document.getElementById("current-lang").textContent;

    fetch("http://localhost:8080/api/v1/profile/photo", {
        method: 'PUT', headers: {
            'Content-Type': 'application/json',
            'Accept-Language': lang, 'Authorization': 'Bearer ' + jwt
        }, body: JSON.stringify(body)
    }).then(response => {
        if (!response.ok) {
            return response.json()
        } else {
            return Promise.reject(response.text());
        }
    }).then(data => {
        alert(data.message);
    }).catch(error => {
        error.then(errMessage => {
            document.getElementById('profile_settings_upload_img_btn_id').style.display = 'none';
            alert(errMessage)
            const userDetailJon = localStorage.getItem("userDetail");
            const userDetail = JSON.parse(userDetailJon);
            userDetail.name = name
            localStorage.setItem("userDetail", JSON.stringify(userDetail));
            const headerUserNameSpan = document.getElementById("header_user_name_id")
            headerUserNameSpan.textContent = name
        })
    })
}