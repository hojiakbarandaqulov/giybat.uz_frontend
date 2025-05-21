function getPostList(page = 0, size = 10) {
    const jwt = localStorage.getItem('jwtToken');
    if (!jwt) {
        window.location.href = './login.html';
        return;
    }

    const lang = document.getElementById("current-lang").textContent;

    fetch(`http://localhost:8080/api/v1/post/profile?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept-Language': lang,
            'Authorization': 'Bearer ' + jwt
        }
    }).then(response => {
        if (response.ok) {
            return response.json()
        } else {
            return Promise.reject(response.text());
        }
    }).then(data => {
        console.log(data);
        showPostList(data.content); // assume Spring-style { content, totalPages, totalElements, ... }
        renderPagination(data.totalPages, page);
    }).catch(error => {
        error.then(errMessage => {
            alert(errMessage)
        })
    });
}
