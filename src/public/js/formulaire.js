var numero_ligne = 1;

function ajouter_ligne()
{
    liste_mesure = document.getElementById('liste_mesure');
    liste_mesure.insertAdjacentHTML('beforeend',`
    <div class="row" id="ligne_mesure_${numero_ligne}">
        <div class="col-6">
            <label>Type de mesure :</label>
            <select class="custom-select" name="type_mesures_${numero_ligne}">
                <option value="aucune">Selectionner une mesure</option>
                <option value="distanciation">Distanciation</i></option>
                <option value="masque">Masque</option>
                <option value="confinement">Confinement</option>
            </select>  
        </div>
        <div class="d-flex col-6">
            <div class="col-5">
                <label for="date_debut">Dans combien de jour : </label>
                <input class="form-control mr-1" type="number" name="date_debut_${numero_ligne}" id="date_debut" min="0">
            </div>
            <div class="col-5">
                <label for="date_debut">Date de fin : </label>
                <input class="form-control mr-1" type="number" name="date_fin_${numero_ligne}" id="date_fin" min="0">
            </div>
            <div class="col-2">
                <label for="date_debut">ㅤㅤ</label>
                <button type="button" class="btn btn-danger" onclick="supprimer('ligne_mesure_${numero_ligne}')"><i class="fas fa-minus"></i></button>  
            </div>
        </div>
  </div>
  `);
  numero_ligne++;
}

function supprimer(id)
{
    document.getElementById(id).remove();
}

function form_submit() {
    var form = document.getElementById('form_sim');
    var obj = {};
    var objFinal = [];
    var formData = new FormData(form);
    document.getElementById('dismissModal').click();

    for (var key of formData.keys()) {
        if (key.startsWith("type_mesures_")) {
            var id = key.replace("type_mesures_", "");
            objFinal.push({
                typeMesure: formData.get("type_mesures_"+id),
                dateMesure: formData.get("date_debut_"+id),
                dateFinMesure: formData.get("date_fin_"+id)
            })
        }else if(!key.startsWith("date_debut_")){
            obj[key] = formData.get(key);
        }
    }
    objFinal.unshift(obj)

    document.getElementById("widthSimulation").innerHTML = obj.width
    document.getElementById("heightSimulation").innerHTML = obj.height
    document.getElementById("basicPopulation").innerHTML = obj.nbEntities
    document.getElementById("infectedPopulation").innerHTML = obj.nbSick
    document.getElementById("contaminationRate").innerHTML = (Number.parseFloat(obj.probInf))+"%"
    document.getElementById("mortalityRate").innerHTML = (Number.parseFloat(obj.probDea))+"%"

    socket.emit("run-simulation", objFinal);
    return false;
}

function formatData(data){
    var toReturn = {
        dead: [],
        healthy: [],
        imune: [],
        sick: [],
        label: []
    }
    console.log(data)
    data.forEach((data, index) => {
        toReturn.dead.push(data.d)
        toReturn.healthy.push(data.h)
        toReturn.imune.push(data.i)
        toReturn.sick.push(data.s)
        toReturn.label.push(index)
    });
    console.log(toReturn)
    return toReturn;
}

function generateChart(chart, label, dead, healthy, imune, sick){
    try {
        window.chart.destroy()
    } catch(e) {}
    window.simData = {
        dead: dead,
        healthy: healthy,
        imune: imune,
        sick: sick
    }
    window.chart = new Chart(chart, {
        type: 'line',
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            elements: {
                point:{
                    radius: 0
                }
            },
            borderWidth: 5,
            tension: 0.3,
            tooltips: {
                callbacks: {
                    label: function(item, data) {
                        var label = data.datasets[item.datasetIndex].label || '';
                        var yLabel = item.yLabel;
                        var content = '';
                        if (data.datasets.length > 1) {
                            content += label;
                        }
                        content += yLabel;
                        return content;
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: "white"
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        color: "white"
                    }
                },
                x: {
                    ticks: {
                        color: "white"
                    }
                }
            }
        },
        data: {
            labels: label,
            datasets: [
                {
                    label: 'Mort',
                    data: dead,
                    borderColor: "red",
                    backgroundColor: "red"
                },
                {
                    label: 'En bonne santé',
                    data: healthy,
                    borderColor: "lime",
                    backgroundColor: "lime"
                },
                {
                    label: 'Immunisé',
                    data: imune,
                    borderColor: "aqua",
                    backgroundColor: "aqua"
                },
                {
                    label: 'Malade',
                    data: sick,
                    borderColor: "yellow",
                    backgroundColor: "yellow"
                }
            ],
        }
    });
}
const socket = io();

socket.on("simulation-result", (data) => {
    var data = formatData(data);
    socket.emit("getLastSimulation");
    generateChart(document.getElementById("chart-simulation"), data.label, data.dead, data.healthy, data.imune, data.sick)
});

socket.on("lastSimulation", (data) => {
    var data = formatData(data.sim);
    genHeader(window.simData, data);
});

function genHeader(data, lastData){

    const statDead = document.getElementById("statsNumberOfDead");
    const statSick = document.getElementById("statsNumberOfInfected");
    const statImune = document.getElementById("statsNumberOfImune");
    const statPop = document.getElementById("statsNumberOfPopulation");

    var currentDead = data.dead[data.dead.length-1];
    var currentSick = Math.max.apply(null, data.sick);
    var currentImune = data.imune[data.imune.length-1];
    var currentHealthy = data.healthy[data.healthy.length-1];

    var lastDead = lastData.dead[lastData.dead.length-1];
    var lastSick = Math.max.apply(null, lastData.sick);
    var lastImune = lastData.imune[lastData.imune.length-1];
    var lastHealthy = lastData.healthy[lastData.healthy.length-1];

    document.getElementById("numberOfDead").innerHTML = currentDead;
    document.getElementById("numberOfInfected").innerHTML = currentSick;
    document.getElementById("numberOfImmune").innerHTML = currentImune;
    document.getElementById("numberOfPopulation").innerHTML = currentHealthy;

    if(currentDead === 0) currentDead = 1;
    if(currentSick === 0) currentSick = 1;
    if(currentImune === 0) currentImune = 1;
    if(currentHealthy === 0) currentHealthy = 1;

    if(lastDead === 0) lastDead = 1;
    if(lastSick === 0) lastSick = 1;
    if(lastImune === 0) lastImune = 1;
    if(lastHealthy === 0) lastHealthy = 1;

    const deathP = Math.round(((currentDead/lastDead)-1)*100);
    const sickP = Math.round(((currentSick/lastSick)-1)*100);
    const imuneP = Math.round(((currentImune/lastImune)-1)*100);
    const healthyP = Math.round(((currentHealthy/lastHealthy)-1)*100);

    addStats(statDead, deathP);
    addStats(statSick, sickP);
    addStats(statImune, imuneP);
    addStats(statPop, healthyP);
}

function addStats(element, data) {
    const arrowUp = "<i class=\"fas fa-arrow-up\"></i>";
    const arrowDown = "<i class=\"fas fa-arrow-down\"></i>";
    const upClass = "text-success"
    const downClass = "text-danger"
    if (Math.sign(data)==-1){
        element.innerHTML = arrowDown + Math.abs(data) + "%";
        element.classList.remove(upClass);
        element.classList.add(downClass);
    } else {
        element.innerHTML = arrowUp + data + "%";
        element.classList.remove(downClass);
        element.classList.add(upClass);
    }
}