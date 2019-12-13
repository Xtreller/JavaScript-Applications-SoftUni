(() => {
    renderCatTemplate();
   async function renderCatTemplate() {
        const source = await fetch(`cat-card.hbs`).then(r=>r.text())
        const template = Handlebars.compile(source)
        const contex = {cats: window.cats};
        const html = template(contex);
        document.getElementById('allCats').innerHTML = html;
        document.addEventListener('click',(e)=>{
            if(e.target.tagName==='BUTTON'){
                const id = e.target.nextElementSibling.id;
                
               let element =  document.getElementById(`${id}`);
               element.style.display= element.style.display==='none'?'block':'none';
            }
        })
     }
 
})()
