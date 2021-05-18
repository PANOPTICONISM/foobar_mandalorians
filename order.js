import "./sass/style.scss";

"use strict";

// load on start - maria
window.addEventListener("DOMContentLoaded", fetchData);

// fetch data from api - maria
async function fetchData() {
    const beertypes = "https://foobar-mandalorians.herokuapp.com/beertypes";
    const response = await fetch(beertypes);
    const data = await response.json();

    buildCards(data);
}

// divide our data - maria
function buildCards(beers) {
    beers.forEach(eachBeerCard);
    groupFilters(beers);
}

// array of all beertypes - maria
function groupFilters(fil) {
    let filterArr = [];

    for (let i = 0; i < fil.length; i++) {
        let result = filterArr.push(fil[i].category);
    }
    createFilters(filterArr);
}

// clean array from repetitive categories - maria
function createFilters(categories) {

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

// insert data into the DOM - maria
function eachBeerCard(beer) {
    // create a box for each beer, with a class named card
    const beerCard = document.createElement("div");
    beerCard.setAttribute("class", "card");

    // create and insert the api data into the right elements
    // TODO: missing image - put into common.js
    // TODO: price
    // TODO: counter
    const topLayer = document.createElement("div");
    topLayer.setAttribute("class", "top_layer");
    const beerName = document.createElement("h3");
    beerName.textContent = beer.name;

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

    topLayer.append(beerName, beerType);
    bottomLayer.append(readMore);

    beerCard.append(topLayer, bottomLayer);

    document.querySelector(".beers").appendChild(beerCard);
}