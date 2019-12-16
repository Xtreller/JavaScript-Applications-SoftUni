import { get,post,update,del, edit } from "./requester.js";
const partials = {
    header:'./views/common/header.hbs',
    footer:'./views/common/footer.hbs'
}
const app = Sammy('#root',function(){
    this.use('Handlebars','hbs');
    this.get('/index.html',function(ctx){
        getSessionInfo(ctx);
        if(ctx.isAuth){
         get('appdata','events','Kinvey')
         .then((events)=>{
             ctx.events = events;
             this.loadPartials(partials)
             .partial('./views/main/main.hbs')
         })}   
         else{
         this.loadPartials(partials)
         .partial('./views/main/welcome.hbs')
         }
    })
    this.get('/',function (ctx) {
        getSessionInfo(ctx)
        if(ctx.isAuth){
        get('appdata','events','Kinvey')
        .then((events)=>{
            ctx.events = events;
            this.loadPartials(partials)
            .partial('./views/main/main.hbs')
        })}   
        else{
        this.loadPartials(partials)
        .partial('./views/main/welcome.hbs')
        }
    })
    this.get('/register',function (ctx) {
        this.loadPartials(partials)
        .partial('./views/register/register.hbs')
    })
    this.post('/register',function (ctx) {
        const {username,password} = ctx.params;
        post('user','',{username,password},'Basic')
        .then((user)=>{
            setAuth(user)
            ctx.redirect('/')})
        .catch(e=>console.log(e))
    })
    this.get('/login',function (ctx) {
        this.loadPartials(partials)
        .partial('./views/login/login.hbs')
    })
    this.post('/login',function (ctx) {
        const {username,password} = ctx.params;
        post('user','login',{username,password},'Basic')
        .then((user)=>{
            setAuth(user);
            ctx.redirect('/');
        })
        .catch(e=>console.log(e))
    })
    this.get('/logout',function (ctx) {
        getSessionInfo(ctx);
        const {username} = ctx.params
        post('user','_logout',{},'Kinvey')
        .then((resp)=>{
            sessionStorage.clear()
            ctx.redirect('/')
        })
    })
    this.get('/organize',function (ctx) {
        getSessionInfo(ctx);
        this.loadPartials(partials)
        .partial('./views/events/organize.hbs')
    })
    this.post('/organize',function (ctx) {
        getSessionInfo(ctx);
        const {username,userId} = ctx;
        const {name,dateTime,description,imageURL} = ctx.params;
        post('appdata','events',{name,dateTime,description,imageURL,peopleInterested:0,organizer:{username:`${username}`,userId:`${userId}`}})
        .then(ctx.redirect('/'))
        .catch(e=>console.log(e))
    })
    this.get('/details/:eventId',function (ctx) {
        getSessionInfo(ctx)
        const eventId = ctx.params.eventId;
        get('appdata',`events/${eventId}`,'Kinvey')
        .then((event)=>{
            const {name,dateTime,description,imageURL,organizer,peopleInterested} = event;
          
            ctx.name = name ;
            ctx.dateTime = dateTime;
            ctx.description = description;
            ctx.imageURL = imageURL;
            ctx.organizer = organizer;
            ctx.peopleInterested = peopleInterested;
            ctx.isAuthor = ctx.userId === event._acl.creator;
            ctx.eventId = event._id
            this.loadPartials(partials)
            .partial('../views/events/details.hbs')
        })
        .catch(e=>console.log(e));
    })
    this.get('/close/:eventId',function (ctx) {
        getSessionInfo(ctx);
        const eventId = ctx.params.eventId;
        del('appdata','events',eventId,'Kinvey')
        .then(ctx.redirect('/'))
        .catch(e=>console.log(e))
    })
    this.get('/join/:eventId',function (ctx) {
        getSessionInfo(ctx);
        const id = ctx.params.eventId
        get('appdata',`events/${id}`,'Kinvey')
        .then((event)=>{
            let peopleInterested = event.peopleInterested+1;
            const newData = {
                name:event.name,
                dataTime:event.dataTime,
                description:event.description,
                organizer:event.organizer,
                peopleInterested,
                imageURL:event.imageURL
            }
            update('appdata','events',newData,id,'Kinvey')
            .then((resp)=>{
            ctx.redirect(`/details/${id}`)                    
            })
            .catch(e=>console.log(e))
        })
        .catch(e=>console.log(e))
    })
    this.get('/edit/:eventId',function (ctx) {
       
        getSessionInfo(ctx);
        const eventId= ctx.params.eventId;
        ctx.eventId = eventId;

        get('appdata',`events/${eventId}`,'Kinvey')
        .then((event)=>{
            const {name,dateTime,organizer,peopleInterested,imageURL} = event;
            
            ctx.name = name;
            ctx.dateTime = dateTime;
            ctx.imageURL = imageURL;
            ctx.peopleInterested = peopleInterested;
            ctx.organizer = organizer;
            console.log(peopleInterested);
             console.log(organizer.username);
        
            
            this.loadPartials(partials)
            .partial('../views/events/edit.hbs');
        })
    })
    this.post('/edit/:eventId',function (ctx) {
        const {name,dateTime,description,imageURL} = ctx.params;
        const eventId = ctx.params.eventId;
        // console.log(peopleInterested);
        // console.log(organizer);
        
        if (location&&dateTime&&description&&imageURL) {
          get('appdata',`events/${eventId}`,'Kinvey')
          .then((event)=>{
            let {organizer,peopleInterested} = event;
                            
                const newData = {
                    name,
                    dateTime,
                    description,
                    imageURL,
                    organizer,
                    peopleInterested
                }
            update('appdata','events',newData,eventId,'Kinvey')
            .then(
                ()=>ctx.redirect(`/details/${eventId}`)
                )
            .catch(e=>console.log(e))

        })
        .catch(e=>console.log(e))
        }
        else{
            console.log('Incorect or incomplete data.')
        }
    })
    this.get('/profile/:eventId',function (ctx) {
        getSessionInfo(ctx);
        // https://baas.kinvey.com/appdata/app_id/treks?query={"_acl.creator":"${user_id}"}
        get('appdata',`events?query={"_acl.creator":"${ctx.userId}"}`,'Kinvey')
        .then((events)=>{
            ctx.eventsCount = events.length;
            ctx.events = events;
            console.log(events);
            
            this.loadPartials(partials)
            .partial('../views/main/profile.hbs')
        })
    })
    
})
app.run();
function setAuth(user) {
    sessionStorage.setItem('authtoken',user._kmd.authtoken)
    sessionStorage.setItem('username',user.username)
    sessionStorage.setItem('userId',user._id)
}
function getSessionInfo(ctx) {
    ctx.isAuth = sessionStorage.getItem('authtoken')!=null;
    ctx.username = sessionStorage.getItem('username');
    ctx.userId = sessionStorage.getItem('userId');
    
}