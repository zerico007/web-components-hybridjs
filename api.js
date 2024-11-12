const swapiAPIBase = "https://swapi.dev/api/";

async function getPerson(id) {
  const response = await fetch(`${swapiAPIBase}people/${id}/`);
  const person = await response.json();

  return person;
}

async function searchPeople(searchTerm = "", page = 1) {
  const response = await fetch(
    `${swapiAPIBase}people/?search=${searchTerm}&page=${page}`
  );
  const people = await response.json();

  return people;
}

async function getPeople() {
  const response = await fetch(`${swapiAPIBase}people/`);
  const people = await response.json();

  return people;
}

export { getPerson, searchPeople, getPeople };
