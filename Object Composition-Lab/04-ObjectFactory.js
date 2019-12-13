function solve(input) {
    let obj = {};
    JSON.parse(input).forEach(o => {
        if(!obj.hasOwnProperty(0)){
            Object.assign(obj,o);
        }
    });
    return obj
    
}
solve(`[{"canMove": true},{"canMove":true, "doors": 4},{"capacity": 5}]`)
solve(`[{"canFly": true},{"canMove":true, "doors": 4},{"capacity": 255},{"canFly":true, "canLand": true}]`)
solve(`[{"prop1": 1},{"prop2":2},{"prop3":3}]`)