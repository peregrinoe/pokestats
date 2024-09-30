// Selección de elementos del DOM
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

// Mapa de colores para los tipos de Pokémon
const typeColors = {
    electric: '#fab715', normal: '#aaa59c', fire: '#f14411', water: '#1063b7', ice: '#a0e6fe',
    rock: '#9d853c', flying: '#207394', grass: '#27cb50', psychic: '#df356a', ghost: '#474696',
    bug: '#cddc39', poison: '#482645', ground: '#d2b054', dragon: '#725ada', steel: '#8f8f9c',
    fighting: '#7f331c', fairy: '#e190e1', dark: '#3d2d22', default: '#a17366',
};

// Mapa de colores para grupos de huevos
const eggGroupColors = {
    monster: "#d25064", water1: "#97b5fd", bug: "#aac22a", flying: "#b29afa", ground: "#e0c068",
    fairy: "#ffc8f0", plant: "#82d25a", humanshape: "#d29682", water3: "#5876be", mineral: "#7a6252",
    indeterminate: "#8a8a8a", water2: "#729afa", ditto: "#282a36", dragon: "#7a42ff", "no-eggs": "#333333"
};

// Nombres de tipos en español
const spanishName = {
    electric: 'Electrico', normal: 'Normal', fire: 'Fuego', water: 'Agua', ice: 'Hielo',
    rock: 'Roca', flying: 'Volador', grass: 'Hierba', psychic: 'Psiquico', ghost: 'Fantasma',
    bug: 'Bicho', poison: 'Veneno', ground: 'Tierra', dragon: 'Dragon', steel: 'Acero',
    fighting: 'Pelea', fairy: 'Hada', dark: "Sinistro", default: 'N/A',
};

// Nombres de grupos de huevos en español
const eggGroupNamesSpanish = {
    monster: "Monstruo", water1: "Agua 1", bug: "Bicho",
    flying: "Volador", ground: "Tierra", fairy: "Hada", plant: "Planta", humanshape: "Forma Humanoide",
    water3: "Agua 3", mineral: "Mineral", indeterminate: "Indeterminado",
    water2: "Agua 2", ditto: "Ditto", dragon: "Dragón", "no-eggs": "Sin Huevos"
};

// Nombres de estadísticas en español
const spanishStats = {
    hp: 'Salud', attack: 'Ataque', defense: 'Defensa', 'special-attack': 'Ataque Especial',
    'special-defense': 'Defensa Especial', speed: 'Velocidad',
};

