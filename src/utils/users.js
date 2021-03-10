const users = [];

const addUser = ({id, username, room})=>{
    // username = username.trim().toLowerCase();
    // room = room.trim().toLowerCase();

    if(!username || !room){
        return {
            'error': 'Username and room are required!'
        }
    }

    const existingUser = users.find((user) =>{
        return user.username === username && user.room === room;
    })

    if(existingUser){
        return {
            'error': 'User is already exist!'
        }
    }

    const user = {id, username, room}
    users.push(user);
    return {user}
}

const getUser = (id) =>{
    const res = users.find((user) => user.id === id)
    return res;
}

const getUsersInRoom = (room) =>{
    const res = users.filter((user) => user.room === room);
    return res;
}

const removeUser = (id) =>{
    const index = users.findIndex((user) => user.id === id)

    if(index !== -1){
        return users.splice(index,1)[0]
    }
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}