const getTodos = async () => {
  const res = await fetch('/todos');
  const todos = await res.json();
  console.log(todos);
};

getTodos();
