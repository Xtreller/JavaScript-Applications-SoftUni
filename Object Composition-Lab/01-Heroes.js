function solve(){
    function hero(name,stamina,mana)
    {
    return {name,health:100,stamina:stamina || 0,mana:mana || 0}
    }
    function fight() {
    console.log(`${this.name} slashes at the foe` );
    this.stamina--
   }
    function cast(spell) {
        console.log(`${this.name} cast ${spell}` );
        this.mana--
    }
    function fighter(name) {
        return Object.assign(hero(name,100),{fight})
    }
    function mage(name) {
        return Object.assign(hero(name,0,100),{cast})
    }
    return {mage,fighter}

}


let create = solve();
const scorcher = create.mage("Scorcher");
scorcher.cast("fireball")
scorcher.cast("thunder")
scorcher.cast("light")

const scorcher2 = create.fighter("Scorcher 2");
scorcher2.fight()

console.log(scorcher2.stamina);
console.log(scorcher.mana);
