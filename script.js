let currentPokemon = [];
index = 0;
let movesShown = false;
let statsShown = false;

async function init() {
    for (let i = 1; i < 29; i++) { //hiermit wird bestimmt, wie viele Pokemon in der Übersicht geladen werden sollen
        await loadPokemon(i);
    }
    renderOverview();
}

async function loadPokemon(i) {
    let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    let response = await fetch(url);
    pokemon = await response.json();
    currentPokemon.push(pokemon);
}

function renderOverview() {
    let search = document.getElementById('search').value.toLowerCase();
    document.getElementById('pokemon-overview').innerHTML = ' ';
    for (let i = 0; i < currentPokemon.length; i++) {
        let name = currentPokemon[i]['name'];
        let firstType = currentPokemon[i]["types"][0]["type"]["name"]; //Ich möchte nur den ersten Typ des Pokemonszeigen
        let images = currentPokemon[i]['sprites']['other']['home']['front_default'];
        if (name.toLowerCase().includes(search) || firstType.toLowerCase().includes(search)) {
            let cardType = ['fire', 'water', 'bug', 'electric', 'normal', 'poison', 'ground', 'fairy', 'rock', 'fighting', 'psychic'].includes(firstType) ? firstType : 'grass'; // Abkürzung einer if-else-Abfrage
            document.getElementById('pokemon-overview').innerHTML += overviewHTML(i, name, firstType, images, cardType); // Füge die Karte zur Übersicht hinzu
        }
    }
}

function showPokemonCard(i) {
    index = i; // das brauche ich für die SwipeLeft und SwipeRight Funktion
    document.getElementById('pokemon-card').classList.remove('pokemon_card_hidden');
    document.getElementById('pokemon-card').classList.add('pokemon_card');
    let names = currentPokemon[i]['name'];
    let id = currentPokemon[i]['id'];
    let types = currentPokemon[i]["types"]["0"]["type"]["name"];
    let images = currentPokemon[i]['sprites']['other']['home']['front_default'];
    let species = currentPokemon[i]['species']['name'];
    let height = currentPokemon[i]['height'];
    let weight = currentPokemon[i]['weight'];
    let abilities = currentPokemon[i]['abilities']["0"]["ability"]["name"];
    let baseexperience = currentPokemon[i]["base_experience"];
    let typeColor = ['fire', 'water', 'bug', 'electric', 'normal', 'poison', 'ground', 'fairy', 'rock', 'fighting', 'psychic'].includes(types) ? types : 'grass';
    let cardColor = ['fire', 'water', 'bug', 'electric', 'normal', 'poison', 'ground', 'fairy', 'rock', 'fighting', 'psychic'].includes(types) ? types : 'grass';
    document.getElementById('pokemon-card').innerHTML = cardHTML(cardColor, names, id, typeColor, types, images, species, height, weight, types, abilities, baseexperience);
}

function showAbout() {
    showPokemonCard(index);
}

function showBaseStats(i) {
    document.getElementById('stats').innerHTML = '';
    for (let i = 0; i < currentPokemon[index]["stats"].length; i++) {
        let stat = currentPokemon[index]["stats"][i]["base_stat"];
        let statName = currentPokemon[index]["stats"][i]["stat"]["name"];
        let progressBar = `progress-bar-${i}`;
        document.getElementById('moves').innerHTML = '';
        document.getElementById('table').innerHTML = '';
        document.getElementById('stats').innerHTML += tableHTML(statName, stat, progressBar);
        let width = stat * 3;
        document.getElementById(progressBar).style.width = `${width}%`;
    }
}

function showMoves(i) {
    document.getElementById('moves').innerHTML = '';
    for (let i = 0; i < 13; i++) {
        let move = currentPokemon[index]["moves"][i]["move"]["name"];
        document.getElementById('table').innerHTML = '';
        document.getElementById('stats').innerHTML = '';
        document.getElementById('moves').innerHTML += `
        <div class="move">${move}</div>
        `
    }
}

function closePokemonCard() {
    document.getElementById('pokemon-card').classList.remove('pokemon_card');
    document.getElementById('pokemon-card').classList.add('pokemon_card_hidden');
}

