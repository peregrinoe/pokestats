const pokeName = document.querySelector('[data-poke-name]');
const pokemonName = document.querySelector('[data-pokemon-name]');
const infoPokemon = document.querySelector('[data-pokemon-info]');
const cardPokemon = document.querySelector('[data-pokemon-card]');
const statsPokemon = document.querySelector('[data-pokemon-stats]');
const statsPokemonBase = document.querySelector('[data-stats-pokemon-base]');
const pokeImageContainer = document.querySelector('[data-poke-image-container]');
const pokeImage = document.querySelector('[data-poke-image]');
const pokeId = document.querySelector('[data-poke-id]');
const pokeType = document.querySelector('[data-poke-type]');
const pokeAbility = document.querySelector('[data-poke-ability]');
const pokeStats = document.querySelector('[data-poke-stats]');
const pokeFooterColor = document.querySelector('[data-color-footer-poke]');

const typeColors = {
    electric: '#fab715',
    normal: '#aaa59c',
    fire: '#f14411',
    water: '#1063b7',
    ice: '#a0e6fe',
    rock: '#9d853c',
    flying: '#97a9f5',
    grass: '#27cb50',
    psychic: '#df356a',
    ghost: '#474696',
    bug: '#89980e',
    poison: '#241923',
    ground: '#d2b054',
    dragon: '#725ada',
    steel: '#8f8f9c',
    fighting: '#7f331c',
    fairy: '#e190e1',
    dark: '#3d2d22',
    default: '#a17366',
};

const spanishName = {
    electric: 'Electrico',
    normal: 'Normal',
    fire: 'Fuego',
    water: 'Agua',
    ice: 'Hielo',
    rock: 'Roca',
    flying: 'Volador',
    grass: 'Hierba',
    psychic: 'Psiquico',
    ghost: 'Fantasma',
    bug: 'Bicho',
    poison: 'Veneno',
    ground: 'Tierra',
    dragon: 'Dragon',
    steel: 'Acero',
    fighting: 'Pelea',
    fairy: 'Hada',
    dark: "Sinistro",
    default: 'N/A',
};

const spanishStats = {
    "hp" : 'Salud',
    "attack" : 'Ataque',
    "defense" : 'Defensa',
    "special-attack": 'Ataque Especial',
    "special-defense": 'Defensa Especial',
    "speed" : 'Velocidad',
};

const searchPokemon = event => {
    event.preventDefault();
    const { value } = event.target.pokemon;
    fetch(`https://pokeapi.co/api/v2/pokemon/${value.toLowerCase()}`)
        .then(data => data.json())
        .then(response => renderPokemonData(response))
        .catch(err => renderNotFound())
};

const renderPokemonData = data => {
    const sprite = data.sprites.front_default;
    const {stats, types, abilities} = data;
    pokeName.textContent = data.name;
    pokeImage.setAttribute('src', sprite);
    pokeId.textContent = `N° #${data.id}`;
    statsPokemonBase.textContent = "Experiencia Base: " + data.base_experience;
    setCardColor(types);
    renderPokemonTypes(types);
    renderPokemonStats(stats);
    renderPokemonAbility(abilities);
};

const setCardColor = types => {
    const colorOne = typeColors[types[0].type.name];
    const colorTwo = types[1] ? typeColors[types[1].type.name] : typeColors.default;
    pokemonName.style.background = colorOne;
    pokeImage.style.background =  `radial-gradient(${colorTwo} 33%, ${colorOne} 33%)`;
    pokeImage.style.backgroundSize = ' 5px 5px';
    pokeFooterColor.style.background = colorOne;
    statsPokemonBase.style.color = colorOne;
};

const renderPokemonTypes = types => {
    pokeType.innerHTML = '';
    types.forEach(type => {
        const typeTextElement = document.createElement("div");
        typeTextElement.style.background = typeColors[type.type.name];
        typeTextElement.textContent = type.type.name;
        typeTextElement.textContent = "Tipo " + spanishName[type.type.name];
        pokeType.appendChild(typeTextElement);
    });
};

const renderPokemonAbility = abilities => {
    pokeAbility.innerHTML = '';
    abilities.forEach(abilities => {
        const urlPokemon = abilities.ability.url;
        const abilityTextElement = document.createElement("div");
        abilityTextElement.textContent = abilities.ability.name;  
        pokeAbility.appendChild(abilityTextElement);
        
        fetch(urlPokemon)
            .then(response => response.json())
            .then(data => mostrarData(data))
        const mostrarData = (data) => {
            console.log(data.names[5].name);
            abilityTextElement.textContent = data.names[5].name;
        }
    });
};

const renderPokemonStats = stats => {
    pokeStats.innerHTML = '';
    stats.forEach(stat => {
        const statElement = document.createElement("div");
        const statElementName = document.createElement("div");
        const statElementPoints = document.createElement("div");
        const statElementAmount = document.createElement("div");
        const statElementBar = document.createElement("div");
        statElementName.style.cssText = 'width: 70%;';
        statElementAmount.style.cssText = 'width: 10%; justify-content: right;';
        statElementBar.style.cssText = 'width: 90%; height : 15px ; justify-self: left; margin-right: 5px; margin-bottom: 5px; background : #0f0f0f; border-radius: 10px;' ;
        statElementName.setAttribute("id", "poke-stats-name") ;
        statElementPoints.setAttribute("id", "poke-stats-points");
        statElementAmount.setAttribute("id", "poke-stats-amount");
        statElementName.textContent = stat.stat.name;
        statElementName.textContent = spanishStats[stat.stat.name];
        statElementBar.textContent = stat.base_stat;
        statElementAmount.textContent = stat.base_stat;
        statElementPoints.appendChild(statElementBar);
        statElement.appendChild(statElementName);
        statElement.appendChild(statElementPoints);
        statElement.appendChild(statElementAmount);
        pokeStats.appendChild(statElement); 
    })
};

const renderNotFound = () => {
    pokeName.textContent = 'No encontrado';
    pokeImage.setAttribute('src', 'https://pixelartmaker-data-78746291193.nyc3.digitaloceanspaces.com/image/e7cb1a05e60dd2e.png');
    pokeImage.style.background =  '';
    pokeType.innerHTML = '';
    pokeStats.innerHTML = '';
    pokeId.textContent = '';
    pokeAbility.textContent = '';
    statsPokemonBase.textContent = '';
};

