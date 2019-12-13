function attachEvents() {
    const url = `https://rest-messanger.firebaseio.com/messanger.json`;
    const sendBtn = document.getElementById("submit");
    const refreshBtn = document.getElementById("refresh");
    const authorInp = document.getElementById("author");
    const messageInp = document.getElementById("content");
    const messageBox = document.getElementById("messages");

    sendBtn.addEventListener('click',sendMessage);
    refreshBtn.addEventListener('click',getMessages);


    function sendMessage() {
        const author = authorInp.value;
        const content = messageInp.value;
        console.log(authorInp.value,messageInp.value);
        
      const header = {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({author, content})
      }
      fetch(url,header)
      .then(
          authorInp.value='',
            messageInp.value='')
       .catch(console.log())
    }

    function getMessages() {
        fetch(url)
        .then(res=>res.json())
        .then(displayMessages)
        .catch(console.log)
    }
    function displayMessages(data) {
        Object.entries(data).forEach(([id,inp]) => {
            const {author,content} = inp;
            messageBox.value += `${author}:${content}\n`;                       
        });
    }

}
attachEvents();