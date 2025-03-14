const pokemonContainer = document.getElementById('pokemon-container');
const searchInput = document.getElementById('search');
const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=151';
let allPokemon = [];

const activeFilters = new Set();

async function fetchPokemonList() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const pokemonList = data.results;
    allPokemon = await Promise.all(pokemonList.map(async (pokemon) => {
      const res = await fetch(pokemon.url);
      return res.json();
    }));
    displayPokemon(allPokemon);
  } catch (error) {
    console.error('Error al obtener los Pokémon:', error);
  }
}

function displayPokemon(pokemonArray) {
  pokemonContainer.innerHTML = '';
  pokemonArray.forEach(pokemon => {
    const card = document.createElement('div');
    card.classList.add('pokemon-card');
    card.innerHTML = `
      <img class="pokemon-image" src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <div class="pokemon-details" style="display: none;">
        <h3>${capitalize(pokemon.name)}</h3>
        <p><strong>Altura:</strong> ${pokemon.height}</p>
        <p><strong>Peso:</strong> ${pokemon.weight}</p>
        <p><strong>Tipos:</strong> ${pokemon.types.map(t => capitalize(t.type.name)).join(', ')}</p>
        <p><strong>Habilidades:</strong> ${pokemon.abilities.map(a => capitalize(a.ability.name)).join(', ')}</p>
      </div>
    `;
    
    card.addEventListener('click', () => {
      const detailsDiv = card.querySelector('.pokemon-details');
      if (detailsDiv.style.display === 'none') {
        detailsDiv.style.display = 'block';
        card.style.transform = 'scale(1.1)';
      } else {
        detailsDiv.style.display = 'none';
        card.style.transform = 'scale(1)';
      }
    });
    
    pokemonContainer.appendChild(card);
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

searchInput.addEventListener('keyup', () => {
  clearFilterButtons();
  const searchTerm = searchInput.value.toLowerCase();
  const filteredPokemon = allPokemon.filter(pokemon => 
    pokemon.name.toLowerCase().includes(searchTerm)
  );
  displayPokemon(filteredPokemon);
});

const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const type = button.getAttribute('data-type');

    if (type === 'all') {
      activeFilters.clear();
      clearFilterButtons();
      button.classList.add('active');
      displayPokemon(allPokemon);
    } else {
      document.querySelector('button[data-type="all"]').classList.remove('active');
      button.classList.toggle('active');
      if (button.classList.contains('active')) {
        activeFilters.add(type);
      } else {
        activeFilters.delete(type);
      }
      filterPokemonByTypes();
    }
  });
});

function filterPokemonByTypes() {
  let filtered = allPokemon;
  if (activeFilters.size > 0) {
    filtered = filtered.filter(pokemon => {
      return [...activeFilters].every(filterType =>
        pokemon.types.some(t => t.type.name === filterType)
      );
    });
  }
  displayPokemon(filtered);
}

function clearFilterButtons() {
  filterButtons.forEach(button => {
    if (button.getAttribute('data-type') !== 'all') {
      button.classList.remove('active');
    }
  });
}

fetchPokemonList();
