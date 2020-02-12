function graphql(query, variables = {}) {
  return fetch('/admin/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      variables,
      query,
    }),
  }).then(function(result) {
    return result.json();
  });
}

const GET_TODOS = `
    query GetOrders {
      allOrders {
        name
        time
        people
        id
      }
    }
  `;

const ADD_TODO = `
    mutation AddOrder($name: String!, $time: String!, $people: String!) {
      createOrder(data: { name: $name, time: $time, people: $people }) {
        name
        time
        people
        id
      }
    }
  `;

const REMOVE_TODO = `
    mutation RemoveTodo($id: ID!) {
      deleteTodo(id: $id) {
        name
        id
      }
    }
  `;

const DELETE_ICON = `<svg viewBox="0 0 14 16" class="delete-icon">
  <title>Delete this item</title>
  <path
    fillRule="evenodd"
    d="M11 2H9c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1H2c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1v9c0 .55.45 1 1 1h7c.55 0 1-.45 1-1V5c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 12H3V5h1v8h1V5h1v8h1V5h1v8h1V5h1v9zm1-10H2V3h9v1z"
  />
</svg>`;

function addTodo(event) {
  event.preventDefault();
  const form = event.target;
  // Find the 'add-item' input element
  const elementName = form.elements['add-name'];
  const elementTime = form.elements['add-time'];
  const elementPeople = form.elements['add-people'];
  console.log(elementName)
  if (elementName, elementTime, elementPeople) {
    graphql(ADD_TODO, { name: elementName.value, time: elementTime.value, people: elementPeople.value}).then(fetchData);
  }

  // Clear the form
  form.reset();
}

function removeTodo(todo) {
  graphql(REMOVE_TODO, { id: todo.id }).then(fetchData);
}

function createToDoItem(todo) {

  // Create the list item
  const listItem = document.createElement('td');
  listItem.classList.add('list-item');
  // Add text to the listItem
  listItem.innerHTML = todo;
  // append the remove item button

  return listItem;
}
function createToDoHead(todo) {

  // Create the list item
  const listItem = document.createElement('th');
  listItem.classList.add('list-item');
  // Add text to the listItem
  listItem.innerHTML = todo;
  // append the remove item button

  return listItem;
}
function createList(data) {
  // Create the list
  const list = document.createElement('table');
  list.classList.add('list');
  console.log(data)
  const trh = document.createElement('tr');
  trh.classList.add('tr');
  trh.appendChild(createToDoHead('ชื่อผู้จอง'));
  trh.appendChild(createToDoHead('เวลาที่จอง'));
  trh.appendChild(createToDoHead('จำนวนที่จอง'));
  list.appendChild(trh)
  data.allOrders.forEach(function(todo) {
    const tr = document.createElement('tr');
    tr.classList.add('tr');
    tr.appendChild(createToDoItem(todo.name));
    tr.appendChild(createToDoItem(todo.time));
    tr.appendChild(createToDoItem(todo.people));
    list.appendChild(tr)
  });
  return list;
}

function fetchData() {
  graphql(GET_TODOS)
    .then(function(result) {
      // Clear any existing elements from the list
      document.querySelector('.results').innerHTML = '';
      // Recreate the list and append it to the .results div
      const list = createList(result.data);
      document.querySelector('.results').appendChild(list);
    })
    .catch(function(error) {
      console.log(error);
      document.querySelector('.results').innerHTML = '<p>Error</p>';
    });
}

function myFunction() {
  const form = event.target;
  // Find the 'add-item' input element
  const elementName = document.querySelector('.js-add-todo-form').elements['add-name'];
  const elementTime = document.querySelector('.js-add-todo-form').elements['add-time'];
  const elementPeople = document.querySelector('.js-add-todo-form').elements['add-people'];
  if (elementName, elementTime, elementPeople) {
    graphql(ADD_TODO, { name: elementName.value, time: elementTime.value, people: elementPeople.value}).then(fetchData);
  }

  // Clear the form
  form.reset();
}

fetchData();
