const enterFullScreen = () => {
    if (infoPokemon.requestFullscreen) {
        infoPokemon.requestFullscreen();
    } else if (infoPokemon.mozRequestFullScreen) { // Firefox
        infoPokemon.mozRequestFullScreen();
    } else if (infoPokemon.webkitRequestFullscreen) { // Chrome, Safari y Opera
        infoPokemon.webkitRequestFullscreen();
    } else if (infoPokemon.msRequestFullscreen) { // IE/Edge
        infoPokemon.msRequestFullscreen();
    }
};

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
const pokeTopColor = document.querySelector('[data-color-top-poke]');
const filter = document.querySelector('#filterPokemon');
const btnSearch = document.querySelector('#btn');
const pokemonsNumber = 10000;

let currentPokemonId = 1; // Agregado: Almacena el ID del Pokémon actual
let allPokemons = []; // Almacena todos los nombres de Pokémon

const typeColors = {
    electric: '#fab715',
    normal: '#aaa59c',
    fire: '#f14411',
    water: '#1063b7',
    ice: '#a0e6fe',
    rock: '#9d853c',
    flying: '#207394',
    grass: '#27cb50',
    psychic: '#df356a',
    ghost: '#474696',
    bug: '#cddc39',
    poison: '#482645',
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

window.addEventListener('load', enterFullScreen);

const loadAllPokemons = async () => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${pokemonsNumber}`);
    const data = await response.json();
    allPokemons = data.results.map(pokemon => pokemon.name);
};

loadAllPokemons();

// Evento de entrada en el campo de búsqueda
filter.addEventListener('input', () => {
    const { value } = filter;
    const lowerCaseValue = value.toLowerCase();
    if (lowerCaseValue === '') {
        hideSuggestions(); // Ocultar sugerencias si el campo está vacío
        return; // Salir de la función
    }
    // Filtrar nombres similares
    const matchedPokemons = allPokemons.filter(pokemon => pokemon.includes(lowerCaseValue));

    // Limitar a solo 5 resultados
    const limitedSuggestions = matchedPokemons.slice(0, 5);
    showSuggestions(limitedSuggestions);
});


// Mostrar sugerencias
const showSuggestions = (suggestions) => {
    const suggestionBox = document.querySelector('.suggestion-box');
    suggestionBox.innerHTML = ''; // Limpiar anteriores

    if (suggestions.length > 0) {
        suggestionBox.style.display = 'block'; // Mostrar caja de sugerencias
        suggestions.forEach(suggestion => {
            const suggestionItem = document.createElement('div');
            suggestionItem.textContent = suggestion;
            suggestionItem.onclick = () => {
                fetchPokemonData(suggestion); // Al hacer clic, busca el Pokémon
                hideSuggestions(); // Ocultar sugerencias al seleccionar
            };
            suggestionBox.appendChild(suggestionItem);
        });
    } else {
        hideSuggestions(); // Ocultar si no hay sugerencias
    }
};

const hideSuggestions = () => {
    const suggestionBox = document.querySelector('.suggestion-box');
    suggestionBox.innerHTML = ''; // Limpiar el contenido
    suggestionBox.style.display = 'none'; // Ocultar el contenedor
};

const searchPokemon = event => {
    event.preventDefault();
    const lowerCaseValue = filter.value.toLowerCase();
    const idValue = parseInt(lowerCaseValue);
    if (!isNaN(idValue) && idValue > 0 && idValue <= pokemonsNumber) {
        fetchPokemonData(idValue); // Busca por ID directamente
    } else {
        // Si no es un número, busca por nombre
        const matchedPokemons = allPokemons.filter(pokemon => pokemon.includes(lowerCaseValue));
        if (matchedPokemons.length > 0) {
            fetchPokemonData(matchedPokemons[0]); // Busca el primer Pokémon coincidente
        } else {
            renderNotFound(); // No se encontraron coincidencias
        }
    }

    hideSuggestions(); // Ocultar sugerencias al buscar
};

// Evento para manejar la tecla "Enter"
filter.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        searchPokemon(event); // Llama a la función para buscar el Pokémon
    }
});
const fetchPokemonData = async (id) => { // Cambiado: Nombre de la función
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!response.ok) throw new Error('No encontrado');
        const data = await response.json();
        currentPokemonId = data.id; // Actualiza el ID actual
        renderPokemonData(data);
        hideSuggestions(); // Ocultar sugerencias después de elegir
    } catch (error) {
        renderNotFound();
    }
};


// Funciones para manejar la navegación
const nextPokemon = () => {
    const nextId = currentPokemonId + 1;
    if (nextId <= pokemonsNumber) {
        fetchPokemonData(nextId);
    }
};

const previousPokemon = () => {
    const previousId = currentPokemonId - 1;
    if (previousId >= 1) {
        fetchPokemonData(previousId);
    }
};

// Asocia los botones a las funciones una sola vez
document.getElementById('next-btn').addEventListener('click', nextPokemon);
document.getElementById('prev-btn').addEventListener('click', previousPokemon);

let isMoving = false; // Bandera para evitar cambios múltiples
let startX = 0; // Variable para almacenar la posición inicial
let currentX = 0; // Variable para almacenar la posición actual
const threshold = 100; // Umbral de desplazamiento para cambiar de Pokémon
// Agregar eventos para desplazamiento en dispositivos móviles
infoPokemon.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX; // Guardar la posición X del primer toque
    currentX = 0; // Reiniciar la posición actual
    cardPokemon.style.transition = 'none'; // Desactivar la trans
});

infoPokemon.addEventListener('touchmove', (event) => {
    const moveX = event.touches[0].clientX; // Posición X actual
    currentX = moveX - startX; // Calcular desplazamiento

    const rotateDegree = (currentX / window.innerWidth) * 20; // Ajusta el grado de rotación
    cardPokemon.style.transform = `translateX(${currentX}px)`;

    // Evitar que el evento se propague y cause otros comportamientos
    event.preventDefault();
});

// Resetea la bandera al finalizar el toque
infoPokemon.addEventListener('touchend', () => {
    // Verifica si se movió lo suficiente para cambiar de Pokémon
     if (Math.abs(currentX) < threshold) {
        // Regresar a la posición original si no se movió lo suficiente
        cardPokemon.style.transition = 'transform 0.3s ease'; // Añadir transición
        cardPokemon.style.transform = 'translateX(0) rotate(0deg)'; // Regresar a la posición original
    } else {
        // Si se desplazó lo suficiente, mover fuera de la pantalla
        cardPokemon.style.transition = 'transform 0.3s ease'; // Añadir transición
        cardPokemon.style.transform = `translateX(${currentX > 0 ? '100%' : '-100%'}) rotate(${currentX > 0 ? '15deg' : '-15deg'})`; // Mover fuera de la pantalla`; // Mover fuera de la pantalla

        // Cambiar Pokémon después de un pequeño retraso para permitir la transición
        setTimeout(() => {
            if (currentX > 0) {
                previousPokemon(); // Navegar al Pokémon anterior
            } else {
                nextPokemon(); // Navegar al siguiente Pokémon
            }
            // Restablecer la tarjeta a la posición original
            cardPokemon.style.transition = 'none'; // Desactivar transición
            cardPokemon.style.transform = 'translateX(0) rotate(0deg)'; // Regresar a la posición original
        }, 300); // Espera que la transición termine
    }

    // Restablecer la bandera de movimiento
    isMoving = false; // Permitir nuevos movimientos
    
});

