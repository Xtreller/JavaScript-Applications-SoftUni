function spy(target,method){
    let originalFunction = target[method];
    let result ={
        count:0
    }
    target[method]= function () {
        result.count++;
        return originalFunction.apply(this,arguments);
    }

    return result
}