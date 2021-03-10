const socket = io();

const $messages = document.querySelector('#messages');
const $sidebar = document.querySelector('#sidebar');

const messageTemplate = document.querySelector('#message-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;


const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix:true })

socket.on('message', (message) =>{
    const html = Mustache.render(messageTemplate,{
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend',html)
})

socket.on('roomData', ({room, users})=>{
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    });
    document.querySelector('#sidebar').innerHTML = html
})

document.querySelector('#message-form').addEventListener('submit', (e) =>{
    e.preventDefault();
    const message = e.target.elements.message.value;
    socket.emit('sendMessage',message)
})

socket.emit('join', { username, room })

