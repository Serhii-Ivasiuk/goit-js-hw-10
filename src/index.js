import './css/styles.css';
import _debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetch-countries';

const DEBOUNCE_DELAY = 300;
const notificationType = {
  INFO: 'info',
  FAILURE: 'failure',
};

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', _debounce(handleInput, DEBOUNCE_DELAY));

function handleInput(e) {
  const searchQuery = e.target.value.trim();

  if (searchQuery === '') {
    clearMarkup();
    return;
  }

  fetchCountries(searchQuery)
    .then(data => {
      clearMarkup();
      renderMarkup(data);
    })
    .catch(() => {
      clearMarkup();
      showNotification(
        notificationType.FAILURE,
        'Oops, there is no country with that name'
      );
    });
}

function renderMarkup(countries) {
  if (countries.length > 10) {
    showNotification(
      notificationType.INFO,
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }

  if (countries.length > 1 && countries.length <= 10) {
    renderCountriesList(countries);
    return;
  }

  renderCountryCard(countries);
}

function renderCountriesList(countriesArray) {
  countriesArray.map(({ flags, name }) => {
    refs.list.insertAdjacentHTML(
      'beforeend',
      `
        <li class="country-list__item">
          <img width="30"
            class="country-list__image"
            src="${flags.svg}"
            alt="${name.official} flag"
          >
          <p class="country-list__name">${name.official}</p>
        </li>
      `
    );
  });
}

function renderCountryCard(countriesArray) {
  countriesArray.map(({ flags, name, capital, population, languages }) => {
    refs.info.insertAdjacentHTML(
      'beforeend',
      `
        <div class="country-info__title">
          <img width="40"
            class="country-info__image"
            src="${flags.svg}"
            alt="${name.official} flag"
          >
          <p class="country-info__name">${name.official}</p>
        </div>
        <ul class="country-info__list">
          <li class="country-info__list-item">
            <p class="country-info__property">
              Capital:
              <span class="country-info__value">${capital}</span>
            </p>
          </li>
          <li class="country-info__list-item">
            <p class="country-info__property">
              Population:
              <span class="country-info__value">${population}</span>
            </p>
          </li>
          <li class="country-info__list-item">
            <p class="country-info__property">
              Languages:
              <span class="country-info__value">
                ${Object.values(languages).join(', ')}
              </span>
            </p>
          </li>
        </ul>
      `
    );
  });
}

function clearMarkup() {
  refs.list.innerHTML = '';
  refs.info.innerHTML = '';
}

function showNotification(type, message) {
  return Notiflix.Notify[type](message);
}