// Función para cargar todos los Pokémon
const loadAllPokemons = async () => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${pokemonsNumber}`);
    const data = await response.json();
    allPokemons = data.results.map(pokemon => pokemon.name);
};

loadAllPokemons(); // Llama a la función para cargar los Pokémon

// Evento de entrada en el campo de búsqueda
filter.addEventListener('input', () => {
    const lowerCaseValue = filter.value.toLowerCase(); // Convierte a minúsculas para comparación
    if (!lowerCaseValue) return hideSuggestions(); // Si no hay valor, oculta sugerencias
    // Filtra los Pokémon que coinciden con la búsqueda
    const matchedPokemons = allPokemons.filter(pokemon => pokemon.includes(lowerCaseValue)).slice(0, 5);
    showSuggestions(matchedPokemons);// Muestra las sugerencias encontradas
});

// Mostrar sugerencias
const showSuggestions = (suggestions) => {
    const suggestionBox = document.querySelector('.suggestion-box');
    suggestionBox.innerHTML = ''; // Limpia el contenido previo
    suggestionBox.style.display = suggestions.length ? 'block' : 'none'; // Muestra u oculta la caja de sugerencias

    suggestions.forEach(suggestion => {
        const suggestionItem = document.createElement('div'); // Crea un elemento para la sugerencia
        suggestionItem.textContent = suggestion; // Establece el texto de la sugerencia
        suggestionItem.onclick = () => {
            fetchPokemonData(suggestion); // Llama a la función para obtener datos del Pokémon
            hideSuggestions(); // Oculta las sugerencias
        };
        suggestionBox.appendChild(suggestionItem);  // Agrega la sugerencia a la caja
    });
};

// Oculta las sugerencias
const hideSuggestions = () => {
    const suggestionBox = document.querySelector('.suggestion-box');
    suggestionBox.innerHTML = ''; // Limpiar el contenido
    suggestionBox.style.display = 'none'; // Ocultar el contenedor
};

// Función de búsqueda de Pokémon
const searchPokemon = (event) => {
    event.preventDefault(); // Previene el comportamiento por defecto del formulario
    const lowerCaseValue = filter.value.toLowerCase(); // Convierte a minúsculas
    const idValue = parseInt(lowerCaseValue); // Intenta convertir el valor a un número
    // Comprueba si es un ID válido y busca el Pokémon
    if (!isNaN(idValue) && idValue > 0 && idValue <= pokemonsNumber) {
        fetchPokemonData(idValue);
    } else {
        // Filtra Pokémon por nombre
        const matchedPokemons = allPokemons.filter(pokemon => pokemon.includes(lowerCaseValue));
        matchedPokemons.length ? fetchPokemonData(matchedPokemons[0]) : renderNotFound();
    }
    
    hideSuggestions(); // Oculta sugerencias
};

// Evento para manejar la tecla "Enter"
filter.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') searchPokemon(event); // Llama a la función de búsqueda al presionar "Enter"
});

// Función para obtener datos del Pokémon
const fetchPokemonData = async (id) => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!response.ok) throw new Error('No encontrado'); // Lanza un error si no se encuentra

        const data = await response.json(); // Obtiene los datos del Pokémon
        currentPokemonId = data.id; // Actualiza el ID del Pokémon actual
        // Obtiene los datos de la especie
        const speciesResponse = await fetch(data.species.url); 
        if (!speciesResponse.ok) throw new Error('No encontrado especie'); 

        const speciesData = await speciesResponse.json(); // Obtiene los datos de la especie
        renderEggGroups(speciesData.egg_groups); // Renderiza los grupos de huevos
        renderPokemonData(data); // Renderiza los datos del Pokémon
        hideSuggestions();
    } catch (error) {
        renderNotFound(); // Muestra un mensaje de no encontrado si hay un error
    }
};

// Funciones para manejar la navegación
const nextPokemon = () => {
    if (currentPokemonId < pokemonsNumber) fetchPokemonData(currentPokemonId + 1); // Obtiene el siguiente Pokémon
};

const previousPokemon = () => {
    if (currentPokemonId > 1) fetchPokemonData(currentPokemonId - 1); // Obtiene el Pokémon anterior
};

// Asocia los botones a las funciones una sola vez
document.getElementById('next-btn').addEventListener('click', nextPokemon);
document.getElementById('prev-btn').addEventListener('click', previousPokemon);

// Variables para manejar el desplazamiento táctil
let isMoving = false;
let isScrolling = false;
let startX = 0, startY = 0, currentX = 0;
const threshold = 100; // Umbral para el desplazamiento

// Agregar eventos para desplazamiento en dispositivos móviles
infoPokemon.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX; // Guardar la posición X del primer toque
    startY = event.touches[0].clientY; // Guardar la posición Y
    currentX = 0; // Reiniciar la posición actual
    cardPokemon.style.transition = 'none'; // Desactivar la trans
    isScrolling = false; // Reinicia el estado
});

infoPokemon.addEventListener('touchmove', (event) => {
    const moveX = event.touches[0].clientX; // Posición X actual
    const moveY = event.touches[0].clientY;
    currentX = moveX - startX; // Calcular desplazamiento

    // Verifica si el desplazamiento en Y es mayor que en X
    if (Math.abs(moveY - startY) > Math.abs(currentX)) {
        isScrolling = true; // Marca que estamos desplazándonos verticalmente
    }

    if (!isScrolling) {
        cardPokemon.style.transform = `translateX(${currentX}px)`; // Aplica la transformación al card
        event.preventDefault(); // Previene el scroll de la página
    }
});

// Resetea la bandera al finalizar el toque
infoPokemon.addEventListener('touchend', () => {
    if (isScrolling) return; // No hace nada si estamos desplazándonos 
    // Verifica si se movió lo suficiente para cambiar de Pokémon
    cardPokemon.style.transition = 'transform 0.3s ease';
    if (Math.abs(currentX) < threshold) {
        cardPokemon.style.transform = 'translateX(0) rotate(0deg)';  // Vuelve a la posición original
    } else {
        currentX > 0 ? previousPokemon() : nextPokemon(); // Cambia al Pokémon anterior o siguiente
        cardPokemon.style.transform = `translateX(${currentX > 0 ? '100%' : '-100%'}) rotate(${currentX > 0 ? '15deg' : '-15deg'})`;
        // Resetea la transformación después de un breve tiempo
        setTimeout(() => {
            cardPokemon.style.transition = 'none';
            cardPokemon.style.transform = 'translateX(0) rotate(0deg)';
        }, 300);
    }
    
});

// Función para renderizar los datos del Pokémon
const renderPokemonData = (data) => {
    const sprite = data.sprites.other["official-artwork"].front_default; // Obtiene la imagen del Pokémon
    const { stats, types, abilities } = data; // Desestructura los datos necesarios
    pokeName.textContent = data.name; // Establece el nombre del Pokémon
    pokeImage.setAttribute('src', sprite); // Establece la imagen del Pokémon
    pokeId.textContent = `N° # ${data.id}`; // Establece el ID del Pokémon
    statsPokemonBase.textContent = "Experiencia Base: " + data.base_experience; // Establece la experiencia base
    setCardColor(types); // Establece el color de la tarjeta según el tipo
    renderPokemonTypes(types); // Renderiza los tipos del Pokémon
    renderPokemonStats(stats, types); // Renderiza las estadísticas del Pokémon
    renderPokemonAbility(abilities); // Renderiza las habilidades del Pokémon
    setCardColorBars(types); // Establece el color de las barras de estadísticas
};

