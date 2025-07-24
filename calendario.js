let currentDate = new Date();
let turmaSelecionada = null;
const isProfessorPage = document.body.dataset.page === "professor";



const sectionTurma = document.querySelector("section[data-section='atividades']");
if (!isProfessorPage && sectionTurma && sectionTurma.id) {
    turmaSelecionada = sectionTurma.id.toLowerCase(); // Para padronizar
}


function changeMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset);
    renderCalendar();
}

function renderCalendar() {
    if (!turmaSelecionada) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();

    let html = "";
    const nomeMes = firstDay.toLocaleString('default', { month: 'long' });
    html += `<h3>${nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1)} ${year}</h3>`;
    html += `<div class="calendar-grid">`;

    for (let i = 0; i < firstDay.getDay(); i++) {
        html += `<div class="empty"></div>`;
    }

    const localKey = "atividades_" + turmaSelecionada;
    let atividades = {};
    const armazenadas = JSON.parse(localStorage.getItem(localKey)) || [];

    armazenadas.forEach(({ data, professor, atividade, descricao }) => {
        if (!atividades[data]) atividades[data] = [];
        atividades[data].push({ professor, atividade, descricao });
    });

    for (let day = 1; day <= totalDays; day++) {
        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        html += `<div class="calendar-day"><strong>${day}</strong>`;

        if (atividades[dateStr]) {
            atividades[dateStr].forEach((item, index) => {
                html += `<div class="atividade">
                                <strong>${item.atividade}</strong><br>
                                <em>${item.professor}</em><br>
                                <p>${item.descricao}</p>
                                ${isProfessorPage ? `<button onclick="deleteAtividade('${dateStr}', ${index})">Excluir</button>` : ""}
                            </div>`;
            });
        }

        html += `</div>`;
    }

    html += `</div>`;
    document.getElementById("calendar").innerHTML = html;
}

function addAtividade() {
    const data = document.getElementById("data").value;
    const professor = document.getElementById("professor").value;
    const atividade = document.getElementById("atividade").value;
    const descricao = document.getElementById("descricao").value;
    const turma = document.getElementById("escturmas")?.value;

    if (!data || !professor || !atividade || !descricao || !turma) {
        alert("Por favor, preencha todos os campos e selecione a turma.");
        return;
    }

    const localKey = "atividades_" + turma;
    const atividades = JSON.parse(localStorage.getItem(localKey)) || [];
    atividades.push({ data, professor, atividade, descricao });
    localStorage.setItem(localKey, JSON.stringify(atividades));

    if (turmaSelecionada === turma) {
        renderCalendar();
    }

    document.getElementById("data").value = "";
    document.getElementById("professor").value = "";
    document.getElementById("atividade").value = "";
    document.getElementById("descricao").value = "";
}

function deleteAtividade(data, index) {
    const localKey = "atividades_" + turmaSelecionada;
    let atividades = JSON.parse(localStorage.getItem(localKey)) || [];

    atividades = atividades.filter((item, idx) => !(item.data === data && idx === index));
    localStorage.setItem(localKey, JSON.stringify(atividades));

    renderCalendar();
}

// Detectar mudança de turma no professor.html
if (isProfessorPage) {
    document.getElementById("escturmas")?.addEventListener("change", (e) => {
        turmaSelecionada = e.target.value;
        renderCalendar();
    });
}

// Inicializar
window.addEventListener("DOMContentLoaded", () => {
    if (isProfessorPage) {
        turmaSelecionada = document.getElementById("escturmas")?.value;
    }
    renderCalendar();
});


