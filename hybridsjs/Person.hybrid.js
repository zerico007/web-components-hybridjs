import { define, html } from "https://esm.sh/hybrids@^9";

define({
  tag: "person-hybrid",
  person: null,
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