const setCardColor = (types) => {
    const colorOne = typeColors[types[0].type.name]; // Color del primer tipo
    const colorTwo = types[1] ? typeColors[types[1].type.name] : typeColors.default; // Color del segundo tipo (si existe)
    // Establece los colores de varios elementos de la interfaz
    pokemonName.style.background = colorOne;
    pokeFooterColor.style.background = colorTwo;
    pokeTopColor.style.background = colorOne;
    statsPokemonBase.style.color = colorOne;
    pokeImageContainer.style.cssText = `background: linear-gradient(to bottom, ${colorOne} 0%, ${colorOne} 50%, white 50%, white 100%);`;

    document.querySelectorAll('.pokemon-next i').forEach(icon => {
        icon.style.color = colorOne; // Cambia el color de los íconos de navegación
    });
};

// Función para renderizar los tipos del Pokémon
const renderPokemonTypes = (types) => {
    pokeType.innerHTML = ''; // Limpia el contenido previo
    types.forEach(type => {
        const typeTextElement = document.createElement("div"); // Crea un elemento para cada tipo
        typeTextElement.style.background = typeColors[type.type.name]; // Establece el color del tipo
        typeTextElement.textContent = "Tipo " + spanishName[type.type.name]; // Establece el texto del tipo
        pokeType.appendChild(typeTextElement); // Agrega el tipo a la interfaz
    });
};

// Función para renderizar las habilidades del Pokémon
const renderPokemonAbility = async (abilities) => {
    pokeAbility.innerHTML = ''; // Limpia el contenido previo
    for (const ability of abilities) {
        const abilityTextElement = document.createElement("div"); // Crea un elemento para cada habilidad
        pokeAbility.appendChild(abilityTextElement); // Agrega el elemento de habilidad
        const abilityData = await fetch(ability.ability.url).then(response => response.json()); // Obtiene datos de la habilidad
        abilityTextElement.textContent = abilityData.names[5]?.name || ability.ability.name; // Establece el texto de la habilidad
    }
};

// Función para renderizar las estadísticas del Pokémon
const renderPokemonStats = (stats, types) => {
    pokeStats.innerHTML = ''; // Limpia el contenido previo
    const primaryType = types[0].type.name; // Obtiene el primer tipo
    const colorOne = typeColors[primaryType]; // Establece el color del tipo principal

    stats.forEach(stat => {
        const statElement = document.createElement("div"); // Crea un elemento para la estadística
        const statElementName = document.createElement("div");
        const statElementPoints = document.createElement("div");
        const statElementAmount = document.createElement("div");
        const statElementBar = document.createElement("div"); 
        const pxWidth = (stat.base_stat * 100 / 200); // Calcula el ancho de la barra
        statElementName.style.width = '70%';
        statElementAmount.style.width = '10%';
        statElementBar.style.cssText = `width: ${pxWidth}%; height: 15px; background: ${colorOne}; border-radius: 10px; transition: all .3s;`;
        statElementName.textContent = spanishStats[stat.stat.name]; // Establece el nombre de la estadística
        statElementAmount.textContent = stat.base_stat; // Establece el valor de la estadística
        statElement.append(statElementName, statElementPoints, statElementAmount); // Agrega los elementos al contenedor
        statElementPoints.appendChild(statElementBar); // Agrega la barra de progreso
        pokeStats.appendChild(statElement); // Agrega la estadística a la interfaz
    });
};

const setCardColorBars = types => {
    const colorOneOne = typeColors[types[0].type.name];
    return colorOneOne
};

// Función para renderizar los grupos de huevos
const renderEggGroups = eggGroups => {
    const eggGroupContainer = document.querySelector('[data-eggGroup]');
    eggGroupContainer.innerHTML = ''; // Limpiar contenido anterior
    eggGroups.forEach(group => {
        const groupElement = document.createElement("div"); 
        groupElement.textContent = eggGroupNamesSpanish[group.name] || group.name; 
        groupElement.style.backgroundColor = eggGroupColors[group.name] || '#ffffff'; // Fallback a blanco
        eggGroupContainer.appendChild(groupElement);
    });
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

// Llama a la función al cargar la página
fetchPokemonData(currentPokemonId);
