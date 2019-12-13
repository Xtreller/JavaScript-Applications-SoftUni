function solve(input) {
    template ={width:0,
        height:0,
        area:function(){return this.width * this.height},
        compareTo:function(obj){
            return this.area() - obj.area()===0?
            this.width - obj.width:
            this.area() - obj.area();
        }
    }
return input
.map(([width,height])=>Object.assign
    (Object.create(template),{width,height})
 )
.sort((a,b)=>b.compareTo(a));    
}
console.log(solve([[10,5],[5,12]]));
console.log(solve([[10,5], [3,20], [5,12]]));