// Llama a la función al cargar la página
fetchPokemonData(currentPokemonId);

const renderPokemonData = data => {
    const sprite = data.sprites.other["official-artwork"].front_default;
    const {stats, types, abilities} = data;  
    pokeName.textContent = data.name;
    pokeImage.setAttribute('src', sprite);
    pokeId.textContent = `N° # ${data.id}`;
    statsPokemonBase.textContent = "Experiencia Base: " + data.base_experience;
    currentPokemonId = data.id; // Actualiza el ID actual
    setCardColor(types);
    renderPokemonTypes(types);
    renderPokemonStats(stats, types);
    renderPokemonAbility(abilities);
    setCardColorBars(types);
    const primaryType = types[0].type.name; // Cambiado
    const colorOne = typeColors[primaryType]; // Asegúrate de que esto esté correcto
};

const setCardColor = types => {
    const colorOne = typeColors[types[0].type.name];
    const colorTwo = types[1] ? typeColors[types[1].type.name] : typeColors.default;
    pokemonName.style.background = colorOne;
    /* pokeImage.style.background =  `radial-gradient(${colorTwo} 33%, ${colorOne} 33%)`;
    pokeImage.style.backgroundSize = ' 5px 5px'; */
    pokeFooterColor.style.background = colorTwo;
    pokeTopColor.style.background = colorOne;
    statsPokemonBase.style.color = colorOne;
    pokeImageContainer.style.cssText = `background: linear-gradient(to bottom, ${colorOne} 0%, ${colorOne} 50%, white 50%, white 100%);`;
    const iconColor = colorOne; // Puedes usar un color diferente si prefieres
    document.querySelectorAll('.pokemon-next i').forEach(icon => {
        icon.style.color = iconColor;
    });
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
        const abilityTextElement = document.createElement("div");
        abilityTextElement.textContent = abilities.ability.name; 
        abilityTextElement.style.cssText =''; 
        pokeAbility.appendChild(abilityTextElement);
        const urlPokemon = abilities.ability.url;
        fetch(urlPokemon)
            .then(response => response.json())
            .then(data => mostrarData(data))

        const mostrarData = (data) => {
            abilityTextElement.textContent = data.names[5].name;   
        }
    });
};

