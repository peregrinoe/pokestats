const pokeName = document.querySelector('[data-poke-name]');
const pokemonName = document.querySelector('[data-pokemon-name]');
const infoPokemon = document.querySelector('[data-pokemon-info]');
const cardPokemon = document.querySelector('[data-pokemon-card]');
const pokeImageContainer = document.querySelector('[data-poke-image-container]');
const pokeImage = document.querySelector('[data-poke-image]');
const pokeId = document.querySelector('[data-poke-id]');
const pokeType = document.querySelector('[data-poke-type]');
const statsPokemon = document.querySelector('[data-poke-stats]');

const typeColors = {
    electric: '#FFEA70',
    normal: '#B09398',
    fire: '#FF675C',
    water: '#0596C7',
    ice: '#AFEAFD',
    rock: '#999799',
    flying: '#7AE7C7',
    grass: '#4A9681',
    psychic: '#FFC6D9',
    ghost: '#561D25',
    bug: '#A2FAA3',
    poison: '#795663',
    ground: '#D2B074',
    dragon: '#DA627D',
    steel: '#1D8A99',
    fighting: '#2F2F2F',
    fairy: '#FFC0CB',
    default: '#2A1A1F',
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
    default: 'N/A',
};

const searchPokemon = event => {
    event.preventDefault();
    const { value } = event.target.pokemon;
    fetch(`https://pokeapi.co/api/v2/pokemon/${value.toLowerCase()}`)
        .then(data => data.json())
        .then(response => renderPokemonData(response))
}

const renderPokemonData = data => {
    const sprite = data.sprites.front_default;
    const {stats, types, abilities, moves } = data;
    
    pokeName.textContent = data.name;
    pokeImage.setAttribute('src', sprite);
    pokeId.textContent = `N° ${data.id}`;
    setCardColor(types);
    renderPokemonTypes(types);
}

const setCardColor = types => {
    const colorOne = typeColors[types[0].type.name];
    const colorTwo = types[1] ? typeColors[types[1].type.name] : typeColors.default;
    pokeImage.style.background =  `radial-gradient(${colorTwo} 33%, ${colorOne} 33%)`;
    pokeImage.style.backgroundSize = ' 5px 5px';
}

const renderPokemonTypes = types => {
    pokeType.innerHTML = '';
    types.forEach(type => {
        const typeTextElement = document.createElement("div");
        typeTextElement.style.color = typeColors[type.type.name];
        typeTextElement.textContent = type.type.name;
        typeTextElement.textContent = spanishName[type.type.name];
        pokeType.appendChild(typeTextElement);   
    });
}