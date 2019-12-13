function foo() {
    class Figure{
        
        constructor(u="cm"){
            this.defaultUnit = u;
            this.units = {
                m:0.01,
                cm:1,
                mm:10
            }
        }
        get area(){return NaN};
        toString(){return `Figures units: ${this.defaultUnit} Area: ${this.area}`};
        changeUnits(x){
        this.defaultUnit = x;
        }
    }
    class Circle extends Figure{
        constructor(r,u){
            super(u)
            this.radius = r;
        }
        get area(){
            let r = this.units[this.defaultUnit];
            return Math.PI * this.radius*this.units[this.defaultUnit]*
                             this.radius*this.units[this.defaultUnit];
        }
        toString(){
            return super.toString() + ` - radius: ${this.radius}`
        }
    }
    class Rectangle extends Figure{

        constructor(w,h,u){
            super(u);
            
            this.width = w;
            this.height = h;
        }
        get area(){
            let w= this.width*this.units[this.defaultUnit];
            let h = this.height*this.units[this.defaultUnit];
            return w*h;
        }
        toString(){
            let w= this.width*this.units[this.defaultUnit];            
            let h = this.height*this.units[this.defaultUnit];
            return super.toString() +` - width: ${w}, height: ${h}`
        }
        
    }
    return {
        Figure,
        Circle,
        Rectangle
    }
}
let figure = new foo();
let Circle = figure.Circle;
let Rectangle = figure.Rectangle;
let c = new Circle(5);
console.log(c.area); // 78.53981633974483
console.log(c.toString()); // Figures units: cm Area: 78.53981633974483 - radius: 5

let r = new Rectangle(3, 4, 'mm');
console.log(r.area); // 1200 
console.log(r.toString()); //Figures units: mm Area: 1200 - width: 30, height: 40

r.changeUnits('cm');
console.log(r.area); // 12
console.log(r.toString()); // Figures units: cm Area: 12 - width: 3, height: 4

c.changeUnits('mm');
console.log(c.area); // 7853.981633974483
console.log(c.toString()) // Figures units: mm Area: 7853.981633974483 - radius: 50