function searchFunction() { //SUCHFUNKTION
    renderOverview(); // Hier wird die Renderfunktion erneut aufgerufen, um die Übersicht basierend auf der Sucheingabe neu zu erstellen.
}

function emptyInputfield() {
    document.getElementById('search').value = '';
    renderOverview();
}

function swipeLeft() {
    index -= 1;
    if (index < 0) {
        index = currentPokemon.length - 1;
    }
    showPokemonCard(index); //index muss ich in Klammern setzen, damit die showPokemoncard Funktion den Index als i erkennt
}

function swipeRight() {
    index += 1;
    if (index >= currentPokemon.length) {
        index = 0;
    }
    showPokemonCard(index); //index muss ich in Klammern setzen, damit die showPokemoncard Funktion den Index als i erkennt
}

async function showMore() {
    for (let i = 29; i < 57; i++) { //hiermit wird bestimmt, wie viele Pokemon in der Übersicht geladen werden sollen
        await loadPokemon(i);
    }
    renderOverview();
    document.getElementById('show-more').innerHTML = '';
}

function overviewHTML(i, name, firstType, images, cardType) {
    return `
    <div id="card-small" class="card_small card_small_${cardType}" onclick="showPokemonCard(${i})">
        <div>
            <div class="container_name_overview">
                <span class="name_overview">${name}</span>
            </div>
            <div class="type_overview types_${cardType}">${firstType}</div> 
        </div>
        <div>
            <img class="image_overview" src="${images}" alt="">
        </div>
    </div>`;
}

function cardHTML(cardColor, names, id, typeColor, types, images, species, height, weight, types, abilities, baseexperience) {
    return `
    <div id="pokemon" class="card card_${cardColor}">
        <section class="upper_section">
            <div class="container_cross">
                <div class="cross" onclick="closePokemonCard()">x</div>
            </div>
            <div class="container_arrows">
                <div class="arrow" onclick="swipeLeft()"><</div>
                <div class="arrow" onclick="swipeRight()">></div>
            </div>
            <div class="container_name">
                <span class="name" id="name">${names}</span>
            </div>
            <div class="container_id">
                <div id="id"># ${id}</div>
            </div>
            <div class="container_types">
                <div id="type" class="types types_${typeColor}">${types}</div>
            </div>
            <div class="container_image">
                <img class="image" id="image" src="${images}" alt="">
            </div>
        </section>
        <section class="lower_section">
        <div class="sections">
            <div class="classes">
                <span class="class" onclick="showAbout()">About</span>
                <span class="class" onclick="showBaseStats()">Base Stats</span>
                <span class="class" onclick="showMoves()">Moves</span>
            </div>
            <div class="container_border">
                <div class="border_grey"></div>
                <div class="border_grey"></div>
                <div class="border_grey"></div>
            </div>
            </div>
            <div id="stats"></div>
            <div class="moves" id="moves"></div>
            <div id="table">
            <table>
                <tr>
                    <td>Species</td>
                    <td class="tabledata_about" id="species">${species}</td>
                </tr>
                <tr>
                    <td>Height</td>
                    <td class="tabledata_about" id="height">${height} cm</td>
                </tr>
                <tr>
                    <td>Weight</td>
                    <td class="tabledata_about" id="weight">${weight} g</td>
                </tr>
            </table>
            <div class="subheadline">Skills</div>
            <table>
                <tr>
                    <td>Types</td>
                    <td class="tabledata_about">${types}</td>
                </tr>
                <tr>
                    <td>Abilities</td>
                    <td class="tabledata_about">${abilities}</td>
                </tr>
                <tr>
                    <td>Experience</td>
                    <td class="tabledata_about">${baseexperience}</td>
                </tr>
            </table>
            </div>
        </section>
    </div>`
}

function tableHTML(statName, stat, progressBar) {
    return `
    <table>
        <tr>
            <td>${statName}</td>
            <td class="tabledata">${stat}</td>
            <td><div class="progressbar" id="${progressBar}"></div></td>
        </tr>
    </table>
    `
}

