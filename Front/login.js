(() => {
    let registerForm = document.getElementById('registerForm');
    let loginForm = document.getElementById('loginForm')
    let loginURL = 'http://localhost:3000/api/user/login'
    let registerURL = 'http://localhost:3000/api/user/register'
    let JWTURL = 'http://localhost:3000/login'
    let googleURL = 'http://localhost:3000/google'
    let registerBtn = document.getElementById('registerBtn')
    let loginBtn = document.getElementById('loginBtn')
    let user = localStorage.getItem('username')
    let logout = document.getElementById('logout')

    registerBtn.addEventListener('click', function(e) {
        loginContainer.style.display = 'none'
        registerContainer.style.display = "block";
    })
    loginBtn.addEventListener('click', function(e) {
        registerContainer.style.display = "none";
        loginContainer.style.display = "block";
    })
    logout.addEventListener('click', function(e) {
        localStorage.removeItem('username')
        window.location.reload();
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
                console.log(req);
                alert('Register completed')
                window.location.reload();
                //hideLoginRegister()
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
                    .then(req => {
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
                    })
            })
            .catch(e => console.log(e))
    });


    //fetch functions
    let loginContainer = document.getElementById('contenedorLogin')
    let loginbkgrd = document.getElementById('backgroundLogin')
    let registerContainer = document.getElementById('contenedorRegister')

    hideLoginRegister = () => {
        registerContainer.style.display = "none";
        loginbkgrd.style.display = "none";
        loginContainer.style.display = "none";

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
    }
    //googleLogin()
    registerContainer.style.display = "none";
})();