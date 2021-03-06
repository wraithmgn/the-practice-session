


function loadAllSets () {
  const list = document.querySelector('#results .manifest-inventory');
  list.classList.remove('split')
  return fetch(`https://thesession.org/members/${memberId}/sets?format=json`)
    .then(res => res.json())
    .then(res => res.pages)
    .then(pageCount => {
      return Promise.all([...Array(pageCount-1)]
        .map((val, i) => i + 2)
        .map(pageNum =>
          fetch(`https://thesession.org/members/${memberId}/sets?page=${pageNum}&format=json`)
            .then(res => res.json())
            .then(page => {
              list.insertAdjacentHTML('beforeend', page.sets.map(set => `
                 <li class="manifest-item" tabindex="-1">
                <a href="/members/61738/sets/${set.id}">
                <span class="manifest-item-title">
                ${set.name}</span><!-- /.manifest-item-title -->
                </a>
                </li>
              `).join('\n'))
            })
        ))
    })
}

function sortSets (sets) {
  sets = sets || [...document.querySelectorAll('#results .manifest-inventory>li')];
  sets.sort((el1, el2) => {
    const val1 = el1.dataset.sortOrder;
    const val2 = el2.dataset.sortOrder;
    const isPinned1 = el1.hasAttribute('data-is-pinned');
    const isPinned2 = el2.hasAttribute('data-is-pinned');
    return isPinned1 && !isPinned2 ? -1 : !isPinned1 && isPinned2 ? 1 :
      val1 < val2 ? -1 : val1 > val2 ? 1: 0;
  })
  const list = document.querySelector('#results .manifest-inventory')
  sets.forEach(set => list.appendChild(set));
}

async function initPracticeSession () {
  document.querySelector('.pagination').remove();
  await loadAllSets();
  const sets = [...document.querySelectorAll('#results .manifest-inventory>li')];
  sets.map(set => practicifySet(set, null, true));
  const pinnedSets = await dataPromise('pin', []);
  await Promise.all(sets.map(exposeData.bind(null, pinnedSets)))
  sortSets(sets);
}

function initPracticeSessionButton () {
  const results = document.getElementById('results');
  const button = document.createElement('button');
  button.textContent = 'practice session';
  button.className = 'practice-session__init-button'
  results.insertBefore(button, results.firstElementChild);
  button.addEventListener('click', initPracticeSession)
}

initPracticeSession()
