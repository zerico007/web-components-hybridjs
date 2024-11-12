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
