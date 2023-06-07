const global = {
  currentPage: window.location.pathname,
  search: {
    type: '',
    term: '',
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  api: {
    apiKey: '5ab48101b4d378189714a3678341d251',
    apiUrl: 'https://api.themoviedb.org/3/',
  },
};

// Load router
document.addEventListener('DOMContentLoaded', init);

// Init App
function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      displaySlider();
      displayPopularMovies();
      break;
    case '/shows.html':
      displayPopularShows();
      break;
    case '/movie-details.html':
      displayMovieDetails();
      break;
    case '/tv-details.html':
      displayShowDetails();
      break;
    case '/search.html':
      search();
      break;
  }
  highlightActiveLink();
}

// Highlight links
function highlightActiveLink() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    if (link.getAttribute('href') === global.currentPage) {
      if (!link.classList.contains('active')) {
        link.classList.add('active');
      }
    }
  });
}

// Show error message
function displayAlert(errorMsg) {
  const alertDiv = document.getElementById('alert');
  if (!alertDiv.firstElementChild) {
    errDivEl = document.createElement('div');
    errDivEl.className = 'alert';
    errDivEl.textContent = errorMsg;
    alertDiv.appendChild(errDivEl);
  }
}

// Add commas to numbers
function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Display 20 most popular movies
async function displayPopularMovies() {
  const { results } = await fetchAPIData('movie/popular');
  results.forEach((movie) => {
    const divEl = document.createElement('div');
    divEl.className = 'card';
    divEl.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
      ${
        movie.poster_path
          ? `<img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.original_title}" />`
          : `<img src="./images/no-image.jpg" alt="${movie.original_title}" />`
      } 
      </a>
      <div class="card-body">
        <h4 class="card-title">${movie.original_title}</h4>
        <p class="card-text">Release :
        ${movie.release_date}</p>
      </div>
    `;
    document.querySelector('#popular-movies').appendChild(divEl);
  });
}

// Display 20 most popular tv shows
async function displayPopularShows() {
  const { results } = await fetchAPIData('tv/popular');
  results.forEach((show) => {
    const divEl = document.createElement('div');
    divEl.className = 'card';
    divEl.innerHTML = `
      <a href="tv-details.html?id=${show.id}">
        ${
          show.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w500/${show.poster_path}" alt="${show.original_name}" />`
            : `<img src="./images/no-image.jpg" alt="${show.original_title}" />`
        }
      </a>
      <div class="card-body">
        <h4 class="card-title">${show.original_name}</h4>
        <p class="card-text">Release : ${show.first_air_date}</p>
      </div>
    `;
    document.querySelector('#popular-shows').appendChild(divEl);
  });
}

// Display tv-shows details
async function displayShowDetails() {
  const showId = window.location.search.split('=')[1];
  const show = await fetchAPIData(`tv/${showId}`);
  // Overlay for background image
  displayBackgroundImage('show', show.backdrop_path);

  const showDivEl = document.createElement('div');
  showDivEl.innerHTML = `
        <div class="details-top">
          <div>
              ${
                show.poster_path
                  ? `<img src="https://image.tmdb.org/t/p/w500/${show.poster_path}" alt="${show.original_name}" />`
                  : `<img src="./images/no-image.jpg" alt="${show.original_name}" />`
              }
          </div>
          <div>
            <h2>${show.original_name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Last Air Date: ${show.last_air_date}</p>
            <p>
              ${show.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href=${show.homepage} target="_blank" class="btn">Visit Show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>SHOW INFO</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${show.number_of_episodes}</li>
            <li><span class="text-secondary">Last Episode To Air:</span> ${show.last_episode_to_air.name}</li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
          </ul>
          <h4 class="text-secondary">Production Companies</h4>
          <div class="list-group">${show.production_companies.map((company) => company.name).join(', ')}</div>
        </div>
  `;
  document.getElementById('show-details').appendChild(showDivEl);
}

// Display movie details
async function displayMovieDetails() {
  const movieId = window.location.search.split('=')[1];
  const movie = await fetchAPIData(`movie/${movieId}`);
  // Overlay for background image
  displayBackgroundImage('movie', movie.backdrop_path);

  const movieDivEl = document.createElement('div');
  movieDivEl.innerHTML = `
    <div class="details-top">
      <div>
            ${
              movie.poster_path
                ? `<img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.original_title}" />`
                : `<img src="./images/no-image.jpg" alt="${movie.original_title}" />`
            }
      </div>
      <div>
        <h2>${movie.original_title}</h2>
        <p>
          <i class="fas fa-star text-primary"></i>
          ${movie.vote_average.toFixed(1)} / 10
        </p>
        <p class="text-muted">Release Date : ${movie.release_date}</p>
        <p>${movie.overview}</p>
        <h5>Genres</h5>
        <ul class="list-group">
          ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
        </ul>
        <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
      </div>
    </div>
    <div class="details-bottom">
      <h2>MOVIE INFO</h2>
      <ul>
        <li><span class="text-secondary">Budget:</span> ${addCommasToNumber(movie.budget)}</li>
        <li><span class="text-secondary">Revenue:</span> ${addCommasToNumber(movie.revenue)}</li>
        <li><span class="text-secondary">Runtime:</span> ${movie.runtime}</li>
        <li><span class="text-secondary">Status:</span> ${movie.release_date}</li>
      </ul>
      <h4 class="text-secondary">Production Companies</h4>
      <div class="list-group">${movie.production_companies
        .map((company) => `<span>${company.name}</span>`)
        .join(', ')}</div>
    </div>
  `;
  document.getElementById('movie-details').appendChild(movieDivEl);
}

// Display backdrop on Details pages
function displayBackgroundImage(type, backgroundPath) {
  const overlayDivEl = document.createElement('div');
  overlayDivEl.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDivEl.style.backgroundSize = 'cover';
  overlayDivEl.style.backgroundPosition = 'center';
  overlayDivEl.style.backgroundRepeat = 'no-repeat';
  overlayDivEl.style.height = '100vh';
  overlayDivEl.style.width = '100vw';
  overlayDivEl.style.position = 'absolute';
  overlayDivEl.style.top = '0';
  overlayDivEl.style.left = '0';
  overlayDivEl.style.zIndex = '-1';
  overlayDivEl.style.opacity = '0.1';
  if (type === 'movie') {
    document.getElementById('movie-details').appendChild(overlayDivEl);
  } else {
    document.getElementById('show-details').appendChild(overlayDivEl);
  }
}

// Search movies/shows
async function search() {
  const searchTerm = window.location.search;
  const urlParams = new URLSearchParams(searchTerm);
  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');

  if (global.search.term !== '' && global.search.term !== null) {
    const { results, total_pages, page, total_results } = await searchAPIData();
    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;
    console.log(results);

    if (results.length === 0) {
      displayAlert('Movie not found');
    } else {
      displaySearchResults(results);
    }
  } else {
    displayAlert('Please enter a search term');
  }
}

function clearPreviousSearchResults(divIdArray) {
  divIdArray.forEach((divId) => {
    let targetDiv = document.getElementById(divId);
    while (targetDiv.firstChild) {
      targetDiv.firstChild.remove();
    }
  });
}

function displaySearchResults(results) {
  // Clear previous results
  clearPreviousSearchResults(['search-results', 'search-results-heading', 'pagination']);

  results.forEach((result) => {
    const divEl = document.createElement('div');
    divEl.className = 'card';
    divEl.innerHTML = `
          <a href="${global.search.type}-details.html?id=${result.id}">
        ${
          result.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w500/${result.poster_path}" alt="${
                global.search.type === 'movie' ? result.original_title : result.name
              }" />`
            : `<img src="./images/no-image.jpg" alt="${
                global.search.type === 'movie' ? result.original_title : result.name
              }"" />`
        } 
          </a>
          <div class="card-body">
            <h5 class="card-title">${global.search.type === 'movie' ? result.original_title : result.name}</h5>
            <p class="card-text">
              <small class="text-muted">Release : ${
                global.search.type === 'movie' ? result.release_date : result.first_air_date
              }</small>
            </p>
          </div>
        `;
    document.getElementById('search-results').appendChild(divEl);
  });
  document.getElementById('search-results-heading').innerHTML = `
  <h2>${results.length} of ${global.search.totalResults} results for ${global.search.term} </h2>
  `;
  displayPagination();
}

function displayPagination() {
  console.log('total pages ', global.search.totalPages);
  if (global.search.totalPages !== 1) {
    const paginationDivEl = document.createElement('div');
    paginationDivEl.className = 'pagination';
    paginationDivEl.innerHTML = `
      <div class="pagination">
        <button class="btn" id="prev">
          Prev
        </button>
        <button class="btn" id="next">
          Next
        </button>
        <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
      </div>
    `;
    document.getElementById('pagination').appendChild(paginationDivEl);
    // Disable prev button for first page
    if (global.search.page === 1) {
      document.getElementById('prev').disabled = true;
    }
    // Disable next button for first page
    if (global.search.page === global.search.totalPages) {
      document.getElementById('next').disabled = true;
    }
    // Previous page
    document.getElementById('prev').addEventListener('click', async () => {
      --global.search.page;
      const { results } = await searchAPIData();
      displaySearchResults(results);
    });
    // Next page
    document.getElementById('next').addEventListener('click', async () => {
      ++global.search.page;
      const { results } = await searchAPIData();
      displaySearchResults(results);
    });
  }
}

// Fetch search item from tmdb api
async function searchAPIData() {
  const response = await fetch(
    `${global.api.apiUrl}search/${global.search.type}?api_key=${global.api.apiKey}&language=en-US&query=${global.search.term}&page=${global.search.page}`
  );
  const responseData = await response.json();
  return responseData;
}

// Display Movie Slider
async function displaySlider() {
  const { results } = await fetchAPIData('movie/now_playing');
  results.forEach((movie) => {
    const sliderDivEl = document.createElement('div');
    sliderDivEl.className = 'swiper-slide';
    sliderDivEl.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
      ${
        movie.poster_path
          ? `<img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.original_title}" />`
          : `<img src="./images/no-image.jpg" alt="${movie.original_title}" />`
      }   
      </a>
      <h4 class="swiper-rating"><i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)} / 10</h4>
    `;
    document.querySelector('.swiper-wrapper').appendChild(sliderDivEl);
  });
  const navigationDivEl = document.createElement('div');
  navigationDivEl.innerHTML = `
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  `;
  document.querySelector('.swiper').appendChild(navigationDivEl);
  initSwiper();
}

function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    breakpoints: {
      501: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
}

// Fetch data from TMDB api
async function fetchAPIData(endpoint) {
  const API_URL = 'https://api.themoviedb.org/3/';

  showSpinner();
  const response = await fetch(`${global.api.apiUrl}${endpoint}?api_key=${global.api.apiKey}&language=en-US`);
  const responseData = await response.json();
  hideSpinner();
  return responseData;
}

function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}

function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}
