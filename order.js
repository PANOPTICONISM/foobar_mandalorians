import "./sass/style.scss";

"use strict";

// load on start - maria
window.addEventListener("DOMContentLoaded", fetchData);

// fetch data from api - maria
async function fetchData() {
    const beertypes = "https://foobar-mandalorians.herokuapp.com/beertypes";
    const response = await fetch(beertypes);
    const data = await response.json();

    filterData(data);
}

let allBeers = [];
// divide our data - maria
function filterData(beers) {
    allBeers = beers;
    beers.forEach(eachBeerCard);
    groupFilters();
    filterClicked();
}

// array of all beertypes - maria
function groupFilters() {
    let filterArr = [];
    for (let i = 0; i < allBeers.length; i++) {
        let result = filterArr.push(allBeers[i].category);
    }
    cleanFilters(filterArr);
}

// clean array from repetitive categories - maria
function cleanFilters(categories) {

    function isUnique(a, b) {
        return categories.indexOf(a) == b;
    }
    const cleanRepetitiveFilters = categories.filter(isUnique);

    appendFilters(cleanRepetitiveFilters);
}

// create and append filters to dom - maria
function appendFilters(filter) {

    filter.forEach(f => {
        const filterOption = document.createElement("button");
        filterOption.setAttribute("class", "filter");
        filterOption.textContent = f;
        document.querySelector(".filters").appendChild(filterOption);
    })

}

// filters in action - maria
function filterClicked() {
    document.querySelectorAll(".filter").forEach(btn => btn.addEventListener("click", sortItems));
}

function sortItems(e) {

    const filteredBeers = allBeers.filter(isBeertype);

    function isBeertype(beer) {
        if (e.target.textContent === beer.category) {
            return true;
        } else {
            return false;
        }
    }

    return rebuildList(filteredBeers);
}

// rebuild beer list options upon clicked filter - maria
function rebuildList(newList) {
    document.querySelector(".beers").innerHTML = "";
    newList.forEach(eachBeerCard);
}

// insert data into the DOM - maria
function eachBeerCard(beer) {
    // create a box for each beer, with a class named card
    const beerCard = document.createElement("div");
    beerCard.setAttribute("class", "card");

    // TODO: price
    // TODO: counter
    // create and insert the api data into the right elements
    const topLayer = document.createElement("div");
    topLayer.setAttribute("class", "top_layer");
    const beerName = document.createElement("h3");
    beerName.textContent = beer.name;
    const beerImage = document.createElement("img");
    beerImage.src = beer.label;
    beerImage.setAttribute("alt", beerName.textContent);

    const beerType = document.createElement("h4");
    beerType.textContent = beer.category;

    const bottomLayer = document.createElement("div");
    bottomLayer.setAttribute("class", "bottom_layer");
    const readMore = document.createElement("button");
    readMore.setAttribute("class", "read_more");
    readMore.textContent = "Read more";

    const alcoholPercentage = document.createElement("h5");
    alcoholPercentage.textContent = beer.alc;
    bottomLayer.appendChild(alcoholPercentage);

    topLayer.append(beerImage, beerName, beerType);
    bottomLayer.append(readMore);

    beerCard.append(topLayer, bottomLayer);

    document.querySelector(".beers").appendChild(beerCard);
}