import characterItem from './characterList.js';

const refs = {
  characterList: document.querySelector('.character-list'),
  sortSelector: document.getElementById('select-sort'),
  growthBtn: document.getElementById('sort-by-growth'),
  declineBtn: document.getElementById('sort-by-decline'),
  returnBtn: document.querySelector('.btn-return'),
  sortByEpisodesBtn: document.querySelector('.sort-by-episode-btn'),
  searchInput: document.querySelector('.top-menu-input'),
};

function fetchCharacters(page = 1) {
  return fetch(`https://rickandmortyapi.com/api/character/?page=${page}`).then(
    (res) => res.json()
  );
}

let totalPages;
let items;

async function loadCharacters() {
  await fetchCharacters().then(({ info, results }) => {
    totalPages = info.pages;
    items = results;
  });

  const fetches = [];
  for (let i = 2; i <= totalPages; i += 1) {
    fetches.push(fetchCharacters(i));
  }
  const data = await Promise.all(fetches);
  data.forEach(({ results }) => {
    items.push(...results);
  });
  return items;
}
await loadCharacters();
let lastScrollNumber = 0;
let nextScrollNumber = 10;

function renderList(lastScrollNumber, nextScrollNumber, items) {
  const renderItems = items.slice(lastScrollNumber, nextScrollNumber);
  const list = renderItems.map(characterItem).join('');
  refs.characterList.insertAdjacentHTML('beforeend', list);
}
renderList(lastScrollNumber, nextScrollNumber, items);

let numberForSort = 10;
let itemsToFilter = items.slice(0);

function sortByEpisodes(items) {
  items = items.sort(function (a, b) {
    if (a.episode.length > b.episode.length) {
      return -1;
    }
    if (a.episode.length < b.episode.length) {
      return 1;
    }
    if (a.episode.length == b.episode.length) {
      if (a.created > b.created) {
        return 1;
      }
      if (a.created < b.created) {
        return -1;
      }
    }
  });
}

refs.sortByEpisodesBtn.addEventListener('click', () => {
  setTimeout(() => {
    refs.characterList.innerHTML = '';
  }, 1);
  setTimeout(() => {
    sortByEpisodes(items);
    sortByEpisodes(itemsToFilter);
    sortRenderItems(numberForSort, items);
  }, 2);
});

function sortRenderItems(numberForSort, sortedItems) {
  const renderItems = sortedItems.slice(0, numberForSort);
  const list = renderItems.map(characterItem).join('');
  refs.characterList.insertAdjacentHTML('beforeend', list);
}

function sortCharactersByGrowth(items) {
  items = items.sort(function (a, b) {
    if (a.created > b.created) {
      return 1;
    }
    if (a.created < b.created) {
      return -1;
    }
  });
}
function sortCharactersByDecline(items) {
  items = items.sort(function (a, b) {
    if (a.created > b.created) {
      return -1;
    }
    if (a.created < b.created) {
      return 1;
    }
  });
}

refs.sortSelector.addEventListener('change', function () {
  if (refs.sortSelector.value == 1) {
    setTimeout(() => {
      refs.characterList.innerHTML = '';
    }, 1);
    setTimeout(() => {
      sortCharactersByGrowth(items);
      sortCharactersByGrowth(itemsToFilter);
      sortRenderItems(numberForSort, items);
    }, 2);
  }
  if (refs.sortSelector.value == 2) {
    setTimeout(() => {
      refs.characterList.innerHTML = '';
    }, 1);
    setTimeout(() => {
      sortCharactersByDecline(items);
      sortCharactersByDecline(itemsToFilter);
      sortRenderItems(numberForSort, items);
    }, 2);
  }
});
refs.characterList.onscroll = function () {
  if (
    refs.characterList.scrollTop + window.innerHeight >=
    refs.characterList.scrollHeight
  ) {
    lastScrollNumber += 10;
    nextScrollNumber += 10;
    numberForSort = nextScrollNumber;
    renderList(lastScrollNumber, nextScrollNumber, items);
  }
};
refs.returnBtn.addEventListener('click', () => {
  refs.characterList.scrollTop =
    refs.characterList.scrollHeight - refs.characterList.scrollHeight;

  setTimeout(() => {
    refs.characterList.innerHTML = '';
  }, 1);

  setTimeout(() => {
    renderList(0, 10, items);
    lastScrollNumber = 0;
    nextScrollNumber = 10;
  }, 2);
});

const deleteCharacter = (id) => {
  items = items.filter((item) => item.id !== Number(id));
  itemsToFilter = itemsToFilter.filter((item) => item.id !== Number(id));
};

const handleClick = (e) => {
  if (e.target === e.currentTarget) return;

  const div = e.target.closest('div');
  const { id } = div.dataset;
  switch (e.target.nodeName) {
    case 'BUTTON':
      refs.characterList.innerHTML = '';
      deleteCharacter(id);
      sortRenderItems(numberForSort, items);
      console.log(items);
      break;
  }
};

const filterCharacters = (filter, items) => {
  return items.filter((item) =>
    item.name.toLowerCase().includes(filter.toLowerCase())
  );
};

const handleChange = (e) => {
  const inputName = e.target.value;
  items = filterCharacters(inputName, itemsToFilter);

  refs.characterList.innerHTML = '';
  sortRenderItems(numberForSort, items);
};
//refs.searchInput.onchange = handleChange;
refs.characterList.addEventListener('click', handleClick);
refs.searchInput.addEventListener('input', handleChange);
