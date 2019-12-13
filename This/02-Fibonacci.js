function solve(){
    let x=0;
    let y=  1;
    let z= 0;
    
    return function getNext() {
        // [z, x, y] = [x, y, x + y];
        z= y;
        y=x+y;
        x=z;
        return z;
    };

}
let fib = solve();
// console.log(fib);
// console.log(fib);
// console.log(fib);
// console.log(fib);
// console.log(fib);
// console.log(fib);
console.log(fib());
console.log(fib());
console.log(fib());
console.log(fib());
console.log(fib());
console.log(fib());
console.log(fib());
console.log(fib());

