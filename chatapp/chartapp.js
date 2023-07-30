
/*

<form enctype="multipart/form-data" id="image">
                            <label for="file"><i style="background-color: #913175; border-color: #CD5888;" class="material-icons btn btn-primary">attachment</i></label>
                            <input type="file" id="file" style="display:none;" name="file">
                            <button id="sendAttachmentButton" style="background-color: #913175; border-color: #CD5888;" class="btn btn-primary btn-sm">send</button>
                        </form>

const socket = io('http://localhost:3000')


const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

const name = prompt('What is your name?')
appendMessage('You joined')
socket.emit('new-user', name)

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  appendMessage(`You: ${message}`)
  socket.emit('send-chat-message', message)
  messageInput.value = ''
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}
*/
const groupname=document.getElementById('groupname');
groupname.addEventListener('click',(e)=>{
    e.preventDefault();
    const token=localStorage.getItem('token')
    window.open(`../groupcreate/groupCreate.html?token=${token}`,"_blank");
})

document.addEventListener('DOMContentLoaded',async(e)=>{
    e.preventDefault();
    const token=localStorage.getItem('token');
    await axios.get('http://localhost:3000/group/groups',{headers:{'Authorization':token}}).then(result=>{
        console.log(result.data);
        const groups = result.data;
        for(let group of groups){
            findGroup(group);
        }
    })
})

async function findGroup(group){
    let groups = document.getElementById('groups');
    let groupButton = document.createElement('button');
    groupButton.innerHTML=group.name ;
    const buttonid=group.id;
    groupButton.id=buttonid;
    groups.appendChild(groupButton);
    localStorage.setItem('group',0);
    groupButton.onclick=(event)=>{
        clearButtons();
        event.preventDefault();
        const clickedButtonId = event.target.id;
        localStorage.setItem('group',clickedButtonId);
        const tokenId = localStorage.getItem('token');
        const messageContainer=document.getElementById('adduserbuttonContainer');


        //add user button
        const adduserButton=document.createElement('button');
        adduserButton.innerHTML= 'Add User';
        messageContainer.appendChild(adduserButton)
        adduserButton.onclick=(event)=>{
            event.preventDefault();
            const url = `../adduser/adduser.html?id=${clickedButtonId}&token=${tokenId}`;
            window.open(url);
        }

        // remove user button 
        const removeuserbutton=document.createElement('button')
        removeuserbutton.innerHTML='Remove User';
        removeuserbutton.style.background='#0275d8';
        messageContainer.appendChild(removeuserbutton);
        removeuserbutton.onclick=(event)=>{
            event.preventDefault();
            const removeUrl=`../removeuser/remove.html?id=${clickedButtonId}&token=${tokenId}`;
            window.open(removeUrl);
        }
        
        
        const messageSenderForm=document.getElementById('footer-input');
        messageSenderForm.style.display='flex';
        sendmessage(group.id);
        //show messages
        showmessage(group.id);
        //file send to group my be message
        filesend(group.id);
    }
}

//send file to the group
async function filesend(groupid){
    
    const sendAttachmentButton = document.getElementById('sendAttachmentButton');
    sendAttachmentButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const attachment = document.getElementById('file');
        const file = attachment.files[0];

        if (file) {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('file', file);
        console.log(formData)

        await axios
            .post(`http://localhost:3000/user/file?groupid=${groupid}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: token,
            },
            })
            .then((res) => {
            console.log(res);
            })
            .catch((err) => {
            console.log(err);
            });
        }
    });
}





//clear all buttons when sfited from one to another group
async function clearButtons() {
    const buttonDiv = document.getElementById('adduserbuttonContainer');
    const buttons = buttonDiv.getElementsByTagName('button');

    // Remove each button from the div
    while (buttons.length > 0) {
        buttonDiv.removeChild(buttons[0]);
    }
}

//send message to the particulr group which one is opended
async function sendmessage(groupid){
    const messageButton = document.getElementById('messageButton');

    messageButton.addEventListener('click',async(e)=>{
        // const sendergroupid=groupid;
        e.preventDefault();
        const message=document.getElementById('message').value;
        document.getElementById('message').value=null;
        console.log(message)
        const token = localStorage.getItem('token');
        console.log(token)
        const response = await axios.post('http://localhost:3000/user/message',{message:message,groupid:groupid},{headers:{'Authorization':token}})
        console.log(response.data);
        const reply = {
            user : {
                name : response.data.username
            },
            message : response.data.message
        }
        show(reply);
    });
}

//show the messages
async function showmessage(groupid){
    const token = localStorage.getItem('token');
    let start=0;
    console.log(start);
    await axios.get(`http://localhost:3000/user/allreply?start=${start}&group=${groupid}`,{headers:{'Authorization':token}}).then(response=>{
        console.log(response);
        const backData=response.data.message;
        localStorage.setItem('messages',JSON.stringify(backData));
        const replies = JSON.parse(localStorage.getItem('messages'));
        console.log(replies)
        const group=Number(localStorage.getItem('group'));
        console.log(group,typeof(group))
        
        for( let reply of replies){
            if(reply.groupId===group){
                show(reply);
            }
        }
    
    });
   
    lastmessage(groupid);
}

async function show(reply){
        const messageBox=document.getElementById('message-container');
        const mesageshow = document.createElement('div');
        mesageshow.innerHTML=`<h3 id="reply">${reply.user.name}:${reply.message}</h3>`
        const { width } = mesageshow.getBoundingClientRect();
        mesageshow.style.width = `${width}px`;
        mesageshow.style.whiteSpace = 'nowrap';
        messageBox.appendChild(mesageshow);
}

async function lastmessage(groupid){
    // setInterval(async()=>{
        const localfullmessage=JSON.parse(localStorage.getItem('messages'));
        console.log(localfullmessage);
        console.log(localfullmessage[localfullmessage.length-1]);
        const locallastmessageid=localfullmessage[localfullmessage.length-1].id;
        console.log(locallastmessageid)
        const group=parseInt(localStorage.getItem('group'))
        console.log(group);
        const token=localStorage.getItem('token');
    // setInterval(async()=>{
        const dblastmessage=await axios.get(`http://localhost:3000/user/lastmessage?group=${group}`,{headers:{'Authorization':token}});
        console.log(dblastmessage);
        const flag=compareObjects(locallastmessageid,dblastmessage.data.id);
        console.log('compare',locallastmessageid,dblastmessage.data.id)
        console.log(flag);
        if(flag===false){
            const final=localfullmessage.concat(dblastmessage.data);
            console.log(final);
            localStorage.setItem('messages',JSON.stringify(final));
            showafter(dblastmessage);
        }
    // },2000);
}

function compareObjects(obj1, obj2) {
    if(obj1!=obj2){
        return false;
    }
  
    return true;
  }

  async function showafter(dblastmessage){
        console.log('show after calling')
        const messageBox=document.getElementById('message-container');
        const mesageshow = document.createElement('div');
        mesageshow.innerHTML=`<h3 id="reply">${dblastmessage.data.user.name}:${dblastmessage.data.message}</h3>`
        mesageshow.style.color='rgb(235, 231, 34)';
        const { width } = mesageshow.getBoundingClientRect();
        mesageshow.style.width = `${width}px`;
        mesageshow.style.whiteSpace = 'nowrap';
        mesageshow.style.marginLeft = '20px';
        messageBox.appendChild(mesageshow);
  }
/*.container.pull-right::before{
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  
  opacity: 0.06;
} */