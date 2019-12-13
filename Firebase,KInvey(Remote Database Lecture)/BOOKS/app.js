import { get,post,del,update } from "./requester.js";
const DomInput = {
    $title:()=> document.getElementById("title"),
    $author:()=>document.getElementById("author"),
    $isbn:()=>document.getElementById("isbn"),
    $submitBtn:()=>document.querySelector('form>button')
}

const DomOutput= {
    $loadBtn:()=>document.getElementById("loadBooks"),
    $editForm:()=>document.getElementById("editform"),
    $submitEditBtn:()=>document.querySelector("#editform>button")
}
const html ={
    $tr:()=>document.createElement('tr'),
    $td:()=>document.createElement('td'),
    $btn:()=>document.createElement('button')
}

DomInput.$submitBtn().addEventListener('click',addBook);
DomOutput.$loadBtn().addEventListener('click',loadBooks);


async function loadBooks() {
    document.querySelector("body > table > tbody").innerHTML = '';
    Object.entries(await get('appdata',`books`)).forEach((books) => {
    const [index,book] = books;
    const {_id,title,author,isbn} = book;

    displayBook(_id,title,author,isbn);
})
}

function addBook(e) {
    e.preventDefault();
    const title = DomInput.$title().value;
    const author = DomInput.$author().value;
    const isbn = DomInput.$isbn().value;
    if(title===''||author===''||isbn==='')
    {
        throw new Error("All fields must be fullfiled!");
    }
    else{
        const data = {title,author,isbn}

        post('appdata','books',data);
    }


}
function displayBook(id,title,author,isbn) {
    let tr = html.$tr();
    let ttl = html.$td();
    let athr = html.$td();
    let i = html.$td();
    let btns = html.$td();
    let del = html.$btn();
    let edit = html.$btn();
    
    ttl.textContent = title;
    athr.textContent = author;
    i.textContent = isbn;
    edit.textContent = 'Edit';
    del.textContent = 'Delete';
    btns.append(edit,del)
    tr.setAttribute('id',id);
    tr.append(ttl,athr,i,btns)
    
    edit.addEventListener('click',editBook); 
    del.addEventListener('click',deleteBook);
    document.querySelector("body > table > tbody").appendChild(tr)
}
async function editBook(e) {
    e.preventDefault()

    DomOutput.$editForm().style.display = 'block';
    const currentid = e.currentTarget.parentNode.parentNode.getAttribute('id')
    let selectedBook = Object.entries(await get('appdata',`books`)).find(bs=>bs.find(b=>b._id===currentid));

    const {title,author,isbn} = selectedBook[1];
    const child = DomOutput.$editForm().children;

    child[2].value = title;
    child[4].value = author;
    child[6].value = isbn;

    let newData;
    DomOutput.$editForm().addEventListener('change',(e)=>{
    e.preventDefault();
     newData = {
        title:`${child[2].value}`,
        author:`${child[4].value}`,
        isbn:`${child[6].value}`
        }
    })
    
    DomOutput.$submitEditBtn().addEventListener('click',(e)=>{
        e.preventDefault()
        console.log('click');
        
        if (title!==newData.title||author!==newData.author||isbn!==newData.isbn) {
            update('appdata','books',newData,currentid);
            DomOutput.$editForm().style.display = 'none';        
        }
        else{
            throw new Error('Fields are the same');
        }
    })
    loadBooks()
}
function deleteBook(e) {
    const id = e.currentTarget.parentNode.parentNode.getAttribute('id')
    del('appdata','books',id);
    console.log('deleted');
    loadBooks();
}