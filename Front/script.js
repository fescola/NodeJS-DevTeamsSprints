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
    });
    socket.on('room connection', function(msg, roomUsers) {
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
        try {
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
        } catch (error) { console.log(error); }
    }
    const usersInRoom = (roomUsers) => {
            try {
                if (!roomUsers || roomUsers === undefined) {
                    let item = document.createElement('li');
                    item.textContent = user
                    users.appendChild(item);
                    return
                }
                for (let i of roomUsers) {
                    let item = document.createElement('li');
                    item.textContent = i;
                    users.appendChild(item);
                }
            } catch (error) { console.log(error); }
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
        try {
            let room = await getData(`${URL}/rooms/${name}`)
            room = room[0]
            if (!room) return
            messages.innerHTML = '';
            let roomMsg
            if (room.messages === undefined) {
                return
            }
            if (room.messages.length > 17) {
                roomMsg = room.messages.slice(-17)
            } else if (room.messages.length <= 17) {
                roomMsg = room.messages.slice(-room.messages.length)
            } else { return }
            for (let i of roomMsg) {
                let item = document.createElement('li');
                item.textContent = `${i.user}: ${i.msg}`;
                messages.appendChild(item);
                messages.scrollTop = messages.scrollHeight;
            }
        } catch (error) { console.log(error); }
    }
    getRooms()
    socket.emit('userConnected', user)
        //getGoogleAcc()
})();