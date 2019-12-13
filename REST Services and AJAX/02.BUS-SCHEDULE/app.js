function solve() {
    let infoSpan = document.querySelector("#info > span");
    let departBtn = document.getElementById("depart");
    let arriveBtn = document.getElementById("arrive");

    let  currentId = `depot`;
    let  currentName ;
    function depart() {
        fetch(`https://judgetests.firebaseio.com/schedule/${currentId}.json`)
        .then(res=>res.json())
        .then(departSuccess)
        .catch(err=>console.log(err)
        );
    }

    function arrive() {
        infoSpan.textContent = `Arriving at ${currentName}`;
        departBtn.disabled = false;
        arriveBtn.disabled = true;
    }
    function departSuccess(data) {
        const {name,next} = data;
        currentName = name;
        currentId = next;
        departBtn.disabled = true;
        arriveBtn.disabled = false;
        infoSpan.textContent = `Next stop ${currentName}`;
    }

    return {
        depart,
        arrive
    };
}

let result = solve();