---
# You can also start simply with 'default'
theme: seriph
# some information about your slides (markdown enabled)
title: Break Free from Frameworks - Embracing Web Components and Hybrids
# apply unocss classes to the current slide
class: text-center
# https://sli.dev/features/drawing
drawings:
  persist: false
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
transition: slide-left
# enable MDC Syntax: https://sli.dev/features/mdc
mdc: true
---

# Break Free from Frameworks - Embracing Web Components and Hybrids

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Let's explore <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/zerico007/web-components-hybridjs" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
The landscape of web development is teeming with JavaScript and CSS frameworks, as well as their meta-framework counterparts. This dominance is understandable—these tools have revolutionized the way we build intricate and responsive web applications. However, this convenience comes at a cost. Developers are increasingly becoming framework specialists rather than mastering the underlying technologies. We now see “Remix devs” or “Next.js devs” whose core JavaScript skills are underdeveloped, and “Tailwind devs” who struggle with basic CSS syntax. Our reliance on syntactic sugar has made development easier but has left us with cavities in our foundational skills.
-->

---
transition: fade
---

# What are Web Components?

Web Components are a suite of web APIs that allow you to create new custom, reusable, encapsulated HTML tags to use in web pages and web apps.

- **Custom Elements**: Define your own custom HTML elements.
- **Shadow DOM**: Encapsulate your styles and markup.
- **HTML Templates**: Define fragments of markup that can be cloned and inserted in the document.
- **HTML Imports**: Import and reuse HTML documents.

<br>
<br>

<!--
Fortunately, there’s a way to break this cycle. Enter the Web Components suite of APIs! Modern browser APIs have advanced to the point where we can build complex, isolated, and reusable components without the overhead of a heavy framework.
-->

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
This presentation will only feature Custom elements and the shadow DOM
-->

---
transition: slide-up
level: 2
---

# How do we define custom elements?

```js {all|2-3|4-5|7-9|10-12|13-15|16-18|19-21}{lines:true,startLine:1}
class MyElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = ``;
  }
  connectedCallback() {
    console.log("Element added to the DOM");
  }
  disconnectedCallback() {
    console.log("Element removed from the DOM");
  }
  static get observedAttributes() {
    return ["name"];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} changed from ${oldValue} to ${newValue}`);
  }
  adoptedCallback() {
    console.log("Element moved to a new document");
  }
}
```

<!--
adoptedCallback is triggered when your custom element is used in an iframe
-->

---

# Person.js

```js {all|2|3-4|5|7-22|23|26-44|45-47|49-50|53-55|58}{lines:true,startLine:1,maxHeight:'500px'}
class PersonElement extends HTMLElement {
  person = null;
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = `
      .person {
          border: 2px solid #c90076;
          padding: 1rem;
          margin: 1rem;
          border-radius: 0.5rem;
          display: flex;
          flex-direction: column;
          min-width: 200px;
          background: #eeeeee;
      }
      .person h2 {
          margin: 0;
      }
    `;
    this.shadowRoot.appendChild(style);
  }

  render() {
    if (!this.person) {
      return;
    }

    const container = document.createElement("div");
    container.className = "person";
    container.innerHTML = `
      <h2>${this.person.name}</h2>
      <p>Height: ${this.person.height}</p>
      <p>Mass: ${this.person.mass}</p>
      <p>Hair Color: ${this.person.hair_color}</p>
      <p>Skin: ${this.person.skin_color}</p>
      <p>Eye Color: ${this.person.eye_color}</p>
      <p>Birth Year: ${this.person.birth_year}</p>
    `;

    this.shadowRoot.appendChild(container);
  }
  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(_name, _oldValue, newValue) {
    this.person = JSON.parse(newValue);
  }

  static get observedAttributes() {
    return ["person"];
  }
}

customElements.define("person-element", PersonElement);
```

---

# PeopleContainer.js

```js {all|2|7-10|13-46|48-51|54-62|64-66|68-71|73-75|78}{lines:true,startLine:1,maxHeight:'500px'}
class PeopleContainer extends HTMLElement {
  people = [];
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const personScript = document.createElement("script");
    personScript.src = "./vanillajs/Person.js";
    personScript.type = "module";
    this.shadowRoot.appendChild(personScript);

    const style = document.createElement("style");
    style.textContent = `
        .people-wrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        max-width: 1200px;
        margin: 0 auto;
        background: #e7edf3;
        border-radius: 0.5rem;
        }
        .loading {
            margin: 0 auto;
            height: 100vh;
            font-size: 2rem;
        }
        .pagination-wrapper {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin: 1rem;
        }
        .pagination {
            border-radius: 0.5rem;
            padding: 0.5rem 1rem;
            border: 2px solid #c90076;
            background: #e7edf3;
            color: #414b5a;
            cursor: pointer;
        }
        .pagination.current {
            background: #c90076;
            color: #e7edf3;
        }
        `;
    this.shadowRoot.appendChild(style);
    //create container for people
    const container = document.createElement("div");
    container.className = "people-wrapper";
    this.shadowRoot.appendChild(container);
  }

  renderPeople() {
    const container = this.shadowRoot.querySelector(".people-wrapper");
    container.innerHTML = "";
    this.people.forEach((person) => {
      const personElement = document.createElement("person-element");
      personElement.setAttribute("person", JSON.stringify(person));
      container.appendChild(personElement);
    });
  }

  connectedCallback() {
    this.renderPeople();
  }

  attributeChangedCallback(_name, _oldValue, newValue) {
    this.people = JSON.parse(newValue);
    this.renderPeople();
  }

  static get observedAttributes() {
    return ["people"];
  }
}

