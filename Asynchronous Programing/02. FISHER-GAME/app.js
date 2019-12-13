function attachEvents() {
    const url = `https://fisher-game.firebaseio.com/`;
    const exampleForm = document.querySelector("#catches > div");
    const Data= {
        get:()=>fetch(url+`catches.json`).then(r=>r.json()),
        post:(postData)=>{
            header = {method:'POST',
                    body:JSON.stringify(postData),
                    headers:{'Content-Type':'application/json'}
            }
            fetch(url+'catches.json',header)
        },
        update:(catchId,updatedData)=>{

            const header = {
                method: 'PUT', 
                body: JSON.stringify(updatedData), 
                headers: {
                 'Content-type': 'application/json;' 
                }
            }
            fetch(url+`catches/${catchId}.json`,header)
        },  
        delete:(catchId)=>{
            fetch(url+`catches/${catchId}.json`,{method:'DELETE'})
        }
    }
    const DomInput = {
        $catch:{
        $angler:()=>document.querySelector("#addForm input.angler").value,
        $weight:()=>document.querySelector("#addForm input.weight").value,
        $species:()=>document.querySelector("#addForm input.species").value,
        $location:()=>document.querySelector("#addForm input.location").value,
        $bait:()=>document.querySelector("#addForm input.bait").value,
        $captureTime:()=>document.querySelector("#addForm input.captureTime").value,
    },
    $addBtn:()=>document.getElementsByClassName('add')[0]
    }
    const DomOutput ={
        $loadBtn:()=>document.querySelector("body > aside > button"),
        $catches:()=>document.getElementById("catches"),
        $exampleCatch:()=>document.querySelector("#catches > div")
    }
    
    DomInput.$addBtn().addEventListener('click',addCatch)
    DomOutput.$loadBtn().addEventListener('click',loadCatches)
    
    function addCatch() {        
        const angler = DomInput.$catch.$angler();
        const weight = DomInput.$catch.$weight();
        const species = DomInput.$catch.$species();
        const location= DomInput.$catch.$location();
        const bait = DomInput.$catch.$bait();
        const captureTime = DomInput.$catch.$captureTime();
        if(angler && weight && species && location && bait && captureTime)
        {
        Data.post({ angler, weight, species, location, bait, captureTime })
         }
         else{
             throw new Error("All fields must be fullfiled")
         }
    }

   async function loadCatches() {
       DomOutput.$catches().innerHTML=''
       DomOutput.$catches().appendChild(exampleForm);
       await Data.get()
       .then(displayCatches)
       .catch(r=>console.log(r))

       function displayCatches(allCatches) {

        Object.keys(allCatches).forEach((id)=>{
            const copy = DomOutput.$exampleCatch().cloneNode(true);
            copy.setAttribute('data-id',id);
            
            
            Object.keys(DomInput.$catch)
            .map((c)=>c.slice(1))
            .forEach((key) => {
                copy.querySelector(`input.${key}`).value = allCatches[id][key];
            });
            DomOutput.$catches().appendChild(copy)
        });
        [...document.querySelectorAll(`button.delete`)]
        .forEach((b)=>b.addEventListener('click',(e)=>{
                Data.delete(e.currentTarget.parentNode.getAttribute('data-id'))
                loadCatches();
                }
            ));
        [...document.querySelectorAll(`button.update`)]
        .forEach((b)=>b.addEventListener('click',(e)=>UpdateData(e.currentTarget))
                
            );
        DomOutput.$exampleCatch().remove();
        }
        
    }

    function UpdateData(target) {
        const id = target.parentNode.getAttribute('data-id');
        const currentCatch = target.parentNode.children;
        const LatestData={
             angler:currentCatch.item(1).value,
            weight:currentCatch.item(4).value,
            species:currentCatch.item(7).value,
            location:currentCatch.item(10).value,
            bait:currentCatch.item(13).value,
            captureTime:currentCatch.item(16).value,
        }
        Data.update(id,LatestData)
        loadCatches();
        
        
    }
    
    
}

attachEvents();

