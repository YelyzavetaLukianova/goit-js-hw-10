const DEBOUNCE_DELAY = 500;

import './css/styles.css';
import Notiflix from 'notiflix';
import { debounce } from 'debounce';
import { fetchCountries } from './fetchCountries.js';

const inputRef = document.querySelector('#search-box');
const countryListRef = document.querySelector('.country-list');
const nameRef = document.querySelector('.name');
const capitalRef = document.querySelector('.capital');
const populationRef = document.querySelector('.population');
const languagesRef = document.querySelector('.languages');

const createCountriesMarkupCard = countries => {
  console.log(countries);
  const markup = countries
    .map(({ name, capital, population, languages, flags }) => {
      return `
<li>
      <div class="country-info">
      <img src="${flags.png}" alt="">
        <h1>${name.official}</h1>
        <div>${capital[0]}</div>
        <div>${population}</div>
        <div>${Object.values(languages).join(', ')}</div>
      </div>
    </li>`;
    })
    .join('');
  return markup;
};

const createCountriesMarkupList = countries => {
  console.log(countries);
  const markup = countries
    .map(({ name, flags }) => {
      return `
<li>
      <div class="country-info">
      <img src="${flags.png}" alt="">
        <h1>${name.official}</h1>        
      </div>
    </li>`;
    })
    .join('');
  return markup;
};

const handleError = (err, countries) => {
  Notiflix.Notify.failure(`Oops, there is no country with that name`);
};

const baseFunction = e => {
  e.preventDefault();
  const countryName = e.target.value;

  if (!countryName) {
    countryListRef.innerHTML = ' ';
    return;
  }

  fetchCountries(countryName)
    .then(data => {
      if (data.length > 1 && data.length < 10) {
        const markupList = createCountriesMarkupList(data);
        countryListRef.innerHTML = mark;
        return;
      }
      if (data.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        // return;
      }
      if (data.length === 1) {
        const markupCard = createCountriesMarkupCard(data);
        countryListRef.innerHTML = markupCard;
        return;
      }
    })
    .catch(err => handleError(err));
};

// inputRef.addEventListener('input', baseFunction);
inputRef.addEventListener('input', debounce(baseFunction, DEBOUNCE_DELAY));
