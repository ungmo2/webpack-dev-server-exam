console.log('[counter]');

const $count = document.querySelector('.count');

document.querySelector('.increase').onclick = () => {
  $count.textContent = +$count.textContent + 1;
};

document.querySelector('.decrease').onclick = () => {
  $count.textContent = +$count.textContent - 1;
};
