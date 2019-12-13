import { contacts } from "./contacts.js";
async function contactCards() {
    const template = await fetch('card-contact-template.hbs')
    .then(x=>x.text())
   document.getElementById('contacts').innerHTML = contacts.map(contact=>{
        let res = template;
        Object.keys(contact)
        .forEach(x=>{
            res = res.replace(`{{${x}}}`,contact[x])
           
        })
        return res
    }).join("")
    document.addEventListener('click',function(e){
        if(e.target.tagName === "BUTTON"){
            let c = document.getElementById(`${e.target.dataset.id}`)
            c.style.display = c.style.display === 'none'?'display':'none';
        }

    })
    
}
function showDetails(id){
    document.getElementById(`${id}`).parentNode.firstChild.addEventListener('click',()=>{
    document.getElementById(`${id}`).style.display = block
    })
}
 contactCards();