const input = document.getElementById("searchPokemon");
const btSearchPokemon = document.getElementById("btSearchPokemon");
const inputFilter = document.getElementById("filterPokemon");
const labelFilter = document.querySelector("label")
const container = document.querySelector(".container");
let divCard = document.querySelector(".card");
const pokedex = document.getElementById("pokedex");
const list = document.querySelector("#list");
const h2 = document.querySelector("h2");
let pokedexList = [];
let cardPokemonList = "";
let body = document.querySelector("body");
let filter = document.getElementById("filter");


const addPokemonInPokedex = (id) => {

    const cardPokemon = divCard.parentElement.childNodes[3];
    const cardPokemonLi = document.createElement("li");

    h2.textContent = "Pokédex";

    const newIcon = document.createElement("i");

    newIcon.id = ("remove");
    newIcon.classList.add("iconify");
    newIcon.setAttribute("data-icon", "mdi-minus-circle");
    newIcon.setAttribute("onclick", `removePokemonInPokedex(${id})`);

    cardPokemonLi.innerHTML = cardPokemonList;

    const oldIcon = cardPokemonLi.childNodes[0].childNodes[1];
    oldIcon.remove();

    cardPokemonLi.childNodes[0].append(newIcon);

    list.appendChild(cardPokemonLi);
    pokedexList.push(cardPokemonList);

    cardPokemon.innerHTML = "";

    body.removeAttribute("keydown");

    localStorage.setItem("pokedexList", JSON.stringify(pokedexList));
    location.reload();

    filter.className = "input-filter";
};

const removePokemonInPokedex = (id) => {
    for (let i = 0; i < list.children.length; i++) {
        let cardPokemon = list.children[i];

        let strId = cardPokemon.children[0].children[1].textContent;
        let aux = strId.indexOf('.');
        strId = strId.substring(0, aux);

        if (strId == id) {
            cardPokemon.remove();
            pokedexList.length == 1 ? pokedexList.pop() : pokedexList.splice(i, 1);

            if (list.children.length == 0) {
                h2.textContent = "Não há Pokemons na sua lista!";
            }

        }
    }
    if (pokedexList.length > 0) {
        localStorage.clear();
        localStorage.setItem("pokedexList", JSON.stringify(pokedexList));
    } else {
        localStorage.clear();
        filter.className = "input-filter-hidden"
    }

};

const showList = () => {
    let pokedexListFromStorage = localStorage.getItem("pokedexList");
    pokedexListFromStorage ? pokedexList = JSON.parse(pokedexListFromStorage) : [];
    pokedexListFromStorage ? h2.textContent = "Pokédex" : h2.textContent = "Não há Pokemons na sua lista!";
    pokedexListFromStorage ? filter.className = "input-filter" : filter.className = "input-filter-hidden";

    pokedexList.forEach(pokemon => {

        const newIcon = document.createElement("i");

        let cardPokemonLi = document.createElement("li");
        cardPokemonLi.innerHTML = pokemon;

        let strId = cardPokemonLi.childNodes[0].children[2].textContent;
        let aux = strId.indexOf('.');
        strId = strId.substring(0, aux);

        newIcon.id = ("remove");
        newIcon.classList.add("iconify");
        newIcon.setAttribute("data-icon", "mdi-minus-circle");
        newIcon.setAttribute("onclick", `removePokemonInPokedex(${strId})`);

        const oldIcon = cardPokemonLi.childNodes[0].childNodes[1];
        oldIcon.remove();

        cardPokemonLi.childNodes[0].append(newIcon);

        list.appendChild(cardPokemonLi);

    });
};

const checkPokemonTypes = (object) => {

    let namesTypes = [];

    if (object.length > 1) {

        object.keys(object).forEach(element => {
            namesTypes.push(object[element].type.name);
        });
    } else {
        return object[0].type.name;
    }

    return namesTypes.join(" | ");
};

const checkPokedex = (name) => {
    let pokedexListFromStorage = JSON.parse(localStorage.getItem("pokedexList"));

    for (let i = 0; i < pokedexListFromStorage.length; i++) {

        if (pokedexListFromStorage[i].includes(name) == true) {
            return true;
        }
    }

    return false;


};

