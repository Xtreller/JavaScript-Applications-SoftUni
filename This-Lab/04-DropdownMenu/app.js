function solve() {
    document.addEventListener("DOMContentLoaded",function () {
      document.addEventListener('click',app);  
    })
    const app ={
   handleEvent: function (e) {
       if(typeof this[e.target.id]==="function"){
           this[e.target.id]();
       }
       if(e.target.classList.value.match('deep')) {
            this.deep(e.target.textContent);
       }
    },
    dropdown:function (){
        const ul = document.getElementById("dropdown-ul");
        if(ul.style.display === "block"){
            ul.style.display="none";
            this.deep("");
        }else{
            ul.style.display = 'block'
        }
    },
    deep: function (color) {
      const box = document.getElementById("box");
      box.style.backgroundColor =color;

    }
}
    }