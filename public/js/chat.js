const socket = io()

const logout = document.getElementById('logoutLink')
const clientsTotal = document.getElementById('clients-total')
const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')

messageForm.addEventListener('submit', sendMessage)
logout.addEventListener('click', logoutUser)

function logoutUser(e){
    e.preventDefault()
    localStorage.removeItem('token')
    window.location.href = '/'
}


document.addEventListener('DOMContentLoaded', getMessages)

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

async function getMessages(){
    try{
        const token = localStorage.getItem('token')
        const userId = (parseJwt(token)).userId
        const response = await axios.get('/chat/getMessages')
        const chats = response.data.chats
        console.log(chats)
        chats.forEach(chat => {
            if(chat.userId === userId){
                addMessageToUI(true, chat)
            }else{
                addMessageToUI(false, chat)
            }
        });
    }catch(err){
        console.log('Error fetching messages: ', err)
    }
}

async function sendMessage(e){
    e.preventDefault()
    console.log(messageInput.value)
    const data = {
        token: localStorage.getItem('token'),
        message: messageInput.value,
        dateTime: new Date()
    }
    const response = axios.post('/chat', data)
    socket.emit('message', data)
    addMessageToUI(true, data)
    messageInput.value = ''

}

socket.on('clients-total', (data) => {
    clientsTotal.innerText = `Total clients: ${data}`
})

socket.on('chat-message', (data) => {
    // console.log(data)
    addMessageToUI(false, data)
})

async function addMessageToUI(isOwnMessage, data){
    const response =  axios.get(`user/${data.userId}`)
    // const senderInfo = response.data.name
    const element = `
                    <li class="${isOwnMessage ? "message-right" : "message-left"}">
                        <p class="message">
                            ${data.message}
                            <span>someone • ${moment(data.dateTime).fromNow()}</span>
                        </p>
                    </li>`

    messageContainer.innerHTML += element
    scrollToBottom()
}

function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
}