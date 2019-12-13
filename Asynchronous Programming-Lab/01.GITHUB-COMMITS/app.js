function loadCommits() {
    const user = document.getElementById("username");
    const repo = document.getElementById("repo")
    const comits = document.getElementById("commits");

    const url = `https://api.github.com/repos/${user.value}/${repo.value}/commits`;
    function getData() {
        fetch(url)
        .then(res=>res.json())
        .then(comits.innerHTML = '')
        .then(displayComits)
        .catch(comits.innerHTML = '<p>Error</p>')
        
            
    }
    
     function displayComits(data) {
       data.map(x=>[x.commit.author.name,x.commit.message])
       .forEach(x => {
           let li = document.createElement("li");
           li.innerHTML =`${x[0]}: ${x[1]}`
           comits.appendChild(li);

       });
    }
   
    return getData();
}