const renderPokemonStats = (stats, types) => {
    pokeStats.innerHTML = '';     // Aquí obtenemos el color del primer tipo del Pokémon
    const primaryType = types[0].type.name; // Cambia esto para obtener el tipo correcto
    const colorOne = typeColors[primaryType];
    stats.forEach(stat => {
        const statElement = document.createElement("div");
        const statElementName = document.createElement("div");
        const statElementPoints = document.createElement("div");
        const statElementAmount = document.createElement("div");
        const statElementBar = document.createElement("div");
        const pxWidth = stat.base_stat * 100 / 200;
        statElementName.style.cssText = 'width: 70%;';
        statElementAmount.style.cssText = 'width: 10%; justify-content: right;';
        statElementBar.style.cssText = `width: ${pxWidth}%; height : 15px ; justify-self: left; margin-right: 5px; margin-top: 5px; background: ${colorOne}; border-radius: 10px; transition: all .3s;` ;
        statElementName.setAttribute("id", "poke-stats-name") ;
        statElementBar.setAttribute("id", "poke-stats-points");
        statElementAmount.setAttribute("id", "poke-stats-amount");
        statElementName.textContent = stat.stat.name;
        statElementName.textContent = spanishStats[stat.stat.name];
        statElementAmount.textContent = stat.base_stat;
        statElementPoints.appendChild(statElementBar);
        statElement.appendChild(statElementName);
        statElement.appendChild(statElementPoints);
        statElement.appendChild(statElementAmount);
        pokeStats.appendChild(statElement); 

    })
};

const setCardColorBars = types => {
    const colorOneOne = typeColors[types[0].type.name];
    return colorOneOne
};


const renderNotFound = () => {
    pokeName.textContent = 'No encontrado';
    pokemonName.style.background = '';
    pokeImage.setAttribute('src', 'https://pixelartmaker-data-78746291193.nyc3.digitaloceanspaces.com/image/e7cb1a05e60dd2e.png');
    pokeImage.style.background =  '';
    pokeFooterColor.style.background =  '';
    pokeTopColor.style.background =  '';
    pokeImageContainer.style.background = '';   
    pokeType.innerHTML = '';
    pokeStats.innerHTML = '';
    pokeId.textContent = '';
    pokeAbility.textContent = '';
    statsPokemonBase.textContent = '';
};


