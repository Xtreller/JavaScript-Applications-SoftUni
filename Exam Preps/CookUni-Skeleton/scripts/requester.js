const username = "Xtreller"
const password= "Ilchev"

const appKey = "kid_B1gg4tZhB";
const baseUrl = "https://baas.kinvey.com";
const appSecret = "ea328f13982e4b48a0b073a88e32ccc8";

function createAuthorization(type) {
    return type === 'Basic'
    ? `Basic ${btoa(`${appKey}:${appSecret}`)}`
    :`Kinvey ${sessionStorage.getItem('authtoken')}`
}

function makeHeader(type,httpMethod,data) {
    const headers= {
        method:httpMethod,
        headers:{
            'Authorization':createAuthorization(type),
            'Content-Type':'application/json'
        }
    }
    if (httpMethod==="POST"||httpMethod==="PUT") {
        headers.body = JSON.stringify(data);
    }
    return headers;
}
function handleError(e) {
    if(!e.ok){
        throw new Error(e.statusText);
    }
    return e
}
function serializeData(data) {
    if(data.status === 204){
        return data;
    }
    return data.json();
    
}
export function get(kinveyModule,endpoint,type) {

    const headers = makeHeader(type,'GET');
    const url = `${baseUrl}/${kinveyModule}/${appKey}/${endpoint}`
    
    return fetch(url,headers)
    .then(handleError)
    .then(serializeData)
}
export function post(kinveyModule,endpoint,data,type){

    const headers = makeHeader(type,'POST',data);
    const url = `${baseUrl}/${kinveyModule}/${appKey}/${endpoint}`

    return fetch(url,headers)
    .then(handleError)
    .then(serializeData)
}
export function del(kinveyModule,endpoint,id,type) {

    const headers = makeHeader(type,'DELETE')
    const url =`${baseUrl}/${kinveyModule}/${appKey}/${endpoint}/${id}`
    return fetch(url,headers)
    .then(handleError)
}
export function update(kinveyModule,endpoint,data,id,type) {
    const headers = makeHeader(type,'PUT',data)
    const url =`${baseUrl}/${kinveyModule}/${appKey}/${endpoint}/${id}`
    return fetch(url,headers)
    .then(handleError)
}