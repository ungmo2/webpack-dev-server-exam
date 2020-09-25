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

      // PATCH /todos/:id { compelted }
      app.patch('/todos/:id', (req, res) => {
        const { id } = req.params;
        const { completed } = req.body;
        todos = todos.map(todo =>
          todo.id === +id ? { ...todo, completed } : todo
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
  devtool: 'source-map',
};
