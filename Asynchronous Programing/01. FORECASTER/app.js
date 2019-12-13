function attachEvents() {
        const url=`https://judgetests.firebaseio.com/` 
        const weatherSymbols= {
            sunny: '☀',
            partlysunny:'⛅',
            overcast:'☁',
            rain: '☂',
            degrees: '°'

        }
        const DOMElements = {
            $location:()=>document.getElementById('location'),
            $submit: ()=>document.getElementById('submit'),
            $current : ()=>document.getElementById('current'),
            $upcoming : ()=>document.getElementById('upcoming'),
            $forecast:()=>document.getElementById('forecast').style.display = 'block'
        }
        const weather = ()=>{
            return{
                locations:()=>fetch(url+`locations.json`).then(r=>r.json()),
                today:(code)=>fetch(url+`forecast/today/${code}.json`).then(r=>r.json()),
                upcoming:(code)=>fetch(url+`forecast/upcoming/${code}.json`).then(r=>r.json()),

            }
        }
        DOMElements.$submit().addEventListener('click',getData);
        function getData() {
            const location = DOMElements.$location().value;
            weather().locations()
            .then()
            .then((locations)=>{
            const {code,name} = locations.find((o)=>o.name===location)
                return Promise.all([
                    weather().today(code),
                    weather().upcoming(code)
                ])
            })           
            .then(displayWeather)
            .catch(()=>{
                DOMElements.$forecast();
                DOMElements.$current().innerHTML=`<h1>ERROR</h1>`;
                DOMElements.$upcoming().innerHTML = `Unknown Location`;
                        })
        }
        function displayWeather(arr) {
            DOMElements.$forecast();
            DOMElements.$current().innerHTML=`<div class="label">Current conditions</div>`;
            DOMElements.$upcoming().innerHTML =   `<div class="label">Three-day forecast</div>`;          
            const [today,upcoming] = arr;
            const {condition,high,low} = today.forecast;
            let symbol = getSymbolFormat(condition);

          let $forecast = createElement('div',['forecasts']);
          let $spanSymbol = createElement('span',['condition','symbol'],weatherSymbols[symbol])
          let $todayForecastWraper = createElement('span',['condition'])
          let $name = createElement('span',['forecast-data'],today.name)
          let $degrees = createElement('span',['forecast-data'],`${low}${weatherSymbols.degrees}/${high}${weatherSymbols.degrees}`)
          let $condition = createElement('span',['forecast-data'],condition)

          $todayForecastWraper.append($name,$degrees,$condition);
          $forecast.append($spanSymbol,$todayForecastWraper)
          DOMElements.$current().appendChild($forecast);

          upcoming.forecast.forEach(u =>displayUpcomingWeather(u))
        }
        function displayUpcomingWeather(upcoming) {
            let symbol = getSymbolFormat(upcoming.condition)
            
            let $forecastInfo = createElement('div',['forecast-info'])
            let $upcoming = createElement('span',['upcoming'])
            let $symbol = createElement('span',['symbol'],weatherSymbols[symbol])
            let $degrees = createElement('span',['forecast-data'],`${upcoming.low}${weatherSymbols.degrees}/${upcoming.high}${weatherSymbols.degrees}`)
            let $condition = createElement('span',['forecast-data'],upcoming.condition)
            $upcoming.append($symbol,$degrees,$condition);
            $forecastInfo.appendChild($upcoming);
            DOMElements.$upcoming().appendChild($forecastInfo);
        }
        function createElement(tagName,classNames,textContent) {
            let el = document.createElement(tagName)
            if(classNames){
                  el.classList.add(...classNames)
            }
            if(textContent){
                el.textContent = textContent;
            }
            return el
        }
        function getSymbolFormat(symbol){
            return symbol.split(" ").filter(c=>c !== " ").map((c)=>c.toLowerCase()).join('');
        }
    }

attachEvents();