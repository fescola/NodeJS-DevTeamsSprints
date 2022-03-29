const res = require('express/lib/response')
const Room = require('../models/Room')
const User = require('../models/User')



const html = async(req, res) => {
    res.sendFile(process.cwd() + '/app/index.html');
}
const createRoom = async(req, res) => {
    const room = new Room({
        name: req.body.name
    });
    try {
        const savedRoom = await room.save();
        console.log(`new room saved: ${savedRoom}`)
        res.json({ error: null, data: savedRoom });
    } catch (error) {
        res.status(400).json({ error });
    }
}
const addUser = async(req, res) => {
    const user = await User.findOne({ name: req.body.name })
    if (!user) {
        return res.status(400).json({ error: "User doesnt exist" })
    }
    try {
        if (await Room.findOne({ name: req.params.name, users: user })) {
            return res.status(400).json({ error: "User already in room" })
        }
        await Room.findOne({ name: req.params.name }).updateOne({ $push: { users: user } })
        res.status(200).json({ message: "User saved" })
        console.log('new user created')
    } catch (error) {
        res.status(400).json({ error });
    }
}
const saveMsg = async(room, data) => {
    try {
        console.log(room)
        await Room.findOne({ name: room }).updateOne({ $push: { messages: data } })
    } catch (error) {
        res.json({ error })
    }
}
const deleteUserFromRoom = async(req, res) => {
    const user = await User.findOne({ name: req.body.name })
    if (!user) {
        return res.status(400).json({ error: "User doesnt exist" })
    }
    try {
        if (await Room.findOne({ name: req.params.name, users: user })) {
            await Room.findOne({ name: req.params.name }).updateOne({ $pull: { users: user } })
            res.status(200).json({ message: "User deleted" })
        } else return res.status(400).json({ error: "User is not in room" })
    } catch (error) {
        res.status(400).json({ error });
    }
}
const getRooms = async(req, res) => {
    let rooms = await Room.find({})
    res.json(rooms)
}
const getRoomData = async(req, res) => {
    try {
        let room = await Room.find({ name: req.params.name })
        if (!room) {
            res.status(400).json({ message: 'room doesnt exist' })
        }
        res.status(200).json(room)
    } catch (error) {
        res.status(400).json({ error })
    }
}
const loged = async(req, res) => {
    const user = await User.findOne({ email: req.body.email });
    res.status(200).json({ user: user.name, login: true })
}

module.exports = {
    html,
    createRoom,
    addUser,
    saveMsg,
    deleteUserFromRoom,
    getRooms,
    loged,
    getRoomData
};