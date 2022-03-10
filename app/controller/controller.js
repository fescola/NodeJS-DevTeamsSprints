const Room = require('../models/Room')
const User = require('../models/User')


const test = async (req, res) => {
    res.send('test')
}
const createRoom = async (req, res) => {
    const room = new Room({
        name: req.body.name,
        users: req.body.users
    });
    try {
        const savedRoom = await room.save();
        console.log(`new user saved: ${savedRoom}`)
        res.json({ error: null, data: savedRoom });
    } catch (error) {
        res.status(400).json({ error });
    }
}
const addUser = async (req, res) => {
    const user = await User.findOne({ name: req.body.name })
    if(!user){
        return res.status(400).json({error:"User doesnt exist"})
    }
    try {
        if( await Room.findOne({ name: req.params.name, users: user })){
           return res.status(400).json({error:"User already in room"})
        }
        await Room.findOne({ name: req.params.name }).updateOne({ $push: { users: user } })
        res.status(200).json({message:"User saved"})
    }
    catch (error) {
        res.status(400).json({ error });
    }
}
const saveMsg = async(req,res)=>{

}
const deleteUserFromRoom = async(req,res)=>{
    const user = await User.findOne({ name: req.body.name })
    if(!user){
        return res.status(400).json({error:"User doesnt exist"})
    }
    try{
        if( await Room.findOne({ name: req.params.name, users: user })){
            await Room.findOne({ name: req.params.name }).updateOne({ $pull: { users: user } })
            res.status(200).json({message:"User deleted"})
         }
         else return res.status(400).json({error:"User is not in room"})
    }
    catch(error){
        res.status(400).json({ error });
    }
}
module.exports = {
    test,
    createRoom,
    addUser,
    deleteUserFromRoom
};