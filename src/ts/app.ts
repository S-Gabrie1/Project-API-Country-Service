
const divBox = document.querySelector(".country") as HTMLElement;
const secBox = document.querySelector(".box") as HTMLElement;
const btn1 = document.querySelector("#potato") as HTMLButtonElement;
const btn2 = document.querySelector("#cherry") as HTMLButtonElement;
const searchBox = document.querySelector(".search-bar") as HTMLInputElement;
const selectRegion = document.querySelector("#filter") as HTMLSelectElement;

const urlRegion = "https://restcountries.com/v3.1/region/"
const urlAll = "https://restcountries.com/v3.1/all";
const urlSearch = "https://restcountries.com/v3.1/name/"


// ==> types for my Array
type countryArr = {
    country: string;
    flags: string;
    population: number;
    region: string;
    capital: string;
}

// ==> types for the JSON data
type countryData = {
    name: {
        common : string;
    }
    flags: {
        png: string;
    }
    population : number;
    region: string;
    capital: string;
}

let searchedCountries: countryArr[] = [];




// ===> function for DOM manupilation
const countryHTML = (country: countryData) => `
  <div class="country-img">
    <img src="${country.flags.png}">
  </div>
  <div class="country-detail">
    <h5>${country.name.common}</h5>
    <p>Population: ${country.population}</p>
    <p>Region: ${country.region}</p>
    <p>Capital: ${country.capital}</p>
  </div>
`;


// ===> print out countries with information
let counter = 4;
let i = 1;
async function getCountries() {
    const response = await fetch(urlAll)
    const data = await response.json();
    
    if (i <= data.length) {
        for ( i ; i < counter ; i ++) {
                divBox.style.display = "none"
              let divbox2 = document.createElement("div");
              divbox2.className = "countryshow"
                divbox2.innerHTML = countryHTML(data[i]);
                secBox.append(divbox2);
        }
        i += 1;
        counter +=4;
    }

}


// ==> search for a specific country & saves it into and array to show (searched for countries)
searchBox.addEventListener("keyup", async function(event){
    event.preventDefault();
    const response = await fetch(urlSearch + searchBox.value);
    const data = await response.json();
    const errorMessage = document.getElementById("error-message") as HTMLSpanElement;

    if (event.key === "Enter") {
        secBox.innerHTML = "";
        if (data[0]) {
            const countries: countryArr = {
                country: data[0].name.common,
                flags: data[0].flags.png,
                population: data[0].population,
                region: data[0].region,
                capital: data[0].capital
            };
            
            const exists = searchedCountries.findIndex(c => c.country === countries.country);
            
            if (exists === -1) {
                searchedCountries.push(countries);
            } else {
                searchedCountries.splice(exists, 1);
                searchedCountries.unshift(countries);
            }

            divBox.innerHTML = countryHTML(data[0]);
            errorMessage.style.display = "none";
            divBox.style.display = "block";
          
        } else {
            errorMessage.innerText = "Country not found, please try again !";
            errorMessage.style.display = "flex";
            getCountries();
        }
        searchBox.value = "";
        secBox.append(divBox);
        
    }
    
});



// ===> show the Countries according to their region
selectRegion.addEventListener("change", async function(e){
    e.preventDefault();
    const optionChosen = urlRegion + selectRegion.value;
    const response = await fetch(optionChosen);
    const data : any[] = await response.json();

    secBox.innerHTML = "";
    if(data[0]) {
        data.forEach(country => {
            const countryDiv = document.createElement("div");
            countryDiv.className = "filterCountry"
            countryDiv.innerHTML = countryHTML(country);
            secBox.append(countryDiv);
    
        });

    } else {
        getCountries();
    }

})



// ==> show more countries 
btn1.addEventListener("click", async function(event) {
    event.preventDefault();
    secBox.innerHTML = "";
    getCountries();
})



// ===> Show all the Searched for Countries. 
btn2.addEventListener("click", async function(event){
    event.preventDefault();
    secBox.innerHTML = "";

    if (searchedCountries.length === 0) {
        let errMsg = document.createElement("p");
        errMsg.className = "err-msg";
        errMsg.innerText = "You haven't searched for a country yet";
        secBox.appendChild(errMsg);

    } else {

        for (const countries of searchedCountries) {
            let divArray = document.createElement("div");
            divArray.className = "saved-countries";
            divArray.innerHTML = `
            <div class="country-img">
                <img src="${countries.flags}">
            </div>
            <div class="country-detail">
                <h5>${countries.country}</h5>
                <p>Population: ${countries.population}</p>
                <p>Region: ${countries.region}</p>
                <p>Capital: ${countries.capital}</p>
            </div>
            `;
            secBox.append(divArray);
            
        }
    }

})

getCountries();