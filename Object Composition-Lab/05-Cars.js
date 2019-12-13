function solve(input) {
    let collection = []
    let inherit = false;
    let target ;
    let source ;
    input.forEach(c => {
        c = c.split(" ")
        if(c[0]==='create'){
            obj = {name:`${c[1]}`}
            if(c.length === 4){
            inherit = true;
            target = obj;
            source = collection.find(o=>o.name===c[3]);
            console.log(source);
            console.log(target);
            }
            collection.push(obj);
            
        }
        if (c[0]==='set'){
            let currentObj = collection.find(o=>o.name===c[1])
            currentObj[c[2]]=c[3];            
        }
        if(c[0]==='print'){
            Object.assign(target,source);
            console.log(collection);
        }
    });
           
}
console.log(solve(['create c1',
'create c2 inherit c1',
'set c1 color red',
'set c2 model new',
'print c1',
'print c2']
));
// function cars(commands) {
//     let map = new Map();
//     let carManager = {
//         create: function ([name, , parent]){
//             parent = parent ? map.get(parent) : null;
//             let newObj = Object.create(parent);
//             map.set(name, newObj);
//             return newObj;
//         },
//         set: function ([name, key, value]) {
//             let obj = map.get(name);
//             obj[key] = value;
//         },
//         print: function ([name]) {
//             let obj = map.get(name);
//             let allProperties = []
//             Object.keys(obj).forEach(key => allProperties.push(`${key}:${obj[key]}`));
//             while(Object.getPrototypeOf(obj)) {
//                 Object.keys(Object.getPrototypeOf(obj)).forEach(key => allProperties.push(`${key}:${Object.getPrototypeOf(obj)[key]}`));
//                 obj = Object.getPrototypeOf(obj);
//             }
//             console.log(allProperties.join(', '))
//         }
//     };

//     for(let cmd of commands){
//         let tokens = cmd.split(' ');
//         let action = tokens.shift();
//         carManager[action](tokens);
//     }
// }