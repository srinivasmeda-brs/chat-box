function loadScript() {
    
    const user = prompt("Please enter your name", "User") || "Anonymous";

    const pubnub = new PubNub({
        publishKey: 'demo',
        subscribeKey: 'demo',
        userId: user,
    });

    
    pubnub.subscribe({
        channels: ['ws-channel'],
    });

    
    pubnub.addListener({
        message: (payload) => {
          
            console.log("Message received:", payload);

            
            const msgClass = user === payload.publisher ? 'sender-msg' : 'receiver-msg';
            const messageString = `
                <div class="${msgClass}">
                    <strong>${payload.publisher}</strong>: ${payload.message}
                </div>
            `;
            
            const messagesDiv = document.getElementById('messages');
            messagesDiv.innerHTML += messageString;

            
            messagesDiv.scrollTop = messagesDiv.scrollHeight; 
        },
    });

  
    document.getElementById('input-form').addEventListener('submit', (event) => {
        event.preventDefault(); 

        const inputMessage = document.getElementById('message');
        if (inputMessage.value) {
            
            pubnub.publish({
                channel: 'ws-channel',
                message: inputMessage.value,
            }, (status, response) => {
                if (status.error) {
                    console.error("Publish failed: ", status);
                } else {
                    console.log("Message published: ", response);
                }
            });

            inputMessage.value = ""; 
        }
    });
}

window.onload = loadScript;
