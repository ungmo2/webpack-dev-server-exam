# 1. create project

```bash
$ mkdir webpack-dev-server-exam && cd webpack-dev-server-exam
$ npm init -y
```

- file structure

```
webpack-dev-server-exam/
├── public/
│   └── index.html
├── src/
│   └── js/
│       ├── counter.js
│       └── redux-counter.js
├── package.json
└── webpack.config.js
```

- src/counter.js

```javascript
const $count = document.querySelector('.count');

document.querySelector('.increase').onclick = () => {
  $count.textContent = +$count.textContent + 1;
};

document.querySelector('.decrease').onclick = () => {
  $count.textContent = +$count.textContent - 1;
};
```

- public/index.html

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Webpack Dev Server Exam</title>
  </head>
  <body>
    <!-- webpack-dev-server가 정상 가동하면 카운터가 동작한다.-->
    <div class="count">0</div>
    <button class="increase">+</button>
    <button class="decrease">-</button>
    <script src="./bundle.js"></script>
  </body>
</html>
```

# 2. install webpack & webpack-dev-server

```bash
$ npm install --save-dev webpack webpack-cli webpack-dev-server
```

package.json

```json
...
  "scripts": {
    "start": "webpack-dev-server --progress"
  },
...
```

# 3. install babel(option)

```bash
$ npm install --save-dev @babel/core @babel/cli @babel/preset-env @babel/plugin-proposal-class-properties babel-loader
```

# 4. configulation

- webpack.config.js

```javascript
const path = require('path');

module.exports = {
  entry: './src/js/counter.js',
  // entry: './src/js/redux-counter.js',
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, 'src/js')],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 9000,
  },
};
```

# 5. start webpack-dev-server

```
$ npm start
```

[http://localhost:9000](http://localhost:9000)

# 5. module loading test

```
$ npm install redux
```

- src/redux-counter.js

```javascript
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
```

- webpack.config.js

```javascript
const path = require('path');

module.exports = {
  // entry: './src/js/counter.js',
  entry: './src/js/redux-counter.js',
...
```

```
$ npm start
```

# 6. mockup server

- src/request.js

```javascript
const getTodos = async () => {
  const res = await fetch('/todos');
  const todos = await res.json();
  console.log(todos);
};

getTodos();
```

- async/await를 위해 폴리필 적용

```bash
$ npm install @babel/polyfill
```

- webpack.config.js

```javascript
const path = require('path');

// for devServer.before
let todos = [
  { id: 3, content: 'Javascript', completed: false },
  { id: 2, content: 'CSS', completed: true },
  { id: 1, content: 'HTML', completed: false },
];

module.exports = {
  // entry: './src/js/counter.js',
  // entry: './src/js/redux-counter.js',
  entry: ['@babel/polyfill', './src/js/request.js'],
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, 'src/js')],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
      },
    ],
  },
  // https://webpack.js.org/configuration/dev-server
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    publicPath: '/',
    stats: 'errors-only',
    overlay: true,
    compress: true,
    port: 9000,
    before: (app, server, compiler) => {
      const bodyParser = require('body-parser');
      app.use(bodyParser.json());

      // GET /todos
      app.get('/todos', (req, res) => {
        res.json(todos);
      });

      // GET /todos/:id
      app.get('/todos/:id', (req, res) => {
        const { id } = req.params;
        todos = todos.filter(todo => todo.id === +id);
        res.json(todos);
      });

      // POST /todos { id, content, compelted }
      app.post('/todos', (req, res) => {
        const newTodo = req.body;
        todos = [newTodo, ...todos];
        res.json(todos);
      });

      // PATCH /todos/:id
      app.patch('/todos/:id', (req, res) => {
        const { id } = req.params;
        todos = todos.map(todo =>
          todo.id === +id ? { ...todo, completed: !todo.completed } : todo
        );
        res.json(todos);
      });

      // PATCH /todos { compelted }
      app.patch('/todos', (req, res) => {
        const { completed } = req.body;
        todos = todos.map(todo => ({ ...todo, completed }));
        res.json(todos);
      });

      // DELETE /todos/:id
      app.delete('/todos/:id', (req, res) => {
        const { id } = req.params;
        todos = todos.filter(todo => todo.id !== +id);
        res.json(todos);
      });
    },
  },
};
```

```
$ npm start
```

# 7. clone

```bash
$ cd ~/Desktop
$ git clone https://github.com/ungmo2/webpack-dev-server-exam.git
$ cd webpack-dev-server-exam
$ npm install
$ npm start
```

# Ref

- [프론트엔드 개발환경의 이해: 웹팩(심화)](https://jeonghwan-kim.github.io/series/2020/01/02/frontend-dev-env-webpack-intermediate.html)

- [DevServer](https://webpack.js.org/configuration/dev-server)

- [Redux](https://redux.js.org)
