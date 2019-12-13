function solve(){
    const color = `#413f5e`;
    Array.from(document.getElementsByTagName('tr')).slice(1).forEach(tr => {
        tr.addEventListener('click',function(){
            if(this.hasAttribute('style')){
                this.removeAttribute('style')
            }
            else{
                Array.from(this.parentElement.children)
                .forEach(
                    row =>{row.removeAttribute("style")
                });
                this.style.backgroundColor = color;
            }
        })
    });
}
    
  

