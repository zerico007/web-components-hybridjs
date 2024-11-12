import { debounce } from "../utils.js";
import { searchPeople } from "../api.js";

class SearchComponent extends HTMLElement {
  searchTerm = "";
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const script = document.createElement("script");
    script.src = "./vanillajs/PeopleContainer.js";
    script.type = "module";
    this.shadowRoot.appendChild(script);

    const paginationScript = document.createElement("script");
    paginationScript.src = "./vanillajs/Pagination.js";
    paginationScript.type = "module";
    this.shadowRoot.appendChild(paginationScript);

    const style = document.createElement("style");
    style.textContent = `
        input {
            border-radius: 0.5rem;
            padding: 0.5rem 1rem;
            bakground: #e7f3f3;
            border: 2px solid #c90076;
            color: #414B5A;
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
        `;
    this.shadowRoot.appendChild(style);
  }

  async getPeople(page = 1) {
    const paginationContainer = this.shadowRoot.querySelector(
      "pagination-container"
    );
    const peopleContainer = this.shadowRoot.querySelector("people-container");

    const loadingText = document.createElement("p");
    loadingText.className = "loading";
    loadingText.innerHTML = "Loading...";

    this.shadowRoot.insertBefore(loadingText, peopleContainer);
    const peopleResponse = await searchPeople(this.searchTerm, page);
    this.people = peopleResponse.results;

    //pass 'props' to pagination-container
    paginationContainer.setAttribute("count", peopleResponse.count);
    paginationContainer.setAttribute("next", peopleResponse.next || "");
    paginationContainer.setAttribute("previous", peopleResponse.previous || "");

    this.shadowRoot.removeChild(loadingText);
    peopleContainer.setAttribute("people", JSON.stringify(this.people));
  }

  render() {
    const container = document.createElement("form");
    container.className = "search-wrapper";
    container.addEventListener("submit", (event) => {
      event.preventDefault();
      this.updateSearchTerm();
    });
    // create pagination container
    const paginationContainer = document.createElement("pagination-container");
    //create people-container element
    const peopleContainer = document.createElement("people-container");

    //create input element
    const input = document.createElement("input");
    input.placeholder = "Search for a person...";
    input.type = "text";
    const debouncedUpdateSearchTerm = debounce(this.getPeople.bind(this), 500);
    input.addEventListener("input", (event) => {
      this.searchTerm = event.target.value;
      debouncedUpdateSearchTerm();
    });
    //create button element
    const button = document.createElement("button");
    button.textContent = "Search";
    button.addEventListener("click", () => {
      this.updateSearchTerm();
    });
    //append input and button to container
    container.appendChild(input);
    container.appendChild(button);
    //append container and peopleContainer to shadowRoot
    this.shadowRoot.appendChild(container);
    this.shadowRoot.appendChild(paginationContainer);
    this.shadowRoot.appendChild(peopleContainer);
  }

  connectedCallback() {
    this.render();
    this.getPeople();
    //bind getPeople to window object so it is accessible from pagination-container
    window.getPeople = this.getPeople.bind(this);
    const paginationContainer = this.shadowRoot.querySelector(
      "pagination-container"
    );
    //set ongetpeople attribute or 'prop' to getPeople
    paginationContainer.setAttribute("ongetpeople", "getPeople");
  }
}

customElements.define("search-component", SearchComponent);
