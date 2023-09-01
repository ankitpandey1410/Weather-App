const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-conatiner");
const userInfoContainer  =  document.querySelector(".user-info-container");

//  initial variable :
let oldTab = userTab;
const API_KEY = "407cb2c23075b36d1b83f5cf055d72de";
oldTab.classList.add("current-tab");

getFromSessionStorage();

function switchTab (newTab) {
  if(newTab != oldTab)  {
    oldTab.classList.remove("current-tab");
    oldTab = newTab;
    oldTab.classList.add("current-tab");

    if(!searchForm.classList.contains("active")) {
      //  kya search form wala container is  invisisble , if yes then make it visible : 
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    }

    else
    {
      //  main pahle search weather wale tab par tha ab you weathewr wale tab visible krna hai :
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      //  ab main your weather wala tab me aa gya hoon  to weather v display krna prega , so let's check local storage first
      //  for cordinates , if we have saved them  there 
      getFromSessionStorage();
    }
  }
}

userTab.addEventListener("click" , () => {
  //  pass clicked tab as input parameter
  switchTab(userTab);
});

searchTab.addEventListener("click" , () => {
  //  pass clicked tab as input parameter
  switchTab(searchTab);
});

//  check if coordinates are already present in session storage :
function getFromSessionStorage () {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if(!localCoordinates) {
    //  agar local coordinates nahi mile to
    grantAccessContainer.classList.add("active");
  }
  else
  {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates) {
  const {lat , lon} = coordinates;
  //  make grantContainer invisible :
  grantAccessContainer.classList.remove("active");
  //  make loader visible  :
  loadingScreen.classList.add("active");

  //  API CALL
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const data = await response.json();

    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  }

  catch(err)  {
    loadingScreen.classList.remove("active");
  }
}

function renderWeatherInfo (weatherInfo) {
  //  firstly we have to fetch elements 

  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity =  document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");

  //  fetch values from weatherinfo object and put it into UI elements :
  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`; 
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = `${weatherInfo?.main?.temp} °C`;
  windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity} %`; 
  cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;  

}

function getLocation() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
  else {

  }
}

function showPosition (position) {
  const userCoordinates = {
    lat : position.coords.latitude,
    lon : position.coords.longitude,
  }

  sessionStorage.setItem("user-coordinates" , JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click" , getLocation);

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit" , (e) => {
  e.preventDefault();
  let cityName = searchInput.value;

  if(cityName === "")
    return;
  else
    fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const data = await response.json();

    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  }
  catch(err) {

  }
}