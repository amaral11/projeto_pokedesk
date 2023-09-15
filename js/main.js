const fade = () => {
  const wrapper = document.querySelector('.wrapper');
  wrapper.classList.add('fade');
};

window.addEventListener('load', fade);

const pokedex = document.getElementById('pokedex')
const inputSearch = document.querySelector(".search")

const fetchPokemon = () => {
  const promises = []
  for (let i = 1; i <= 151; i++) {
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`
    promises.push(fetch(url).then((res) => res.json()))
  }
  Promise.all(promises).then((results) => {
    const pokemons = results.map((result) => ({
      name: result.name,
      image: result.sprites.other.home['front_default'],
      image_Front: result.sprites['front_default'],
      type: result.types.map((type) => type.type.name),
      id: result.id,
    }));
    displayCard(pokemons)
    searchPokemon(pokemons)
  });
};

const searchPokemon = (pokemons) => {
  inputSearch.addEventListener('input', function (e) {
    const searchPokemon = pokemons.filter(pokemon => (pokemon.name.includes(inputSearch.value.toLowerCase())))
    displayCard(searchPokemon)
  })
}

const displayCard = (pokemons) => {
  const pokemonCard = pokemons
    .map(
      (pokemon) => `
            <li class="card">
                <div class="card__image ${pokemon.type[0]}">
                    <img src="${pokemon.image_Front}" class="cover-image" alt="Pokemon ${pokemon.name}">
                </div>
                <img src="${pokemon.image}" class="character" alt="Pokemon ${pokemon.name}">
                <div class="card__details">
                    <h3>${pokemon.id}. ${pokemon.name}</h3>
                    <p>${pokemon.type.join(' | ')}</p>
                    <button class="${pokemon.type[0]}" onclick="OpenAside(${pokemon.id})">View +</button>
                </div>
            </li>
        `
    )
    .join('');
  pokedex.innerHTML = pokemonCard;
};

fetchPokemon();

/***  ASIDE  *************************************************/
const btCloseAside = document.querySelector('.aside__menu i');
const aside = document.querySelector('aside');
const header = document.querySelector('header');
const section = document.querySelector('section');

const fetchSelectPokemon = (id) => {
  const promises = []

  const url = `https://pokeapi.co/api/v2/pokemon/${id}`
  promises.push(fetch(url).then((res) => res.json()))

  Promise.all(promises).then((results) => {
    const pokemon = results.map((result) => ({
      name: result.name,
      image: result.sprites.other.home['front_default'],
      type: result.types.map((type) => type.type.name),
      id: result.id,
      height: result.height / 10,
      weight: result.weight,
      base_Stat: result.stats.map((base_Stat) => [base_Stat.base_stat, base_Stat.stat.name]),
      ability: result.abilities.map((ability) => [ability.ability.name]),
      image_Front: result.sprites['front_default'],
      image_Back: result.sprites['back_default']
    }));
    displayAside(pokemon)
  });
};

const displayAside = (pokemon) => {
  console.log(pokemon)
  const pokemonSelectHTMLString = pokemon
    .map(
      (pokemon) => `
        <div class="aside__menu" onclick="CloseAside()">
            <i class="fa-solid fa-chevron-right close-btn"></i>
        </div>
        <div class="aside__image ${pokemon.type[0]}">
            <img class="image__Icon" src="../img/icons/${pokemon.type[0]}.svg" alt="Icone tipo do Pokemons">
            <img class="image__Pokemon" src="${pokemon.image}" alt="Pokemon ${pokemon.name}">
        </div>
        <div class="aside__details ${pokemon.type[0]}">
            <div class="details__header">
                <div class="header__types">
                    ${pokemon.type
          .map(type => `<div class="type ${type}">${type}</div>`)
          .join('')}    
                </div>
                <div class="header__idName">
                    <span>#${pokemon.id.toString().padStart(3, '0')}</span>
                    <h3>${pokemon.name}</h3>
                </div>
            </div>

            <div class="details__tabs">
                <input type="radio" name="indicator" id="about" checked="checked">
                <label for="about" class="about">
                    <span class="topic">ABOUT</span>
                </label>

                <input type="radio" name="indicator" id="stats">
                <label for="stats" class="stats">
                    <span class="topic">STATS</span>
                </label>

                <div class="details__tab">
                    <div class="tab details__about">
                        <div class="content__feature">
                            <div class="feature__height">
                                <h5 ${pokemon.type[0]}><i class="fa-solid fa-ruler-vertical"></i> ${pokemon.height} m</h5>
                                <span>Height</span>
                            </div>
                            <div class="feature__weight">
                                <h5 ${pokemon.type[0]}><i class="fa-solid fa-weight-hanging"></i> ${pokemon.weight} Kg</h5>
                                <span>Weight</span>
                            </div>
                        </div>
                        <div class="content__image">
                            <img src="${pokemon.image_Front}" alt="Pokemon Front">
                            <img src="${pokemon.image_Back}" alt="Pokemon Back">
                        </div>                        
                    </div>

                    <div class="tab details__stats">
                        <div class="content__charts">
                            ${pokemon.base_Stat.map((baseStat) => `
                                <div class="single-chart">
                                    <svg viewBox="0 0 36 36" class="circular-chart ${ColorCharts(baseStat[0])}">
                                      <path class="circle-bg" d="M18 2.0845
                                          a 15.9155 15.9155 0 0 1 0 31.831
                                          a 15.9155 15.9155 0 0 1 0 -31.831"
                                      />
                                      <path class="circle" stroke-dasharray="${baseStat[0]}, 100" d="M18 2.0845
                                          a 15.9155 15.9155 0 0 1 0 31.831
                                          a 15.9155 15.9155 0 0 1 0 -31.831"
                                      />
                                      <text x="18" y="15" class="chart__name">${baseStat[1]}</text>
                                      <text x="18" y="24" class="chart__value">${baseStat[0]}</text>
                                    </svg>
                                </div>
                              `)
          .join('')}
                        </div>
                    </div>
                </div>
                <div class="indicator"></div>
            </div>
        </div>
        `
    )
    .join('');
  aside.innerHTML = pokemonSelectHTMLString;
};


function OpenAside(id) {
  aside.classList.add('active');
  header.classList.add('active');
  section.classList.add('active');
  fetchSelectPokemon(id);
}

function CloseAside() {
  aside.classList.toggle('active');
  header.classList.toggle('active');
  section.classList.toggle('active');
}

function ColorCharts(value) {
  if (value > 50 && value < 100) {
    const color = 'green'
    return color
  }
  else if (value >= 100) {
    const color = 'orange'
    return color
  }
  else {
    const color = 'blue'
    return color
  }
}

window.onscroll = function () {
  toggleScrollToTopButton();
};

function toggleScrollToTopButton() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.querySelector(".scroll-to-top").style.display = "block";
  } else {
    document.querySelector(".scroll-to-top").style.display = "none";
  }
}

function scrollToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}