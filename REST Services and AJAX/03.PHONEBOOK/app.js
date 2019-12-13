function attachEvents() {
    let contacts = document.getElementById("phonebook");
    let loadBtn = document.getElementById("btnLoad");
    let inputPerson = document.getElementById("person");
    let inputPhone = document.getElementById("phone");
    let createBtn = document.getElementById("btnCreate");

    const url = `https://phonebook-nakov.firebaseio.com/phonebook.json`
   
    loadBtn.addEventListener('click',loadContacts)
    createBtn.addEventListener('click',createContact)


    function loadContacts() {
        fetch(url)
        .then(x=>x.json())
        .then(contacts.innerHTML ="")
        .then(displayContacts)
        .catch(console.log())
    }
    function displayContacts(data) {
        Object.entries(data).forEach(([contactId,contactDetails]) => {
            const { person , phone } = contactDetails;
            let li = document.createElement('li');
            li.textContent = `${person} ${phone}`;
            let deleteBtn = document.createElement('button')
            deleteBtn.setAttribute("data-target",contactId)
            deleteBtn.addEventListener('click',deleteContact)
            deleteBtn.textContent = "Delete";


            contacts.appendChild(li);
            contacts.appendChild(deleteBtn);
            

            
        });
        
    }     
    
    function createContact(){
        
        const person = inputPerson.value;
        const phone =  inputPhone.value;
        
        const header = {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({person,phone})
        }
        fetch(url,header)
        .then(()=>{
            contacts.innerHTML =''             
            inputPerson.value="";
            inputPhone.value="";
            loadContacts()
        })
        .catch(console.log)
    }
    function deleteContact() {
        const id = this.getAttribute("data-target");
        fetch(`https://phonebook-nakov.firebaseio.com/phonebook/${id}.json`
        ,{method: 'DELETE'})
        .then(loadContacts)
        .catch(console.log);
    }

    
}

// function deleteData(item, url) {
//     return fetch(url + '/' + item, {
//       method: 'delete'
//     }).then(response =>
//       response.json().then(json => {
//         return json;
//       })
//     );
//   }
attachEvents();
