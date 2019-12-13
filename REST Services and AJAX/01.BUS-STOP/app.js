function getInfo() {
    let stopId = document.getElementById("stopId");
    let stopName = document.getElementById("stopName");
    let busesContainer = document.getElementById("buses")

    busesContainer.innerHTML= "";
    
    fetch(`https://judgetests.firebaseio.com/businfo/${stopId.value}.json`)
    .then(resp=>resp.json())
    .then(data =>{
        const {name, buses}=data;
        stopName.textContent = name;
        Object.entries(buses)
        .forEach(([busId,busTime])=>{
            let li = document.createElement(`li`);
            li.innerText = `Bus ${busId} arrives in ${busTime}`
            busesContainer.appendChild(li);
        })
    })
    .catch((err)=>{
        stopName.textContent = "Error";
        
    });
}   