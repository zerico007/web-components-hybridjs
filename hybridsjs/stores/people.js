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
