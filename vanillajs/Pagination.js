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
