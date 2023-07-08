const APIKey = "ed6cd41870e9e5760a1bfad6d99542f3";
let selectedCityText;
let selectedCity;
const getCities = async(searchText)=>{
    const resp = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${searchText}&limit=5&appid=${APIKey}`);
    return resp.json();
}
const getCurrentWeatherAPI = async({lat,lon,name:city})=>{
    const url = lat && lon ? `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric`:`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=metric`;
    const resp = await fetch(url);
    return resp.json();
}

const getHourlyWeatherAPI = async({name:city})=>{
    const resp = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}&units=metric`);
    const data = await resp.json();
    return data.list.map(forecast =>{
        const{main:{temp,temp_max,temp_min},dt,dt_txt,weather:[{description,icon}]} = forecast;
        return {temp,temp_max,temp_min,dt,dt_txt,description,icon}
    })
}

const formatTemp = (temp)=> `${temp?.toFixed(1)}`;

const loadCurrentForecast = ({name,main:{temp,temp_max,temp_min},weather:[{description}]})=>{
    const currentForecastElement = document.querySelector("#current-forecast");
    currentForecastElement.querySelector(".city").textContent = name;
    currentForecastElement.querySelector(".temp").textContent = formatTemp(temp);
    currentForecastElement.querySelector(".desc").textContent = description;
    currentForecastElement.querySelector(".min-max").textContent = `H:${formatTemp(temp_max)} L:${formatTemp(temp_min)}`;
}

const loadHourlyForecast = ({main:{temp:tempNow}, weather:[{icon:iconNow}]},hourlyForecast)=>{
    const timeFormatter = Intl.DateTimeFormat("en",{hour12:true,hour:"numeric",minute: 'numeric'})
    let dataFor12Hours = hourlyForecast.slice(2,14);
    const hourlyContainer = document.querySelector('.hourly-container');
    let innerHTMLString = `<article class="hourly-cont">
    <h3 class="time">Now</h3>
    <img class="icon" src="${`http://openweathermap.org/img/wn/${iconNow}@2x.png`}" alt="icon">
    <p class="hourly-temp">${formatTemp(tempNow)}</p>
</article>`;
    for(let{temp,icon,dt_txt}of dataFor12Hours){
        innerHTMLString += `<article class="hourly-cont">
                    <h3 class="time">${timeFormatter.format(new Date(dt_txt))}</h3>
                    <img class="icon" src="${`http://openweathermap.org/img/wn/${icon}@2x.png`}" alt="icon">
                    <p class="hourly-temp">${formatTemp(temp)}</p>
                </article>`;
    }
    hourlyContainer.innerHTML = innerHTMLString;
}

const loadFeelsLike = ({main : {feels_like}})=>{
    let FeelsLikeElement = document.querySelector("#feels-like");
    FeelsLikeElement.querySelector(".feels-like-temp").textContent = formatTemp(feels_like);
}
const loadHumidity = ({main : {humidity}})=>{
    let HumidityElement = document.querySelector("#humidity");
    HumidityElement.querySelector(".humidity-val").textContent = `${humidity}%`;
}

const onSearchChange = async(event)=>{
    let {value} = event.target;
    if(!value){
        selectedCity = null;
        selectedCityText = "Mangalore";
    }
    if(value && (selectedCityText !== value)){
        const listOfCities = await getCities(value);
        let options = "";
        for(let {lat,long,name,state,country} of listOfCities){
            options +=`<option data-city-details='${JSON.stringify({lat,long,name})}' value="${name},${state},${country}"></option>`
        }
        document.getElementById("cities").innerHTML = options;
    }
}

function debounce(func){
    let timer;
    return(...args)=>{
        clearTimeout(timer);
        timer = setTimeout(()=>{
            func.apply(this,args)
        },500)
    }
}

const debounceSearch = debounce((event)=>{
    onSearchChange(event)
})

const onCitySelection = (event)=>{
    selectedCityText = event.target.value;
    let options = document.querySelectorAll("#cities > option");
    if(options?.length){
        let selectedOption = Array.from(options).find(opt =>opt.value === selectedCityText);
        selectedCity = JSON.parse(selectedOption.getAttribute("data-city-details"));
        loadData();
    }
}

const getUsersLocation = ()=>{
    navigator.geolocation.getCurrentPosition(({coords})=>{
        const {latitude : lat , longitude:lon} = coords;
        selectedCity = {lat,lon};
        loadData();
    },error=>console.log(error))
}

const loadData = async()=>{
    const currentWeatherAPIResp = await getCurrentWeatherAPI(selectedCity);
    const hourlyWeatherAPIResp = await getHourlyWeatherAPI(currentWeatherAPIResp);
    loadCurrentForecast(currentWeatherAPIResp);
    loadHourlyForecast(currentWeatherAPIResp,hourlyWeatherAPIResp);
    loadFeelsLike(currentWeatherAPIResp);
    loadHumidity(currentWeatherAPIResp);
}

document.addEventListener("DOMContentLoaded",async ()=>{
    getUsersLocation();
    const inputSearch = document.querySelector("#search");
    inputSearch.addEventListener("input",debounceSearch)
    inputSearch.addEventListener("change",onCitySelection)
});