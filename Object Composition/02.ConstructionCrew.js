function solve(worker) {
    if(worker.dizziness){        
        let obj = {levelOfHydrated:worker.levelOfHydrated +=0.1*worker.weight *worker.experience,
        dizziness:false};
        Object.assign(worker,obj);
    }
    return worker
}
