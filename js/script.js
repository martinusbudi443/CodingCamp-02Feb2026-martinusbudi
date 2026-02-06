const form = document.getElementById('todoForm');
const titleEl = document.getElementById('title');
const dateEl = document.getElementById('date');
const table = document.getElementById('todoTable');
const filterTitle = document.getElementById('filterTitle');
const filterDate = document.getElementById('filterDate');
const deleteAllBtn = document.getElementById('deleteAll');
const toast = document.getElementById('toast');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

function save(){
  localStorage.setItem('todos', JSON.stringify(todos));
}

function showToast(text){
  toast.textContent = text;
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'),2000);
}

function render(){
  table.innerHTML = '';

  let data = [...todos];
  if(filterTitle.value)
    data = data.filter(t=>t.title.toLowerCase().includes(filterTitle.value.toLowerCase()));
  if(filterDate.value)
    data = data.filter(t=>t.date === filterDate.value);

  data.forEach(todo=>{
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${todo.title}</td>
      <td>${todo.date}</td>
      <td class="actions">
        <button onclick="editTodo('${todo.id}')">Edit</button>
        <button class="danger" onclick="deleteTodo('${todo.id}')">Hapus</button>
      </td>
    `;
    table.appendChild(tr);
  });
}

form.addEventListener('submit',e=>{
  e.preventDefault();
  if(!titleEl.value || !dateEl.value) return;

  todos.push({
    id:Date.now().toString(),
    title:titleEl.value,
    date:dateEl.value
  });

  save();
  render();
  form.reset();
  showToast('Todo ditambahkan');
});

deleteAllBtn.onclick = ()=>{
  if(!confirm('Hapus semua?')) return;
  todos = [];
  save();
  render();
  showToast('Semua todo dihapus');
};

window.deleteTodo = id =>{
  todos = todos.filter(t=>t.id!==id);
  save();
  render();
  showToast('Todo dihapus');
};

window.editTodo = id =>{
  const todo = todos.find(t=>t.id===id);
  const newTitle = prompt('Judul baru', todo.title);
  const newDate = prompt('Tanggal baru (YYYY-MM-DD)', todo.date);
  if(!newTitle || !newDate) return;
  todo.title = newTitle;
  todo.date = newDate;
  save();
  render();
  showToast('Todo diedit');
};

filterTitle.oninput = render;
filterDate.onchange = render;

render();
