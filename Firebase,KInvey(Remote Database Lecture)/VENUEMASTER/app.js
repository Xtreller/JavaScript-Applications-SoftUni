import { get,makeHeader} from "./requester.js";

const DomInput = {
    $date:()=>document.getElementById('venueDate'),
    $getVenuesBtn:()=>document.getElementById('getVenues')
}
const DomOutput = {
    $venuesOutput:()=>document.getElementById('venue-info'),
    $moreInfoBtn:()=>document.getElementsByClassName('info'),
    
}
DomInput.$getVenuesBtn().addEventListener('click',loadVenues)


  function loadVenues() {
    DomOutput.$venuesOutput().innerHTML = '';
     fetch( `https://baas.kinvey.com/rpc/kid_BJ_Ke8hZg/custom/calendar?query=${DomInput.$date().value}`,makeHeader('POST'))
     .then(r=>r.json())
     .then(ids=>ids.forEach(async(id) => {
       const venue = await fetch(`https://baas.kinvey.com/appdata/kid_BJ_Ke8hZg/venues/${id}`,makeHeader('GET'))
       .then(r=>r.json())
       displeyVenue(venue)
    }))
    .catch(e=>console.log(e))
}
async function displeyVenue(venues) {
    const template = await fetch("./venue-template.hbs")
    .then(r=>r.text())
    const {_id,name,description,startingHour,price} = venues;
    
    let res = template;
    res =res.replace(`{{_id}}`,_id)
    res =res.replace(`{{name}}`,name)
    res =res.replace(`{{description}}`,description)
    res =res.replace(`{{startingHour}}`,startingHour)
    res =res.replace(`{{price}}`,price)
    DomOutput.$venuesOutput().innerHTML+=res;
   for (const venue of document.getElementsByClassName('venue')) {
       showInfo(venue.id)
   }
   for (const purchaseBtn of document.getElementsByClassName('purchase')) {
        confirmPurchase(purchaseBtn);
       
   }
}   
function confirmPurchase(btn) {
    btn.addEventListener('click',async ()=>{
    let confTemplate = await fetch('./confirmation-temp.hbs')
    .then(r=>r.text())
    let name = btn.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.firstElementChild.textContent;
    let _id = btn.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id;
    let menu = btn.parentNode.parentNode.children[1].children[0];
    let quantity = menu.options[menu.selectedIndex].value;
    let price = btn.parentNode.parentNode.firstElementChild.textContent.slice(0,3).trim();
    price = Number(price)
    let total = quantity*price;
    
    confTemplate = confTemplate.replace(`{{name}}`,name)
    confTemplate = confTemplate.replace(`{{price}}`,price)
    confTemplate = confTemplate.replace(`{{qty}}`,quantity)
    confTemplate = confTemplate.replace(`{{total}}`,total)
    document.getElementById(`venue-info`).innerHTML = confTemplate;
    
    document.querySelector("#venue-info > div > input[type=button]").addEventListener('click', async ()=>{
      let temp = await fetch(`https://baas.kinvey.com/rpc/kid_BJ_Ke8hZg/custom/purchase?venue=${_id}&qty=${quantity}`,makeHeader('POST'))
        .then(r=>r.json())
        let {html} = temp
        document.getElementById(`venue-info`).innerHTML = html;

    })
})
}
    


function showInfo(id) {
    document.getElementById(`${id}`).children[0].firstElementChild.addEventListener('click',()=>{
        let displayValue = document.getElementById(`${id}`).children[1];
        if (displayValue.style.display === 'none') {
            displayValue.style.display = 'block'
        }
        else{
            displayValue.style.display = 'none'
        }
    })
}