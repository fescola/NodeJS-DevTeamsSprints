(() => {
    let registerForm = document.getElementById('registerForm');
    let loginForm = document.getElementById('loginForm')
    let loginURL = 'http://localhost:3000/api/user/login'
    let registerURL = 'http://localhost:3000/api/user/register'
    let JWTURL = 'http://localhost:3000/login'
    let googleURL = 'http://localhost:3000/google'
    let registerBtn = document.getElementById('registerBtn')
    let loginBtn = document.getElementById('loginBtn')
        //registerForm.style.display = 'none';
    let user = localStorage.getItem('username')
    registerBtn.addEventListener('click', function(e) {
        loginContainer.style.display = 'none'
        showRegister()
    })
    loginBtn.addEventListener('click', function(e) {
        hideRegister()
        showLogin()
    })

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let data = {
            name: document.getElementById('username').value,
            email: document.getElementById('registeremail').value,
            password: document.getElementById('registerpassword').value
        }
        postData(registerURL, data)
            .then(req => {
                console.log(req); // JSON data parsed by `data.json()` call
                hideLoginRegister()
            })
            .catch(e => console.log(e))
    });

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let data = {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            }
            //calling API to check login info
        postData(loginURL, data)
            .then(req => {
                //get JWT back and send it as header for a get request
                data.jwt = req.jwt
                postLogin(JWTURL, data)
                    .then(req => { //localStorage.setItem('username', 'anonimous')
                        if (req.login === true) {
                            localStorage.setItem('username', req.user)
                            hideLoginRegister()
                            let tag = document.createElement("script");
                            tag.src = "./script.js";
                            document.getElementsByTagName("head")[0].appendChild(tag);
                        } else {
                            alert('wrong password or email')
                            data.name = ''
                            data.password = ''
                        }
                        //TODO fix this properly and check local storage for logged users
                        //userJoin(data)
                    })
            })
            .catch(e => console.log(e))
    });


    //fetch functions
    let loginContainer = document.getElementById('contenedorLogin')
    let loginbkgrd = document.getElementById('backgroundLogin')
    let registerContainer = document.getElementById('contenedorRegister')

    async function postData(url = '', data = {}) {
        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }
    async function postLogin(url = '', data = {}) {
        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': data.jwt
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data)
        });
        console.log(response)
        return response.json();
    }

    hideLoginRegister = () => {
        if (registerContainer.style.display === "none" || loginbkgrd.style.display === "none" || loginContainer.style.display === "none" || loginbkgrd.style.display === "none") {
            registerContainer.style.display = "block";
            loginbkgrd.style.display = "block";
            loginContainer.style.display = "block";
        } else {
            registerContainer.style.display = "none";
            loginbkgrd.style.display = "none";
            loginContainer.style.display = "none";
        }
    }
    hideRegister = () => {
        registerContainer.style.display = "none";
    }
    showRegister = () => {
        registerContainer.style.display = "block";
    }
    showLogin = () => {
        loginContainer.style.display = "block";
    }
    if (user) {
        hideLoginRegister()
        let tag = document.createElement("script");
        tag.src = "./script.js";
        document.getElementsByTagName("head")[0].appendChild(tag);
    }

    const googleLogin = async() => {
        let response = await fetch(googleURL, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer'
        });
        response = await response.json()
        let googlelogin = document.getElementById('googleLogin')
        googlelogin.innerHTML = `<a id='googleLogin' href="${response.URL}">Login with Google_</a>`
    }
    if (window.location.href != 'http://127.0.0.1:5500/test/index.html#') {
        //postData(googleURL + '-auth', { url: window.location.href })
        console.log('comeback from google login');
    }
    //googleLogin()
    hideRegister()
})();