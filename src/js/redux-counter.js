console.log('[redux-counter]');

import { createStore } from 'redux';

const reducer = (state = { count: 0 }, action) => {
  switch (action.type) {
    case 'INCREASE':
      return { ...state, count: state.count + 1 };
    case 'DECREASE':
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
};

const store = createStore(reducer);

store.subscribe(() => {
  const { count } = store.getState();
  document.querySelector('.count').textContent = count;
});

document.querySelector('.increase').onclick = () => {
  store.dispatch({ type: 'INCREASE' });
};

document.querySelector('.decrease').onclick = () => {
  store.dispatch({ type: 'DECREASE' });
};
