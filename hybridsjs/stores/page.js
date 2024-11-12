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
