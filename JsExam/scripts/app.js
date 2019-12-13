import { get,post,update,del } from "./requester.js";
const partials = {
    header:'./views/common/header.hbs',
    footer:'./views/common/footer.hbs'
}
const app = Sammy('#rooter',function () {
    this.use('Handlebars','hbs')
    this.get('/index.html',function (ctx) {
        getSessionInfo(ctx);
        if(ctx.isAuth){
            get('appdata','treks','Kinvey')
            .then((treks)=>{
            ctx.hasTreks = treks.length>0
            ctx.trek = treks;
            ctx.trekId = treks._id;

                this.loadPartials(partials)
                .partial('./views/main/main.hbs')
            })
            .catch(e=>console.log(e))
        }
        else{
            this.loadPartials(partials)
                .partial('./views/main/welcome.hbs')
        }
       
    })
    this.get('/',function (ctx) {
             getSessionInfo(ctx);
             console.log(ctx.userId);
             
              
        if(ctx.isAuth){
            get('appdata','treks','Kinvey')
            .then((treks)=>{
            ctx.hasTreks = treks.length>0
            ctx.trek = treks;
            ctx.trekId = treks._id;
            
                this.loadPartials(partials)
                .partial('./views/main/main.hbs')
            })
            .catch(e=>console.log(e))
        }
        else{
            this.loadPartials(partials)
                .partial('./views/main/welcome.hbs')
        }
        
    })
    this.get('/register',function (ctx) {
        getSessionInfo(ctx);
        this.loadPartials(partials)
        .partial('./views/register/register.hbs')

    })
    this.post('/register',function (ctx) {
    
        const {username,password,rePassword} = ctx.params;
        if (username.length>3 && password.length>6 && rePassword) {
            if(password===rePassword){
                post('user','',{username,password},'Basic')
                .then((user)=>{
                    setAuth(user);
                    ctx.redirect('/login');
                })
                .catch(e=>console.log(e))
            }
        }
        else{
            console.log('Incorect or incomplete data. Username must be at least 3 charackters long,Password must be at least 6.')
            }
        
    })
    this.get('/login',function (ctx) {
        getSessionInfo(ctx);
        this.loadPartials(partials)
        .partial('./views/login/login.hbs')
    })
    this.post('/login',function (ctx) {
        const {username,password} = ctx.params;
        if (password&&username) {
            post('user','login',{username,password},'Basic')
            .then((user)=>{
                setAuth(user);
                ctx.redirect('/');
            })
            .catch(e=>console.log(e))
        }
        else{
            console.log('Incorect or incomplete data. Username must be at least 3 charackters long,Password must be at least 6.')
        }
    })
    this.get('/logout',function (ctx) {
        getSessionInfo(ctx);
        post('user','_logout',{},'Kinvey')
        .then((respond)=>{
            sessionStorage.clear();
            ctx.redirect('/')
            
        })
        .catch(e=>console.log(e))
    })
    this.get('/request',function (ctx) {
        getSessionInfo(ctx);
        this.loadPartials(partials)
        .partial('./views/trek/create.hbs')
    })
    this.post('/request',function (ctx) {
        getSessionInfo(ctx);
        const {location,dateTime,description,imageURL}=ctx.params;
        if (location&&dateTime&&description&&imageURL) {
            post('appdata','treks',{location,dateTime,description,imageURL,likes:0,organizer:{username:`${ctx.username}`,id:`${ctx.userId}`}},'Kinvey')
            .then((trek)=>{
                console.log(trek);
                ctx.redirect('/')                
            })
            .catch(e=>console.log(e))
        }
        else{
            console.log('Incorect or incomplete data. Username must be at least 3 charackters long,Password must be at least 6.')
            }
    })
    this.get('/details/:trekId',function (ctx) {
        getSessionInfo(ctx);
        const trekId= ctx.params.trekId
        get('appdata',`treks/${trekId}`,'Kinvey')
        .then((trek)=>{
            const {location,dateTime,description,imageURL,likes,organizer} = trek;
            ctx.location = location;
            ctx.dateTime = dateTime;
            ctx.description = description;
            ctx.imageURL = imageURL;
            ctx.likes = likes;
            ctx.organizer = organizer.username;
            ctx.trekId = trekId;
            ctx.isAuthor = ctx.userId === organizer.id;
           
            
            this.loadPartials(partials)
            .partial('../views/trek/details.hbs')
        })
    })
   
    this.get('/edit/:trekId',function (ctx) {
       
        getSessionInfo(ctx);
        const trekId= ctx.params.trekId;
        ctx.trekId = trekId;

        get('appdata',`treks/${trekId}`,'Kinvey')
        .then((trek)=>{
            const {location,dateTime,organizer,likes,imageURL} = trek;
            
            ctx.location = location;
            ctx.dateTime = dateTime;
            ctx.imageURL = imageURL;
            ctx.likes = likes;
            ctx.organizer = organizer.username;
            ctx.trekId = trekId;
            this.loadPartials(partials)
            .partial('../views/trek/edit.hbs');
        })
    })
    this.post('/edit/:trekId',function (ctx) {
        const {location,dateTime,description,imageURL} = ctx.params;
        const trekId = ctx.params.trekId;
      
        if (location&&dateTime&&description&&imageURL) {
          get('appdata',`treks/${trekId}`,'Kinvey')
          .then((trek)=>{
            let {organizer,likes} = trek;
                            
                const newData = {
                    location,
                    dateTime,
                    description,
                    imageURL,
                    organizer,
                    likes
                }
            update('appdata','treks',newData,trekId,'Kinvey')
            .then(()=>ctx.redirect(`/details/${trekId}`))
            .catch(e=>console.log(e))

        })
        .catch(e=>console.log(e))
        }
        else{
            console.log('Incorect or incomplete data.')
        }
    })
    
    this.get('/like/:trekId',function (ctx) {
            getSessionInfo(ctx);
            const id = ctx.params.trekId
            get('appdata',`treks/${id}`,'Kinvey')
            .then((trek)=>{
                let likes = trek.likes +1;
                const newData = {
                    location:trek.location,
                    dataTime:trek.dataTime,
                    description:trek.description,
                    organizer:trek.organizer,
                    likes,
                    imageURL:trek.imageURL
                }
                update('appdata','treks',newData,id,'Kinvey')
                .then((resp)=>{
                ctx.redirect(`/details/${id}`)                    
                })
                .catch(e=>console.log(e))
            })
            .catch(e=>console.log(e))


    })
    this.get('/close/:trekId',function (ctx) {
        const trekId = ctx.params.trekId;
        del('appdata','treks',trekId,'Kinvey')
        .then(()=>{
            ctx.redirect('/');
        })
        .catch(e=>console.log(e))
    })
    this.get('/profile/:userId',function (ctx) {
        getSessionInfo(ctx);
        const userId = ctx.userId;
        console.log(userId);
        // https://baas.kinvey.com/appdata/app_id/treks?query={"_acl.creator":"${user_id}"}
        get('appdata',`treks?query={"_acl.creator":"${userId}"}`,'Kinvey')
        .then((treks)=>{
            ctx.treks = treks;
            this.loadPartials(partials)
            .partial('../views/main/profile.hbs')
        })
        .catch(e=>console.log(e))
    })
    
    
})
app.run();
function setAuth(user) {
    sessionStorage.setItem('authtoken',user._kmd.authtoken)
    sessionStorage.setItem('username',user.username);    
    sessionStorage.setItem('userId',user._id)
}
function getSessionInfo(ctx) {
    ctx.isAuth = sessionStorage.getItem('authtoken')!=null;
    ctx.username = sessionStorage.getItem('username');
    ctx.userId = sessionStorage.getItem('userId')
}

