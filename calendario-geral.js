let currentDate = new Date();

function addAtividadeGeral() {
    const data = document.getElementById("data").value;
    const turma = document.getElementById("turma-calender").value;
    const professores = document.getElementById("professores-calender").value;
    const descricao = document.getElementById("descricao").value;

    if (!data || !turma || !professores || !descricao) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const atividades = JSON.parse(localStorage.getItem("atividades_geral")) || [];
    atividades.push({ data, turma, professores, descricao });
    localStorage.setItem("atividades_geral", JSON.stringify(atividades));

    // Limpar campos
    document.getElementById("data").value = "";
    document.getElementById("turma-calender").value = "";
    document.getElementById("professores-calender").value = "";
    document.getElementById("descricao").value = "";

    renderCalendarGeral(true);
}

function renderCalendarGeral(editavel = true) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();

    let html = "";
    const nomeMes = firstDay.toLocaleString('default', { month: 'long' });
    html += `<h3>${nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1)} ${year}</h3>`;
    
    html += `
  <div class="calendar-weekdays">
    <div>Dom</div>
    <div>Seg</div>
    <div>Ter</div>
    <div>Qua</div>
    <div>Qui</div>
    <div>Sex</div>
    <div>Sáb</div>
  </div>`;

    html += `<div class="calendar-grid">`;

    for (let i = 0; i < firstDay.getDay(); i++) {
        html += `<div class="empty"></div>`;
    }

    const atividades = JSON.parse(localStorage.getItem("atividades_geral")) || [];
    const agrupadas = {};

    atividades.forEach((item, index) => {
        if (!agrupadas[item.data]) agrupadas[item.data] = [];
        agrupadas[item.data].push({ ...item, index });
    });

    for (let day = 1; day <= totalDays; day++) {
        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day
            .toString()
            .padStart(2, '0')}`;
        html += `<div class="calendar-day"><strong>${day}</strong>`;

        if (agrupadas[dateStr]) {
            agrupadas[dateStr].forEach((item) => {
                html += `<div class="atividade">
                    <strong>${item.turma}</strong><br>
                    <em>${item.professores}</em><br>
                    <p>${item.descricao}</p>
                    ${editavel ? `<button onclick="excluirAtividadeGeral('${item.data}', ${item.index})">Excluir</button>` : ""}
                </div>`;
            });
        }

        html += `</div>`;
    }

    html += `</div>`;
    document.getElementById("calendar-content").innerHTML = html;

}

function excluirAtividadeGeral(data, index) {
    let atividades = JSON.parse(localStorage.getItem("atividades_geral")) || [];
    let novas = atividades.filter((item, idx) => !(item.data === data && idx === index));
    localStorage.setItem("atividades_geral", JSON.stringify(novas));
    renderCalendarGeral(true);
}

function changeMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset);
    renderCalendarGeral(typeof isProfessorPage !== 'undefined' ? isProfessorPage : false);
}

document.addEventListener("DOMContentLoaded", () => {
    renderCalendarGeral(typeof isProfessorPage !== 'undefined' ? isProfessorPage : false);
});
