function login() {
    const usernameInput = document.getElementById("username");
    const username = usernameInput.value;

    const passwordInput = document.getElementById("password");
    const password = passwordInput.value;

    let hasError = false;
    if (username === null || username === undefined || username.length === 0) {
        usernameInput.nextElementSibling.style.display = "block";
        document.getElementById("username").style.borderColor = "red"
        document.getElementById("usernameErrorSpan").style.borderColor = "block";
        hasError = true;
    }


    if (password === null || password === undefined || password.length === 0) {
        passwordInput.nextElementSibling.style.display = "block";
        document.getElementById("password").style.borderColor = "red"
        document.getElementById("usernameErrorSpan").style.borderColor = "red";
        hasError = true;
    }

    if (hasError) {
        return;
    }

    document.getElementById("usernameErrorSpan").style.borderColor = "none";
    passwordInput.nextElementSibling.style.display = "none";

    const body = {
        "username": username, "password": password,
    }
    const lang = document.getElementById("current-lang").textContent;

    fetch("http://localhost:8080/api/v1/auth/registration/login", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept-Language': lang,
        }, body: JSON.stringify(body)
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject(response.text());
        }
    }).then(data => {
        console.log(data);
        localStorage.setItem("userDetail", JSON.stringify(data));
        localStorage.setItem("jwtToken", data.jwt);

        passwordInput.value = '';
        usernameInput.value = '';
        window.location.href = "./profile-post-list.html";
    }).catch(async error => {
        const errMessage = await error;
        alert(errMessage);
    })
}