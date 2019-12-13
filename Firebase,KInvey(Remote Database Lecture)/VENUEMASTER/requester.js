const username = "guest"
const password= "pass"

const appKey = "kid_BJ_Ke8hZg";
const baseUrl = "https://baas.kinvey.com";
const appSecret = "ea328f13982e4b48a0b073a88e32ccc8";

export function makeHeader(httpMethod,data) {
    const headers= {
        method:httpMethod,
        headers:{
            'Authorization':`Basic ${btoa(`${username}:${password}`)}`,
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
    return data.json();
    
}
export function get(kinveyModule,endpoint) {
    const headers = makeHeader('GET');
    const url = `${baseUrl}/${kinveyModule}/${appKey}/${endpoint}`
    
    return fetch(url,headers)
    .then(handleError)
    .then(serializeData)
}
export function post(kinveyModule,endpoint,data){
    const headers = makeHeader('POST',data);
    const url = `${baseUrl}/${kinveyModule}/${appKey}/${endpoint}`

    return fetch(url,headers)
    .then(handleError)
    .then(serializeData)
}
export function del(kinveyModule,endpoint,id) {
    const headers = makeHeader('DELETE')
    const url =`${baseUrl}/${kinveyModule}/${appKey}/${endpoint}/${id}`
    return fetch(url,headers)
    .then(handleError)
}
export function update(kinveyModule,endpoint,data,id) {
    const headers = makeHeader('PUT',data)
    const url =`${baseUrl}/${kinveyModule}/${appKey}/${endpoint}/${id}`
    return fetch(url,headers)
    .then(handleError)
}