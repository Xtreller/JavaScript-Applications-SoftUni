    Array.prototype.last =function(){
        return this[this.length-1];        
    }
    Array.prototype.skip = function(n){
        let arr=[];
        for(let i = n; i < this.length;i++){
            arr.push(this[i])
        }
        return arr
     }
     Array.prototype.take = function(n){
        let arr=[];
        for(let i = 0; i < n;i++){
            arr.push(this[i])
        }
        return arr
     }
     Array.prototype.sum = function(){
         let sum = 0;
        for(let i = 0; i<this.length ;i++){
            sum+=this[i];
        }
        return sum;
     }
     Array.prototype.average = function(){
         return this.sum()/this.length;
     }

let ar= [1,2,3,4,5,7,8,9];
let ar1= [1,2,3,4,5,7,8,9];
console.log(ar1.last());
console.log(ar.take(3));
console.log(ar1.skip(3));
console.log(ar.sum());
console.log(ar.average());
     