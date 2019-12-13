import {get,post,del,} from "../BOOKS/requester.js";
import { htmlAddForm } from "./addForm.js";



const html ={
    $tr:()=>document.createElement('tr'),
    $td:()=>document.createElement('td')
}
const DomInput = {
    $showFormBtn:()=>document.getElementById("showform"),
    $inputForm:()=>document.getElementById("addform"),
    $id:()=>document.getElementById('inputId'),
    $firstName:()=>document.getElementById('firstName'),
    $lastName:()=>document.getElementById('lastName'),
    $facultyNumber:()=>document.getElementById('facultyNumber'),
    $grade:()=>document.getElementById('grade'),
    $submit:()=>document.getElementById('submit')
}
const DomOutput = {
    $tbody:()=> document.querySelector('tbody'),
}

DomInput.$showFormBtn().addEventListener('click',()=>{
    DomInput.$inputForm().style.display = '';
    DomInput.$showFormBtn().disabled = true;

})

async function loadStudents() {
    DomOutput.$tbody().innerHTML = htmlAddForm;
    try
    {
        Object.entries((await get('appdata','students')).sort((a,b)=>a._id-b._id)).forEach((students)=>{
        
        const [_,student] = students;
        const {_id,firstName,lastName,facultyNumber,grade} = student
        displayStudent(_id,firstName,lastName,facultyNumber,grade)
    })
    }
    catch(e){
        throw new Error(e.message);
    }
}
function displayStudent(i,first,last,fN,gr) {
    let tr = html.$tr();
    let id=html.$td();
    let firstName =html.$td();
    let lastName =html.$td();
    let fNumber =html.$td();
    let grade =html.$td();

    id.textContent = i;
    firstName.textContent = first;
    lastName.textContent = last;
    fNumber.textContent = fN;
    grade.textContent = gr;

    tr.append(id,firstName,lastName,fNumber,grade);
    DomOutput.$tbody().appendChild(tr);
    

}
async function addStudent() {
    
    const data = {_id :DomInput.$id().value,
     firstName : DomInput.$firstName().value,
     lastName : DomInput.$lastName().value,
     facultyNumber : DomInput.$facultyNumber().value,
     grade : DomInput.$grade().value}
    const idExists = (await get('appdata','students')).find(o=>o._id===data._id);
    if (!idExists) {
        if (data._id!=='' && data.firstName!=='' && data.lastName!==''&& data.fN!==''&& data.grade!=='') {
            post('appdata','students',data);
        }
    }
    else{
        throw new Error('Student with this id already exists. Chose other id')
    }

    DomInput.$inputForm().style.display = 'none';
    DomInput.$showFormBtn().disabled = false;
    loadStudents();
}
document.onload = loadStudents();
DomInput.$submit().addEventListener('click',addStudent);

function clearTable()
{
    DomOutput.$tbody().innerHTML = '';    
    DomOutput.$tbody().innerHTML = htmlAddForm;
}