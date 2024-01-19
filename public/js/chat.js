const socket = io()

const clientsTotal = document.getElementById('clients-total')
const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')

messageForm.addEventListener('submit', sendMessage)

async function sendMessage(e){
    e.preventDefault()
    console.log(messageInput.value)
    const data = {
        token: localStorage.getItem('token'),
        message: messageInput.value,
        dateTime: new Date()
    }
    // socket.emit('message', data)
    addMessageToUI(true, data)
    messageInput.value = ''
    const response = await axios.post('/chat', data)

}

// socket.on('clients-total', (data) => {
//     clientsTotal.innerText = `Total clients: ${data}`
// })

// socket.on('chat-message', (data) => {
//     // console.log(data)
//     addMessageToUI(false, data)
// })

function addMessageToUI(isOwnMessage, data){
    const element = `
                    <li class="${isOwnMessage ? "message-right" : "message-left"}">
                        <p class="message">
                            ${data.message}
                            <span>You • ${moment(data.dateTime).fromNow()}</span>
                        </p>
                    </li>`

    messageContainer.innerHTML += element
    scrollToBottom()
}

function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
}