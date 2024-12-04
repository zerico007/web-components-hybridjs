import { define, html, store } from "https://esm.sh/hybrids@^9";
import "./PeopleContainer.hybrid.js";
import "./Pagination.hybrid.js";
import { pageStore, setPage } from "./stores/page.js";
import { peopleStore } from "./stores/people.js";

define({
  tag: "search-hybrid",
  searchTerm: "",
  people: (host) =>
    store.get(peopleStore, {
      search: host.searchTerm,
      page: store.get(pageStore).page,
    }),
  render: ({ searchTerm, people }) => html`
    <style>
      input {
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;
        bakground: #e7f3f3;
        border: 2px solid #c90076;
        color: #414b5a;
        width: 350px;
        height: 26px;
      }
      .search-wrapper {
        display: flex;
        justify-content: center;
        width: 70vw;
        margin: 0 auto;
        padding: 1rem;
        gap: 1rem;
      }
      button {
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;
        background: #c90076;
        color: #e7f3f3;
        border: none;
        cursor: pointer;
      }
      .loading {
        text-align: center;
        height: 100vh;
        font-size: 2rem;
      }
    </style>
    <form
      class="search-wrapper"
      onsubmit=${(_host, event) => {
        event.preventDefault();
        setPage(1);
      }}
    >
      <input
        type="text"
        placeholder="Search for a person..."
        oninput=${(host, event) => {
          host.searchTerm = event.target.value;
          setPage(1);
        }}
        value=${searchTerm}
      />
      <button type="submit">Search</button>
    </form>
    ${store.pending(people) && html`<p class="loading">Loading...</p>`}
    ${store.ready(people) &&
    html`<pagination-hybrid
        count=${people.count}
        next=${people.next}
        previous=${people.previous}
      ></pagination-hybrid>
      <people-hybrid people=${people.results}></people-hybrid>`}
  `,
});