const playSoundPokemon = (id) => {
    let audioPokemon = new Audio(`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`);
    audioPokemon.play();
};

const playGifPokemon = (urlGif, id) => {
    let imgPokemon = document.getElementById(`${id}`);
    imgPokemon.src = urlGif;
    imgPokemon.className = "img-card-gif"
};

const stopGitPokemon = (urlImg, id) => {
    let imgPokemon = document.getElementById(`${id}`);
    imgPokemon.src = urlImg;
    imgPokemon.className = "img-card"
    
}

const creatCard = (data) => {
    let namePokemon = data.name;
    let firstLetterName = namePokemon[0];
    namePokemon = namePokemon.replace(firstLetterName, firstLetterName.toUpperCase());
    
    const idPokemon = data.id;
    const classPokemon = checkPokemonTypes(data.types);
    const imgPokemon = data.sprites["front_default"];
    const height = data.height / 10;
    const weight = data.weight / 10;
    const gifPokemon = data.sprites.other.showdown.front_default;

    const newCard = `<div id="card" class="${classPokemon}">
    <i onclick="addPokemonInPokedex(${idPokemon})" id="add" class="iconify" data-icon="mdi-plus-circle"></i>
    <div id="img">
    <img onmouseout="stopGitPokemon('${imgPokemon}', ${idPokemon})" onmousemove="playGifPokemon('${gifPokemon}', ${idPokemon})" onclick="playSoundPokemon(${idPokemon})"  id="${idPokemon}" class="img-card" src="${imgPokemon}" alt="${namePokemon}">
    </div>
    <p>${idPokemon}. ${namePokemon}</p>
    <div id="description">
    <span >${classPokemon}</span>
    <span >Altura: ${height} M </span>
    <span >Peso: ${weight} KG</span>
    </div>
    </div>`;


    if (JSON.parse(localStorage.getItem("pokedexList") != null) && checkPokedex(namePokemon) == true) {
        alert("Pokémon já está na pokédex");

    } else {
        divCard.innerHTML = newCard;
        let icon = document.getElementById("add");
        body.addEventListener("keydown", function addCard(e) {
            if (e.ctrlKey && e.key == "Enter") {
                e.preventDefault();
                icon.click();
            }
        });

        return newCard;
    };

}

btSearchPokemon.addEventListener("click", async (e) => {
    e.preventDefault();

    const namePokemon = input.value.toLowerCase();
    await fetch(`https://pokeapi.co/api/v2/pokemon/${namePokemon}`)
        .then((response) => {
            if (response.status === 404) {
                alert("Nome de do Pókemon incorreto!");
                input.focus();
                divCard.innerHTML = "";
            } else if (!response.ok) {
                throw Error(response.statusText);
            }
            response.json()
                .then((data) => {
                    input.value = "";
                    cardPokemonList = creatCard(data);
                });
        });
});

inputFilter.addEventListener("keyup", (e) => {
    let valueInput = e.target.value.trim();
    if (valueInput != "") {

        labelFilter.className = "label-filter";
        let pokemons = list.children;
        for (const pokemon of pokemons) {
            let card = pokemon.childNodes[0]
            
            let strIdAndName = card.children[1].textContent;
            let aux = strIdAndName.indexOf('.');
            let strId = strIdAndName.substring(0, aux);
            let strName = strIdAndName.substring(aux + 2, strIdAndName.length);
            
            let typeOfPokemon = card.childNodes[6].children[0].textContent
            
            if (strId == valueInput) {
                card.style.display = 'flex'
            } else if (typeOfPokemon.includes(valueInput)) {
                card.style.display = 'flex'
            } else if (strName.toLowerCase() === valueInput.toLowerCase()) {
                card.style.display = 'flex'
            } else {
                card.style.display = 'none'
            }
            
        }
        
    } else {
        location.reload();
        labelFilter.className = "label-filter-empyt";
    }
});

showList();
input.focus();