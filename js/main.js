var db, input, ul, flag = 0;

function init(){
  db = new Dexie("todos-pwa");
  input = document.querySelector('input');
  ul = document.querySelector('ul');

  document.body.addEventListener('submit', onSubmit);
  document.body.addEventListener("click", onClick);

  db.version(1).stores({ todo: '_id'});
  db.open()
    .then(refreshView);
}

/**
 * Metodo para Agregar a la lista de To Do's al clickear el boton
 * @param {*} event Evento que es del browser y fue quien disparo la llamada
 */
function onSubmit(event){
  // Prevengo que el submit refresque la pagina
  event.preventDefault();
  // console.log('evento', event);

  db.todo.put({ text: input.value, _id: String(Date.now()) })
    .then(function(){
      input.value = '';
    })
    .then(refreshView);

  if (flag == 0){
    flag++;
    // abro popup
  } else {
    flag = 0
    // cierro popup
  }
}

/**
 * Metodo para borrar los To Do's cuando hago click en el Tacho
 * @param {*} event Evento que es del browser y fue quien disparo la llamada
 */
function onClick(event){
  var id;
  if (event.target.hasAttribute('id') && event.target.classList.contains('bi-trash')){
    // Prevengo el comportamiento default del click del boton
    event.preventDefault();

    // Cual es el ID a borrar?
    id = event.target.getAttribute("id");

    db.todo.where('_id').equals(id).delete()
    .then(refreshView);
  }
}

/**
 * Metodo para imprimir los To Do's
 * @param {Array} todos array de todos a imprimir
 */
function imprimirAllTodos(todos){
  var html = '';
  // for (var i = 0; i < todos.length; i++)
  todos.forEach(function(todo){
    html+= `<li>
              <button id="${todo._id}" class="btn btn-link bi bi-trash"></button>
              ${todo.text}</li>`;
  });

  ul.innerHTML = html;
}

function refreshView(){
  return db.todo.toArray()
  .then(imprimirAllTodos);
}

window.onload = function(){
  init();
}