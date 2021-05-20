function createRow(row){
    return `<tr data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="socket.emit('getSimulationById', '${row.id}')">
        <th scope="row">
          ${row.id}
        </th>
        <td>
          4,569
        </td>
        <td>
          340
        </td>
        <td>
          <i class="fas fa-arrow-up text-success mr-3"></i> 46,53%
        </td>
        <td>
          <i class="fas fa-arrow-down text-danger mr-3"></i> 46,53%
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

socket.on("simulationById", (data) => {
    var data = formatData(data.sim);
    generateChart(document.getElementById("chart-simulation"), data.label, data.dead, data.healthy, data.imune, data.sick)
});