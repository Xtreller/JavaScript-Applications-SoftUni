$(async () => {
    let source = await fetch('monkey-card.hbs').then(r=>r.text());
    const template = Handlebars.compile(source);
    const context = {monkeys};
    const html = template(context);
    document.getElementsByClassName('monkeys')[0].innerHTML = html;
    document.addEventListener('click',(e)=>{
        if(e.target.tagName==='BUTTON'){
            const id = e.target.nextElementSibling.id;            
           let element =  document.getElementById(`${id}`);
           element.style.display= element.style.display==='none'?'block':'none';
        }
    })
})