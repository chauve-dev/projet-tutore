function createRow(row){
    return `<tr data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="socket.emit('getSimulationById', '${row.id}')">
        <th scope="row">
          ${row.name}
        </th>
        <td>
          0
        </td>
        <td>
          0
        </td>
        <td>
          <i class="fas fa-arrow-up text-success mr-3"></i> 0%
        </td>
        <td>
          <i class="fas fa-arrow-down text-danger mr-3"></i> 0%
        </td>
        <td>
          ${getDate(new Date(Number.parseInt(row.date)))}
        </td>
      </tr>`
}

function getDate(d) {
    return d.getDate()  + "/" + (d.getMonth()+1) + "/" + d.getFullYear() + " " +
        (d.getHours()<10?'0':'') + d.getHours() + ":" + (d.getMinutes()<10?'0':'') + d.getMinutes();
}


socket.on("simulationList", data => {
    table = document.getElementById("tableBody");
    if(table != null) {
        data.reverse().forEach(element => {
            table.innerHTML += createRow(element)
        })
        new simpleDatatables.DataTable("#myTable", {
            columns: [
                {select: 5, sort: "desc"}
            ]
        })
    }
})

socket.emit("getSimulations")

function createMesureRow(data){
    if(data.typeMesure == "confinement") {
        return `
        <div class="row" id="ligne_mesure_${numero_ligne}">
        <div class="col-3">
            <label>Type de mesure :</label>
            <input class="form-control mr-1" type="text" value="${data.typeMesure}" disabled>
        </div>
        <div class="col-9">
            <div class="row">
                 <div class="col-sm">
                    <label for="date_debut">Taux de non respect : </label>
                    <input class="form-control mr-1" type="number" value="${data.pourDiss}" disabled>
                </div>
            <div class="col-sm">
                    <label for="date_debut">Dans combien de jour : </label>
                    <input class="form-control mr-1" type="number" value="${data.dateMesure}" disabled>
                </div>
                <div class="col-sm">
                    <label for="date_debut">Date de fin : </label>
                    <input class="form-control mr-1" type="number" value="${data.dateFinMesure}" disabled>
                </div>
            </div>
        </div>
  </div>
        `
    } else {
        return `
        <div class="row">
        <div class="col-3">
            <label>Type de mesure :</label>
            <input class="form-control mr-1" type="text" value="${data.typeMesure}" disabled>
        </div>
        <div class="col-9">
            <div class="row">
                <div class="col-sm">
                    <label for="date_debut">Dans combien de jour : </label>
                    <input class="form-control mr-1" type="number" value="${data.dateMesure}" disabled>
                </div>
                <div class="col-sm">
                    <label for="date_debut">Date de fin : </label>
                    <input class="form-control mr-1" type="number" value="${data.dateFinMesure}" disabled>
                </div>
            </div>
        </div>
  </div>
        `
    }
}

socket.on("simulationById", (data) => {
    var settings = data.data[0]
    data.data.shift()
    var mesure = data.data
    document.getElementById("liste_mesure").innerHTML = ""
    if(mesure.length > 0) {
        mesure.forEach(data => {
            document.getElementById("liste_mesure").innerHTML += createMesureRow(data)
        });
    }
    document.getElementById("sim_height").value = settings.height
    document.getElementById("sim_range").value = settings.infRad
    document.getElementById("sim_virus_span").value = settings.infTime
    document.getElementById("sim_time").value = settings.maxDays
    document.getElementById("sim_name").value = settings.name
    document.getElementById("sim_tot_pop").value = settings.nbEntities
    document.getElementById("sim_tot_inf").value = settings.nbSick
    document.getElementById("sim_drate").value = settings.probDea
    document.getElementById("sim_irate").value = settings.probImm
    document.getElementById("sim_crate").value = settings.probInf
    document.getElementById("sim_length").value = settings.width
    var data = formatData(data.sim);
    generateChart(document.getElementById("chart-simulation"), data.label, data.dead, data.healthy, data.imune, data.sick)
});