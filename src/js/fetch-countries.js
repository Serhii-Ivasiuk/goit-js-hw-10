export { fetchCountries };

const BASE_URL = 'https://restcountries.com/v3.1/name/';
const searchFilters = new URLSearchParams({
  fields: 'name,capital,population,flags,languages',
});

function fetchCountries(name) {
  return fetch(`${BASE_URL}${name}?${searchFilters}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
