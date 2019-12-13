function solve(requirments) {
    let engineTemplate={Smallengine: { power: 90, volume: 1800 },
    Normalengine: { power: 120, volume: 2400 },
    Monsterengine: { power: 200, volume: 3500 }
    }
    let carriageTemplate = {hatchback: { type: 'hatchback', color: requirments.color },
        coupe: { type: 'coupe', color: requirments.color }
    }
    let obj = {model:requirments.model}
    let eng ;
    if(requirments.power===90){
        eng = engineTemplate.Smallengine;
    }
    if(requirments.power ===120){
        eng = engineTemplate.Normalengine;

    }
    if(requirments.power === 200){
        eng = engineTemplate.Monsterengine;
    }
    let tires = function wheelsizeSum({wheelsize}) { 
    let ar = [];
    if (wheelsize%2 === 0) {
        wheelsize--;
        wheelsizeSum(wheelsize)
    }
    while(ar.length < 4){
        ar.push(wheelsize);
    }

    return ar

    }
      obj.engine = eng;
    obj.carriage =carriageTemplate[requirments.carriage];
    obj.tires = tires(requirments);
    
    return obj.tires.length
    
}
console.log(solve({ model: 'VW Golf II',
power: 200,
color: 'blue',
carriage: 'hatchback',
wheelsize: 14 })
);
