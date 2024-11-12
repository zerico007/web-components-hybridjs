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
