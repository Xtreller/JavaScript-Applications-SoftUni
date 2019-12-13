class Hex{
    constructor(value){
        this.value = value;
    }
    valueOf(){
        return this.value;
    }
    toString(){
        return "0x" + this.value.toString(16).toUpperCase();
    }
    plus(number){
        return "0x" + (this.value + number.valueOf()).toString(16).toUpperCase();
    }
    minus(number){
        return "0x" + (Math.abs(this.value - number.valueOf())).toString(16).toUpperCase();
    }
    parse(string){
        return parseInt(string,16);
    }
}

