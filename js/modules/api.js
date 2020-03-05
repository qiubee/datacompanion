const cors = "https://cors-anywhere.herokuapp.com/";
const endpoint = "https://zoeken.oba.nl/api/v1/search/?q=";
const key = "d7519ea81ad4e06ab5e5dac46ddeb63a";
const secret = "274658a302d1cfe874e73aed9d6ccef5";
const detail = "Default";

const config = {
  Authorization: `Bearer ${secret}`
};
async function fetchData(url) {
  const res = await fetch(url);
  if (res.ok) {
      return await res.json();
  } else {
      console.error(res.statusText);
      return undefined;
  }
}

export async function getBooks(query) {
  const fullUrl = `${cors}${endpoint}${query}&authorization=${key}&detaillevel=${detail}&output=json`;
  return await fetchData(fullUrl, config);
}