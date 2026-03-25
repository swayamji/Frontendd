let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

const $ = id => document.getElementById(id);
const save = () => localStorage.setItem("tasks", JSON.stringify(tasks));

const debounce = (fn, d=300) => {
  let t; return (...a) => { clearTimeout(t); t=setTimeout(()=>fn(...a), d); };
};

$("addTaskBtn").onclick = () => {
  let title = $("taskInput").value.trim(),
      priority = $("priorityInput").value,
      date = $("dateInput").value;

  if (!title || !priority || !date) return alert("Fill all fields!");

  tasks.push({ id: Date.now(), title, priority, date, done: false });
  save(); render();
  $("taskInput").value = $("priorityInput").value = $("dateInput").value = "";
};

function render() {
  let list = $("taskList");
  list.innerHTML = "";

  let data = tasks.filter(t =>
    filter === "all" ? true :
    filter === "completed" ? t.done : !t.done
  );

  data.forEach(t => {
    let badge = t.priority==3?"danger":t.priority==2?"warning":"info";
    let overdue = new Date(t.date) < new Date().setHours(0,0,0,0);

    list.innerHTML += `
      <div class="card p-3 mb-2 ${t.done?"text-decoration-line-through text-muted":""} ${overdue?"border border-danger":""}">
        <h5>${t.title}</h5>
        <span class="badge bg-${badge}">
          ${t.priority==3?"High":t.priority==2?"Medium":"Low"}
        </span>................................................................................
        <p>Deadline: ${t.date}</p>
        <button class="btn btn-success btn-sm" onclick="toggle(${t.id})">✔</button>
        <button class="btn btn-danger btn-sm" onclick="del(${t.id})">🗑</button>
      </div>`;
  });

  $("totalCount").innerText = tasks.length;
  $("completedCount").innerText = tasks.filter(t=>t.done).length;
  $("pendingCount").innerText = tasks.filter(t=>!t.done).length;
}

function toggle(id) {
  tasks = tasks.map(t => t.id===id ? {...t, done:!t.done} : t);
  save(); render();
}

function del(id) {
  tasks = tasks.filter(t => t.id!==id);
  save(); render();
}

document.querySelectorAll(".filter").forEach(btn =>
  btn.onclick = debounce(e => { filter = e.target.dataset.type; render(); })
);

$("sortPriority").onclick = () => { tasks.sort((a,b)=>b.priority-a.priority); render(); };
$("sortDate").onclick = () => { tasks.sort((a,b)=>new Date(a.date)-new Date(b.date)); render(); };

render();