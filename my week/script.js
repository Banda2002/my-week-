const schedule = [
  {day:"السبت", en:"SATURDAY", type:"ERP / BOS", icon:"💻", desc:"C# + تطبيق عملي", time:"7:00 م → 9:00 م", cls:"blue"},
  {day:"الأحد", en:"SUNDAY", type:"English", icon:"🇬🇧", desc:"كورس اللغة الإنجليزية", time:"7:00 م → 10:00 م", cls:"purple"},
  {day:"الاثنين", en:"MONDAY", type:"ERP / BOS", icon:"💻", desc:"SQL / Backend + تطبيق", time:"7:00 م → 9:00 م", cls:"blue"},
  {day:"الثلاثاء", en:"TUESDAY", type:"GYM", icon:"🏋️", desc:"تمرين قوة ولياقة", time:"7:00 م → 8:30 م", cls:"green"},
    { day: "الأربعاء", en: "WEDNESDAY", type: "English", icon: "🇬🇧", desc: "كورس اللغة الإنجليزية", time: "7:00 م → 10:00 م", cls:"purple"},
    { day: "الخميس", en: "THURSDAY", type: "GYM", icon: "🏋️", desc: "تمرين قوة ولياقة", time: "وقت مرن", cls: "green" },
    { day: "الجمعة", en: "FRIDAY", type: "REST DAY", icon: "🧘", desc: "راحة واسترجاع الطاقة", time: "يوم راحة", cls: "orange" }
]; 

const roadmap = [
  ["01","C# Fundamentals","Variables • Conditions • Loops • Methods"],
  ["02","OOP","Classes • Objects • Inheritance • Polymorphism"],
  ["03","SQL Server","Database • Queries • Relations"],
  ["04","ASP.NET Core","Web API • Authentication • Backend"],
  ["05","Entity Framework Core","ORM • CRUD • Database Integration"],
  ["06","ERP Project","Sales • Purchases • Inventory • Accounting"]
];

let tasks = JSON.parse(localStorage.getItem("erpTasks") || "null") || [
  {text:"مراجعة C# Fundamentals",done:false},
  {text:"حل 5 مسائل على الـ Loops",done:false},
  {text:"مراجعة كلمات English الجديدة",done:false},
  {text:"تجهيز تمرين الأسبوع",done:false}
];
let activeRoad = Number(localStorage.getItem("activeRoad") || 0);

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

function renderSchedule(){
  const dayIndex = new Date().getDay();
  const ordered = [6,0,1,2,3,4,5]; // Sat -> Fri
  $("#fullSchedule").innerHTML = ordered.map((i,idx)=>{
    const x=schedule[i], today = (i===dayIndex);
    return `<article class="day-card ${today?'today':''}">
      <div class="day-title"><b>${x.day}</b><small>${x.en}</small></div>
      <div class="activity"><div class="activity-icon">${x.icon}</div><div>
      <h3>${x.type}</h3><p>${x.desc}</p><span class="time">${x.time}</span></div></div>
    </article>`;
  }).join("");
  $("#miniSchedule").innerHTML = ordered.slice(0,4).map(i=>{
    const x=schedule[i]; return `<div class="mini-row"><span><i class="dot" style="background:var(--${x.cls})"></i>${x.day}</span><span class="type">${x.type}</span><small>${x.time}</small></div>`;
  }).join("");
}

function renderRoadmap(){
  $("#roadmapGrid").innerHTML = roadmap.map((r,i)=>`<article class="road-card ${i===activeRoad?'active':''}" data-road="${i}">
    <span class="road-num">${r[0]}</span><span class="road-status">${i===activeRoad?'CURRENT':''}</span>
    <h3>${r[1]}</h3><p>${r[2]}</p>
  </article>`).join("");
  $$(".road-card").forEach(c=>c.onclick=()=>{
    activeRoad=Number(c.dataset.road);
    localStorage.setItem("activeRoad",activeRoad);
    renderRoadmap();
    updateProgress();
  });
}

function renderTasks(){
  $("#taskList").innerHTML = tasks.map((t,i)=>`<div class="task ${t.done?'done':''}">
    <input type="checkbox" ${t.done?'checked':''} data-task="${i}">
    <span>${escapeHtml(t.text)}</span>
    <button class="delete" data-delete="${i}">✕</button>
  </div>`).join("");
  $("#miniTasks").innerHTML = tasks.slice(0,4).map(t=>`<div class="mini-row"><span>${t.done?'✓':'○'} ${escapeHtml(t.text)}</span><small>${t.done?'تم':'قادم'}</small></div>`).join("") || `<p class="muted">مفيش مهام حالياً.</p>`;
  $$("[data-task]").forEach(c=>c.onchange=()=>{tasks[Number(c.dataset.task)].done=c.checked;saveTasks();renderTasks();updateProgress();});
  $$("[data-delete]").forEach(b=>b.onclick=()=>{tasks.splice(Number(b.dataset.delete),1);saveTasks();renderTasks();updateProgress();});
}
function saveTasks(){localStorage.setItem("erpTasks",JSON.stringify(tasks))}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}

function updateProgress(){
  const done=tasks.filter(t=>t.done).length;
  const taskP=tasks.length?Math.round(done/tasks.length*100):0;
  const p=Math.round((taskP + activeRoad/5*100)/2);
  $("#overallProgress").textContent=p+"%";
}
function showSection(id){
  $$(".page-section").forEach(s=>s.classList.add("hidden"));
  $("#"+id).classList.remove("hidden");
  $$(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.section===id));
  window.scrollTo({top:0,behavior:"smooth"});
}
function setDate(){
  const d=new Date();
  $("#todayText").textContent=d.toLocaleDateString("ar-EG",{weekday:"long",day:"numeric",month:"long"});
}
$$(".nav-link").forEach(b=>b.onclick=()=>showSection(b.dataset.section));
$$("[data-go]").forEach(b=>b.onclick=()=>showSection(b.dataset.go));
$("#addTask").onclick=()=>{
  const text=prompt("اكتب المهمة الجديدة:");
  if(text && text.trim()){tasks.push({text:text.trim(),done:false});saveTasks();renderTasks();updateProgress();}
};
$("#themeBtn").onclick=()=>{
  document.body.classList.toggle("light");
  const light=document.body.classList.contains("light");
  localStorage.setItem("light",light);
  $("#themeBtn").innerHTML=light?"☾ <span>الوضع الداكن</span>":"☼ <span>الوضع الفاتح</span>";
};
if(localStorage.getItem("light")==="true"){document.body.classList.add("light");$("#themeBtn").innerHTML="☾ <span>الوضع الداكن</span>";}
const lightStyle=document.createElement("style");
lightStyle.textContent=`body.light{--bg:#f2f5fa;--panel:#fff;--panel2:#eef2f8;--text:#162033;--muted:#68758a;--line:rgba(20,30,50,.1)}body.light .sidebar{background:#fff}`;
document.head.appendChild(lightStyle);

setDate();renderSchedule();renderRoadmap();renderTasks();updateProgress();