customElements.define("people-container", PeopleContainer);
```

<!--
Note that person-element is what we named the person custom element in the Person.js file.
-->

---

# Pagination.js

```js {all|2-6|35-38|42-45|46|47-56|57-68|69-78|81-96|99}{lines:true,startLine:1,maxHeight:'500px'}
class Pagination extends HTMLElement {
  count = 0;
  next = "";
  previous = "";
  page = 1;
  ongetpeople = () => {};

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = `
        .pagination-wrapper {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin: 1rem;
        }
        .pagination {
            border-radius: 0.5rem;
            padding: 0.5rem 1rem;
            border: 2px solid #c90076;
            background: #e7edf3;
            color: #414b5a;
            cursor: pointer;
        }
        .pagination.current {
            background: #c90076;
            color: #e7edf3;
        }
        `;
    this.shadowRoot.appendChild(style);

    //create container for pagination buttons
    const paginationContainer = document.createElement("div");
    paginationContainer.className = "pagination-wrapper";
    this.shadowRoot.appendChild(paginationContainer);
  }

  render() {
    const paginationWrapper = this.shadowRoot.querySelector(
      ".pagination-wrapper"
    );
    paginationWrapper.innerHTML = "";
    const totalPages = Math.ceil(this.count / 10);
    if (this.previous) {
      const previousButton = document.createElement("button");
      previousButton.textContent = "Previous";
      previousButton.className = "pagination";
      previousButton.addEventListener("click", () => {
        this.page--;
        this.ongetpeople(this.page);
      });
      paginationWrapper.appendChild(previousButton);
    }
    Array.from({ length: totalPages }).forEach((_, index) => {
      const pageButton = document.createElement("button");
      pageButton.textContent = index + 1;
      pageButton.className = `pagination ${
        this.page === index + 1 ? "current" : ""
      }`;
      pageButton.addEventListener("click", () => {
        this.page = index + 1;
        this.ongetpeople(this.page);
      });
      paginationWrapper.appendChild(pageButton);
    });
    if (this.next) {
      const nextButton = document.createElement("button");
      nextButton.textContent = "Next";
      nextButton.className = "pagination";
      nextButton.addEventListener("click", () => {
        this.page++;
        this.ongetpeople(this.page);
      });
      paginationWrapper.appendChild(nextButton);
    }
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ["count", "next", "previous", "ongetpeople"];
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    if (name === "ongetpeople") {
      this.ongetpeople = window[newValue];
    } else {
      this[name] = newValue;
    }
    this.render();
  }
}

customElements.define("pagination-container", Pagination);
```

<!--
Note that the page state is managed solely by the component
-->

---

# Search.js

```js {all|2|7-10|12-15|54-59|60-63|65-73|74-77|78-84|87-108|110-120|123}{lines:true,startLine:1,maxHeight:'500px'}
class SearchComponent extends HTMLElement {
  searchTerm = "";
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const peopleContainerScript = document.createElement("script");
    peopleContainerScript.src = "./vanillajs/PeopleContainer.js";
    peopleContainerScript.type = "module";
    this.shadowRoot.appendChild(peopleContainerScript);

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

