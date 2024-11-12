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
