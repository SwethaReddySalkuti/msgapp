var urlParams = new URLSearchParams(window.location.search);
var token = urlParams.get("token");
localStorage.setItem('token',token);

const nameSubmit=document.getElementById('nameSubmit');
nameSubmit.addEventListener('click',async(e)=>{
    e.preventDefault();
    const groupName=document.getElementById('groupname').value;
   
    await axios.post('http://localhost:3000/group/namecreate',{name:groupName},{headers:{'Authorization':token}})
        
    window.location.href = "../chatapp/chatapp.html"

    console.log('haiiiiiiii')
    
})