  render() {
    const container = document.createElement("form");
    container.className = "search-wrapper";
    container.addEventListener("submit", (event) => {
      event.preventDefault();
      this.getPeople();
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
    button.type = "submit";
    //append input and button to container
    container.appendChild(input);
    container.appendChild(button);
    //append container and peopleContainer to shadowRoot
    this.shadowRoot.appendChild(container);
    this.shadowRoot.appendChild(paginationContainer);
    this.shadowRoot.appendChild(peopleContainer);
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
```

---

# Hybrids

An extraordinary JavaScript framework for creating client-side web applications, UI components libraries, or single web components with unique mixed declarative and functional architecture.

- **Component Model** based on plain objects and pure functions (No syntactic sugar!)
- **Global State Management** with external storages, offline caching, relations, and more
- **App-like Routing** based on the graph structure of views
- **Layout Engine** making UI layouts development much faster
- **Localization** with automatic translation of the templates content
- **Hot Module Replacement** support without any additional configuration

---

# Person.hybrid.js

```js {all|4|5-15|16-41}{lines:true,startLine:1,maxHeight:'500px'}
import { define, html } from "https://esm.sh/hybrids@^9";

define({
  tag: "person-hybrid",
  person: {
    value: {
      name: "",
      height: "",
      mass: "",
      hair_color: "",
      skin_color: "",
      eye_color: "",
      birth_year: "",
    },
  },
  render: ({ person }) => html`
    <style>
      .person {
        border: 2px solid #c90076;
        padding: 1rem;
        margin: 1rem;
        border-radius: 0.5rem;
        display: flex;
        flex-direction: column;
        min-width: 200px;
        background: #eeeeee;
      }
      .person h2 {
        margin: 0;
      }
    </style>
    <div class="person">
      <h2>${person.name}</h2>
      <p>Height: ${person.height}</p>
      <p>Mass: ${person.mass}</p>
      <p>Hair Color: ${person.hair_color}</p>
      <p>Skin: ${person.skin_color}</p>
      <p>Eye Color: ${person.eye_color}</p>
      <p>Birth Year: ${person.birth_year}</p>
    </div>
  `,
});
```

<!--
The render property is reserved for the creating structure of the custom element. The value option must be a function, which returns a result of the call to the built-in template engine.

The library uses the observe pattern to call the function automatically when dependencies change.
-->

---

# PeopleContainer.hybrid.js
```js {all|2|5|6|7-24|21}{lines:true,startLine:1,maxHeight:'500px'}
import { define, html } from "https://esm.sh/hybrids@^9";
import "./Person.hybrid.js";

define({
  tag: "people-hybrid",
  people: { value: [] },
  render: ({ people }) => html`
    <style>
      .people-wrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        max-width: 1200px;
        margin: 0 auto;
        background: #e7edf3;
        border-radius: 0.5rem;
      }
    </style>
    <div class="people-wrapper">
      ${people.map((person) => {
        return html`<person-hybrid person=${person}></person-hybrid>`;
      })}
    </div>
  `,
});
```

---

# Stores
Before we look at the other components, let's briefly touch on the concept of stores.

The store factory provides global state management based on model definitions with support for external storage. 

Use the store to share the internal state between the components or create a container for the data from internal or external APIs.

---

# Stores in action
````md magic-move{lines: true}
```js
// page store
import { store } from "https://esm.sh/hybrids@^9";

const pageStore = {
  page: 1,
};

function incrementPage(host) {
  store.set(pageStore, { page: host.page + 1 });
}

function decrementPage(host) {
  store.set(pageStore, { page: host.page - 1 });
}

function setPage(newPage) {
  store.set(pageStore, { page: newPage });
}

export { pageStore, incrementPage, decrementPage, setPage };
```
```js{all|4-12|15-18|19-23}
// people store
import { store } from "https://esm.sh/hybrids@^9";
import { searchPeople } from "../../api.js";
const Person = {
  name: "",
  height: "",
  mass: "",
  hair_color: "",
  skin_color: "",
  eye_color: "",
  birth_year: "",
};
export const peopleStore = {
  id: true,
  count: 0,
  next: "",
  previous: "",
  results: [Person],
  [store.connect]: {
    get: async ({ search, page }) => {
      return await searchPeople(search, page);
    },
    cache: 5 * 60 * 1000, // 5 minutes
  },
};
```
````

<!--
store is defined as a simple object

host refers to component instance calling the function.

components that consume stores are reactive and will update when the store value changes.
-->

---

# Pagination.hybrid.js
```js {all|2-7|10|11-13|14|15-35|37-46|47-58|59-68}{lines:true,startLine:1,maxHeight:'500px'}
import { define, html, store } from "https://esm.sh/hybrids@^9";
import {
  pageStore,
  incrementPage,
  decrementPage,
  setPage,
} from "./stores/page.js";

define({
  tag: "pagination-hybrid",
  next: "",
  previous: "",
  count: 0,
  page: () => store.get(pageStore).page,
  render: ({ count, next, previous, page }) => html`
    <style>
      .pagination-wrapper {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin: 1rem;
      }
      .pagination {
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;
        border: 2px solid #c90076;
        background: #e7edf3;
        color: #414b5a;
        cursor: pointer;
      }
      .pagination.current {
        background: #c90076;
        color: #e7edf3;
      }
    </style>
    <div class="pagination-wrapper">
      ${previous
        ? html`<button
            class="pagination"
            onclick=${(host) => {
              decrementPage(host);
            }}
          >
            Previous
          </button>`
        : ""}
      ${Array.from({ length: Math.ceil(count / 10) }).map(
        (_, index) => html`
          <button
            class="pagination ${page === index + 1 ? "current" : ""}"
            onclick=${() => {
              setPage(index + 1);
            }}
          >
            ${index + 1}
          </button>
        `
      )}
      ${next
        ? html`<button
            class="pagination"
            onclick=${(host) => {
              incrementPage(host);
            }}
          >
            Next
          </button>`
        : ""}
    </div>
  `,
});
```
---

# Search.hybrid.js
```js{all|2-3|4-6|8|9|10-14|48-74}{lines:true,startLine:1,maxHeight:'500px'}
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
```
---

# Final Thoughts

### No more bloated frameworks!

- Web Components are like magic tools that let you build your own custom HTML tags. They’re reusable, encapsulated, and super useful for creating unique and interactive web pages and apps.

- Hybrids.js is a super lightweight JavaScript framework that lets you build client-side web apps, UI components libraries, or even single web components with a mix of declarative and functional programming.
