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
