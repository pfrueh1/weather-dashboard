const citySearchInput = document.querySelector('#citySearchInput');
const citySearchBtn = document.querySelector('#citySearchBtn');
const todaysWeatherEl = document.querySelector('#todaysWeather');
const historyContainer = document.querySelector('#historyContainer');
const day1 = {date: document.querySelector('#day1'),
            temp: document.querySelector('#day1temp'),
            wind:  document.querySelector('#day1wind'),
            humidity: document.querySelector('#day1humidity') };
 const day2 = {date: document.querySelector('#day2'),
            temp: document.querySelector('#day2temp'),
            wind: document.querySelector('#day2wind'),
            humidity: document.querySelector('#day2humidity') };
const day3 = {date: document.querySelector('#day3'),
            temp: document.querySelector('#day3temp'),
            wind: document.querySelector('#day3wind'),
            humidity: document.querySelector('#day3humidity') };
const day4 = {date: document.querySelector('#day4'),
            temp: document.querySelector('#day4temp'),
            wind: document.querySelector('#day4wind'),
            humidity: document.querySelector('#day4humidity') };
const day5 = {date: document.querySelector('#day5'),
            temp: document.querySelector('#day5temp'),
            wind: document.querySelector('#day5wind'),
            humidity: document.querySelector('#day5humidity') };

//get city name
function cityName() {
    getWeather(citySearchInput.value);
}        

    let searchedCityArr = [];
//get data for city
function getWeather(city){
    // let city = citySearchInput.value;
    let api1 = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=0fbb90cbd5a909ac7ef1eb8069130e32&units=imperial';


    
    fetch(api1).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                //feed data into converter
                convertData(data);
                citySearchInput.value = "";
 
                //add to array and save array
                if (!searchedCityArr.includes(city)) {
                    searchedCityArr.push(city);
                    let historyBtn = document.createElement('button');
                    historyBtn.setAttribute('class', 'btn btn-info col-12 mt-2 historyBtn');
                    historyBtn.textContent = city;
                    historyBtn.setAttribute('id', city);
                    historyContainer.appendChild(historyBtn);
                }
                localStorage.setItem('searchedCityArr', JSON.stringify(searchedCityArr));
            })
        }else {
            alert("Could not retrieve weather; Please try again");
        };
    })

};

//convert city name to lat and lon
function convertData(city){
    let api2 = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + city.city.coord.lat +'&lon=' + city.city.coord.lon +'&exclude=minutely,hourly,alerts&appid=0fbb90cbd5a909ac7ef1eb8069130e32&units=imperial'
    fetch(api2).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                //feed data into display today function
                displayResults(data);
            })
        }
    })
}

//displays weather 
function displayResults(city) {
   //display todays weather
   let date = moment();
   let today = moment(date).format('MMM Do YYYY');
   let cityEl = document.createElement("h2");
   //clear previous city details from container
   todaysWeatherEl.innerHTML = "";
   //Display city name and date
   cityEl.textContent = today;
   todaysWeatherEl.appendChild(cityEl);
   //display temp
   let tempEl = document.createElement("p");
   tempEl.textContent = "Temp:" + city.current.temp + "°F";
   todaysWeatherEl.appendChild(tempEl);
   //display wind speed
   let windEl = document.createElement("p");
   windEl.textContent = "Wind:" + city.current.wind_speed + "MPH";
   todaysWeatherEl.appendChild(windEl);
   //display humididty
   let humididtyEl = document.createElement("p");
   humididtyEl.textContent = "Humididty:" + city.current.humidity + "%";
   todaysWeatherEl.appendChild(humididtyEl);
   //display uv
   let uvEl = document.createElement("p");
   uvEl.textContent = "UV Index:" + city.current.uvi;
   //conditionals for uv background based on level
    if (city.current.uvi > 6 && city.current.uvi < 8 ) {
        uvEl.setAttribute('class', 'bg-warning');
    }else if(city.current.uvi < 6){
        uvEl.setAttribute('class', 'bg-success');
    }else if(city.current.uvi > 8) {
        uvEl.setAttribute('class', 'bg-danger');
    }
    todaysWeatherEl.appendChild(uvEl);
    //Display data for 5 day forcast
    let dayArray = [day1, day2, day3, day4, day5]
    for (let i = 0;i < dayArray.length; i++){
        dayArray[i].date.textContent = moment().add(i + 1, 'days').format('MMM D');
        dayArray[i].temp.textContent = city.daily[i].temp.day;
        dayArray[i].wind.textContent = city.daily[i].wind_speed;
        dayArray[i].humidity.textContent = city.daily[i].humidity;
    }


   
   console.log("city", city);
}

function historyBtnHandler(event) {
    let targetEl = event.target;
if (targetEl.matches(".historyBtn")) {
    let targetId = targetEl.id;
    getWeather(targetId);
}
}

function loadSearches() {

    var parsedSearches = JSON.parse( localStorage.getItem('searchedCityArr') );
    if (parsedSearches) {
        for (let i = 0; i < parsedSearches.length; i++){
            getWeather(parsedSearches[i]);
        }
    }       
    
}

loadSearches();

citySearchBtn.addEventListener("click" , function(){cityName()} );
historyContainer.addEventListener("click", function(){

    historyBtnHandler(event);
});