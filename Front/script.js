(() => {
    var socket = io("http://localhost:3000");

    var messages = document.getElementById('messages');
    var form = document.getElementById('form');
    var input = document.getElementById('input');
    var addRoom = document.getElementById('addRoom')
    var rooms = document.getElementById('rooms')
    var roomInput = document.getElementById('roomInput')
    var users = document.getElementById('users')
    var title = document.getElementById('title')
        //var joinRoom = document.getElementById('')
    let URL = 'http://localhost:3000'
    let user = localStorage.getItem('username')

    let allRooms = {};
    let printedRooms = []

    userJoin = (data) => {
        let userli = document.createElement('li');
        userli.textContent = data.email
        users.appendChild(userli);
    }

    addRoom.addEventListener('submit', async function(e) {
        e.preventDefault();
        socket.emit('addRoom')
        addNewRoom()
    })

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let data = {}
        data.msg = input.value
        data.user = user
        if (input.value) {
            socket.emit('chat message', data);
            input.value = '';
        }
    });

    socket.on('chat message', function(data) {
        let item = document.createElement('li');
        item.textContent = `${data.user}: ${data.msg}`;
        messages.appendChild(item);
        messages.scrollTop = messages.scrollHeight;
        //window.scrollTo(0, document.body.scrollHeight);
    });
    socket.on('room connection', function(msg, roomUsers) {
        //user = localStorage.getItem('username')
        let item = document.createElement('li');
        item.textContent = `${msg}`;
        messages.appendChild(item);
        users.innerHTML = ''
        usersInRoom(roomUsers)
    })

    socket.on('refreshRooms', function() {
        getRooms()
    })
    socket.on('disconnectOldUser', function() {
        console.log('disconnected old user');
        alert('your account connected from another device')
        socket.disconnect();
        localStorage.removeItem('username')
        document.location.reload(true)
    })
    const joinRoom = (room) => {
        getRoomData(room)
        socket.emit('connectRoom', room, user);
        title.textContent = room;
    }
    const getRooms = async() => {
        allRooms = await getData(`${URL}/rooms`);
        for (let room of allRooms) {
            if (printedRooms.includes(room.name)) {
                continue
            }
            let newRoom = document.createElement('li');
            newRoom.innerHTML = `<a href="#" id="${room.name+"btn"}">${room.name}</a>`
            rooms.appendChild(newRoom);
            printedRooms.push(room.name)
            newRoom.addEventListener('click', function(e) {
                joinRoom(room.name);
            })
        }
    }
    const usersInRoom = (roomUsers) => {
        if (!roomUsers || roomUsers === undefined) {
            let item = document.createElement('li');
            item.textContent = user
            users.appendChild(item);
            return console.log('room is empty')
        }
        for (let i of roomUsers) {
            let item = document.createElement('li');
            item.textContent = i;
            users.appendChild(item);
            console.log(roomUsers)
        }
    }
    const getGoogleAcc = () => {
        //console.log(await getData(googleURL + '-auth'));
        console.log(window.location.href);
    }
    async function getData(url = '') {
        const response = await fetch(url, {
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
        return response.json();
    }
    //function creates new li, adds the room if it doesnt exist and calls joinRoom, then posts the room on the server
    const addNewRoom = async() => {
        let room = document.createElement('li');
        let exists = await allRooms.some(el => el.name === roomInput.value);
        if (exists) {
            roomInput.value = '';
            M.toast({ html: 'Room already exists' })
        }
        if (roomInput.value && !exists) {
            allRooms.push(room.name)
            data = { name: roomInput.value }
            postData(`${URL}/room`, data)
            roomInput.value = '';
        }
    }

    const getRoomData = async(name) => {
        let room = await getData(`${URL}/rooms/${name}`)
        room = room[0]
        if (!room) return console.log('room doesnt exist')
        messages.innerHTML = '';
        let roomMsg
        if (room.messages === undefined) {
            return console.log('there is no messages')
        }
        if (room.messages.length > 17) {
            roomMsg = room.messages.slice(-17)
        } else if (room.messages.length <= 17) {
            roomMsg = room.messages.slice(-room.messages.length)
        } else { return console.log('there is no messages') }
        for (let i of roomMsg) {
            let item = document.createElement('li');
            item.textContent = `${i.user}: ${i.msg}`;
            messages.appendChild(item);
            messages.scrollTop = messages.scrollHeight;
        }
    }
    getRooms()
    socket.emit('userConnected', user)
    getGoogleAcc()
})();