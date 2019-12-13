import { get,post,update,del } from "./requester.js";
const partials = {
    header:'./templates/common/header.hbs',
    footer:'./templates/common/footer.hbs'
}
const app = Sammy('#main',function () {
    this.use('Handlebars','hbs');
    this.get('/',function (ctx) {
        getSessionInfo(ctx)

        this.loadPartials(partials)
        .partial('./templates/home/home.hbs')
    }) 
    this.get('/home',function (ctx) {
        getSessionInfo(ctx);
        this.loadPartials(partials)
        .partial('./templates/home/home.hbs')
    })
    this.get('/index.html',function (ctx) {
        getSessionInfo(ctx);
        this.loadPartials(partials)
        .partial('./templates/home/home.hbs')
    })
    this.get('/login',function (ctx) {
        getSessionInfo(ctx)
         partials['loginForm'] = './templates/login/loginForm.hbs'
        this.loadPartials(partials)
        .partial('./templates/login/loginPage.hbs')
    })
    this.post('/login',function (ctx) {
        
        const {username,password} = ctx.params;
        
        post('user','login',{username,password},'Basic')
        .then((userInfo)=>{
            console.log(userInfo);
            setAuth(userInfo);
            ctx.redirect('/home')
            
        })
       
    })
    this.get('/register',function (ctx) {
        partials['registerForm'] = './templates/register/registerForm.hbs';
        this.loadPartials(partials)
        .partial('../templates/register/registerPage.hbs')
    })
    this.post('/register',function (ctx) {
        partials['registerForm'] = './templates/register/registerForm.hbs';
        const {username,password} = ctx.params;
        post('user','',{username,password},'Basic')
        .then((user)=>{
            setAuth(user)
            ctx.redirect('/login')
        })
    })
    this.get('/about',function (ctx) {
        this.loadPartials(partials)
        .partial('../templates/about/about.hbs')
    })
    this.get('/logout',function (ctx) {
        getSessionInfo(ctx);
        this.loadPartials(partials)
        .then((repond)=>{
            sessionStorage.clear();
            ctx.redirect('/home')
        })
    })
    this.get('/create',function (ctx) {
        getSessionInfo(ctx);
        partials['createForm'] = '../templates/create/createForm.hbs';
        this.loadPartials(partials)
        .partial('../templates/create/createPage.hbs')

    })
    this.post('/create',function (ctx) {
        const {name,comment} = ctx.params;
        post('appdata','teams',{name,comment,members:[]},'Kinvey')
        .then(()=>{
            ctx.redirect('/catalog')
        })
        .catch(e=>console.log(e))
    })
    this.get('/catalog',function (ctx) {
        partials['team'] = './templates/catalog/team.hbs';
        getSessionInfo(ctx);
        get('appdata','teams','Kinvey')
        .then((teams)=>{
            
            if(teams.length>0){
                ctx.hasNoTeam = false;
            }
            else{
                ctx.hasNoTeam = true;
            }
            
            ctx.teams = teams;
            
            this.loadPartials(partials)
            .partial('./templates/catalog/teamCatalog.hbs')
        })
    })
    this.get('/catalog/:teamId',function (ctx) {
        getSessionInfo(ctx);
        const teamId = ctx.params.teamId;
        partials['teamControls'] = '../templates/catalog/teamControls.hbs';
        partials['teamMember'] = '../templates/catalog/teamMember.hbs';

        get('appdata',`teams/${teamId}`,'Kinvey')
        .then((team)=>{
            ctx.name = team.name;
            ctx.members = team.members;
            ctx.comment = team.comment;
            ctx.teamId = team._id;
            ctx.isOnTeam = (team.members).find(m=>m.username===ctx.username);
            ctx.isAuthor = team._acl.creator === ctx.userId;
            
            
            this.loadPartials(partials)
            .partial('../templates/catalog/details.hbs')
        })
      
        
    })
    
    this.get('/join/:teamId',function (ctx) {
        getSessionInfo(ctx)
        
        const teamId = ctx.params.teamId;
        
        get('appdata',`teams/${teamId}`,'Kinvey')
        .then((team)=>{
            ctx.isOnTeam = (team.members).find(m=>m.userId===ctx.userId);
            if(!ctx.isOnTeam){
            const {name,comment,members} = team;
            members.push({username:`${ctx.username}`,userId:`${ctx.userId}`});
            update('appdata','teams',{name,comment,members},teamId,'Kinvey')
            .then((respond)=>{
                ctx.redirect(`/catalog/${teamId}`)

            })
            .catch(e=>console.log(e))
            }
        })
        .catch(e=>console.log(e))

    })

    this.get('/leave/:teamId',function (ctx) {
        getSessionInfo(ctx);
        const teamId = ctx.params.teamId;
        get('appdata',`teams/${teamId}`,'Kinvey')
        .then((team)=>{

            let {name,comment,members} = team;
            members = members.filter(m=>m.userId !== ctx.userId);
            update('appdata','teams',{name,comment,members},teamId,'Kinvey')
            .then((respond)=>{
                console.log(respond);
                ctx.redirect(`/catalog/${teamId}`)

            })
            .catch(e=>console.log(e))
          
        })
        .catch(e=>console.log(e))
    })
    this.get('/edit/:teamId',function (ctx) {
        getSessionInfo(ctx);
        partials['editForm'] = '../templates/edit/editForm.hbs'
        const teamId = ctx.params.teamId;
       get('appdata',`teams/${teamId}`,'Kinvey')
       .then((team)=>{
           ctx.name = team.name;
           ctx.comment = team.comment;
           ctx.teamId = teamId;
           this.loadPartials(partials)
           .partial('../templates/edit/editPage.hbs')

       })
    })
    this.post('/edit/:teamId',function (ctx) {
        const {name,comment} = ctx.params;
        const teamId = ctx.params.teamId
        
      get('appdata',`teams/${teamId}`,'Kinvey')
      .then((team)=>{
        const {members} = team;
        
        update('appdata','teams',{name,comment,members},teamId,'Kinvey')
        .then((respond)=>{
            ctx.redirect(`catalog/${teamId}`)
        })
    }).catch(e=>console.log(e)
      )
    })
    
    
})
function setAuth(userInfo) {
    sessionStorage.setItem('authtoken',userInfo._kmd.authtoken)
    sessionStorage.setItem('username',userInfo.username);
    sessionStorage.setItem('userId',userInfo._id);
}
function getSessionInfo(ctx) {
    ctx.isAuth = sessionStorage.getItem('authtoken') != null;
    ctx.username = sessionStorage.getItem('username');
    ctx.userId = sessionStorage.getItem('userId');
}
app.run()
