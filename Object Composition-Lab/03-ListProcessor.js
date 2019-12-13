const action = {
    add:(a,x)=>[...a, x],
    remove:(a,x)=>a.filter(y=>y!==x),
    print:(a,_)=>console.log(a.join(", "))
}
function solve(input){
    
    input
        .map(x=>x.split(" "))
        .reduce((a,[command,params])=>{
            a = action[command](a,params);
            return a;
        },[])
}

solve(['add hello', 'add again', 'remove hello', 'add again', 'print']);
solve(['add pesho', 'add george', 'add peter', 'remove peter','print']);
