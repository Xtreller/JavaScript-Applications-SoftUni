
function getArticleGenerator(articles) {
   let content = document.getElementById("content")
   return function showNext() {
      if(articles.length>0){
         let art = document.createElement('article');
         art.textContent = articles[0];
         articles.shift()
         content.appendChild(art)
     
      }
   }   
}
