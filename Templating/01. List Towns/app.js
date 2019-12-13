let root = document.getElementById('root');

(function(){
document.getElementById('btnLoadTowns').addEventListener('click',async ()=>{
    const source = await fetch(`list-towns.hbs`).then(res=>res.text())
    const towns = document.getElementById('towns').value.split(', ');
    const template = Handlebars.compile(source);
    const context = {towns};
    const html = template(context);
    root.innerHTML = html;
})
}())