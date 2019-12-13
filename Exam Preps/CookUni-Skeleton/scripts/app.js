import { get,post,update,del } from "./requester.js";
const partials = {
    header:'./templates/common/header.hbs',
    footer:'./templates/common/footer.hbs'
}
const app = Sammy('#rooter',function () {
    this.use('Handlebars','hbs');
    this.get('/',function (ctx) {
        getSessionInfo(ctx)
        if(ctx.isAuth){
            get('appdata','recipes','Kinvey')
            .then((recipes)=>{
                
                ctx.recipes = recipes;
                this.loadPartials(partials)
                .partial('./templates/main/main.hbs')
            })
            .catch(e=>console.log(e))}
        else{
            this.loadPartials(partials)
            .partial('/templates/main/welcome.hbs')
        }
    })
    this.get('/index.html',function (ctx) {
        getSessionInfo(ctx)
        if(ctx.isAuth){
            get('appdata','recipes','Kinvey')
            .then((recipes)=>{
                ctx.recipes = recipes;
                this.loadPartials(partials)
                .partial('./templates/main/main.hbs')
            })
            .catch(e=>console.log(e))}
        else{
            this.loadPartials(partials)
            .partial('/templates/main/welcome.hbs')
        }
    })
    this.get('/register',function (ctx) {
        this.loadPartials(partials)
        .partial('./templates/register/register.hbs')
    })
    this.post('/register',function (ctx) {
        const {firstName,lastName,username,password,repeatPassword} = ctx.params;
        if(firstName&&lastName&&username&&password&&repeatPassword){
            if(password===repeatPassword){
                post('user','',{firstName,lastName,username,password},'Basic')
                .then((userInfo)=>{
                    setAuth(userInfo);
                    ctx.redirect('/login');
                })
            }
        }
    })
    this.get('/login',function (ctx) {
        getSessionInfo(ctx);
        this.loadPartials(partials)
        .partial('./templates/login/login.hbs')
    })
    this.post('/login',function (ctx) {
        const {username,password} = ctx.params;
        post('user','login',{username,password},'Basic')
        .then((userInfo)=>{
            setAuth(userInfo)
            ctx.redirect('/');
        })
        .catch(e=>console.log(e)
        )
    })
    this.get('/logout',function (ctx) {
        getSessionInfo(ctx);
        post('user','_logout',{},'Kinvey')
        .then((respond)=>{
            console.log(respond);
            sessionStorage.clear();
            ctx.redirect('/')
            
        })
    })
    this.get('/share',function (ctx) {
        getSessionInfo(ctx);
        this.loadPartials(partials)
        .partial('./templates/recipes/share.hbs')
    })
    this.post('/share',function (ctx) {
        getSessionInfo(ctx);
        const {meal,ingredients,prepMethod,description,category,foodImageURL} = ctx.params;
        if(meal&&ingredients&&prepMethod&&description&&category&&foodImageURL){
            const categories = {
                'Vegetables and legumes/beans':'https://cdn.pixabay.com/photo/2017/10/09/19/29/eat-2834549__340.jpg',
                'Grain Food':'https://cdn.pixabay.com/photo/2014/12/11/02/55/corn-syrup-563796__340.jpg',
                'Fruits':'https://cdn.pixabay.com/photo/2017/06/02/18/24/fruit-2367029__340.jpg',
                'Milk, chees, eggs and alternatives':'https://image.shutterstock.com/image-photo/assorted-dairy-products-milk-yogurt-260nw-530162824.jpg',
                'Lean meats and poultry, fish':'https://t3.ftcdn.net/jpg/01/18/84/52/240_F_118845283_n9uWnb81tg8cG7Rf9y3McWT1DT1ZKTDx.jpg',
            }
        post('appdata','recipes',{meal,
            ingredients:ingredients.split(' '),
            prepMethod,
            description,
            category,
            foodImageURL,
            categoryImageURL:categories[category],
            likesCounter:0},'Kinvey')
            .then((respnd)=>{
                ctx.redirect('/')
            })
            .catch(e=>console.log(e))

    }
    })
    this.get('/details/:mealId',function (ctx) {
        getSessionInfo(ctx);
        const mealId = ctx.params.mealId;
        
        get('appdata',`recipes/${mealId}`,'Kinvey')
        .then((recipe)=>{
            const {meal,prepMethod,ingredients,description,likesCounter,foodImageURL} = recipe;
            ctx.meal = meal;
            ctx.prepMethod = prepMethod;
            ctx.description = description;
            ctx.ingredients = ingredients;
            ctx.likesCounter = likesCounter;
            ctx.foodImageURL = foodImageURL;
            ctx.mealId = recipe._id;
            ctx.isAuthor = recipe._acl.creator === ctx.userId;
            this.loadPartials(partials)
            .partial('../templates/recipes/details.hbs')
        })
        .catch(e=>console.log(e))

    })
    this.get('/edit/:mealId',function (ctx) {
        getSessionInfo(ctx);
        const mealId = ctx.params.mealId;
        get('appdata',`recipes/${mealId}`,'Kinvey')
        .then((recipe)=>{
            ctx.meal = recipe.meal;
            ctx.prepMethod = recipe.prepMethod;
            ctx.description = recipe.description;
            ctx.ingredients = recipe.ingredients;
            ctx.foodImageURL = recipe.foodImageURL;
            
            this.loadPartials(partials)
            .partial('../templates/recipes/edit.hbs')

        })
        .catch(e=>console.log(e))
    })
    this.post('/edit/:mealId',function (ctx) {
        getSessionInfo(ctx)
        const mealId = ctx.params.mealId;
        get('appdata',`recipes/${mealId}`,'Kinvey')
        .then((recipe)=>{
           

            let newData = {meal:ctx.params.meal ,
                ingredients:ctx.params.ingredients,
                prepMethod:ctx.params.prepMethod,
                description:ctx.params.description,
                category:ctx.params.category,
                foodImageURL:ctx.params.foodImageURL,
                categoryImageURL:recipe.categoryImageURL,
                likesCounter:recipe.likesCounter
            }

            update('appdata','recipes',newData,mealId,'Kinvey')
            .then((respond)=>{
                console.log(respond);
                // ctx.redirect(`/details/${mealId}`)
                
            })
            .catch(e=>console.log(e))
        })
        .catch(e=>console.log(e))
    })
    this.get('archive/:mealId',function (ctx) {
        getSessionInfo(ctx);
        const mealId = ctx.params.mealId;
        del('appdata','recipes',mealId,'Kinvey')
        .then(res=>{console.log(res)
        ctx.redirect('/')})
        .catch(e=>{console.log(e)})

    })
    this.get('/like/:mealId',function (ctx) {
        getSessionInfo(ctx);
            
    })
})
app.run();
function setAuth(user) {
    sessionStorage.setItem('authtoken',user._kmd.authtoken)
    sessionStorage.setItem('fullname',`${user.firstName} ${user.lastName}`)
    sessionStorage.setItem('userId',user._id);
}
function getSessionInfo(ctx) {
    ctx.fullname = sessionStorage.getItem('fullname'),
    ctx.isAuth = sessionStorage.getItem('authtoken') != null;
    ctx.userId= sessionStorage.getItem('userId');
}
