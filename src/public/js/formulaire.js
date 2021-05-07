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
        <div class="col-6">
            <label for="date_debut">Dans combien de jour : </label>
            <div class="d-flex">
                <input class="form-control mr-1" type="number" name="date_debut_${numero_ligne}" id="date_debut" min="0">
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
                dateMesure: formData.get("date_debut_"+id)
            })
        }else if(!key.startsWith("date_debut_")){
            obj[key] = formData.get(key);
        }
    }
    objFinal.unshift(obj)
    console.log(objFinal)

    document.getElementById("widthSimulation").innerHTML = obj.width
    document.getElementById("heightSimulation").innerHTML = obj.height
    document.getElementById("basicPopulation").innerHTML = obj.nbEntities
    document.getElementById("infectedPopulation").innerHTML = obj.nbSick
    document.getElementById("contaminationRate").innerHTML = (Number.parseFloat(obj.probInf)*100)+"%"
    document.getElementById("mortalityRate").innerHTML = (Number.parseFloat(obj.probDea)*100)+"%"

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
    data.forEach((data, index) => {
        toReturn.dead.push(data.d)
        toReturn.healthy.push(data.h)
        toReturn.imune.push(data.i)
        toReturn.sick.push(data.s)
        toReturn.label.push(index)
    });
    return toReturn;
}

function generateChart(chart, label, dead, healthy, imune, sick){
    try {
        window.chart.destroy()
        document.getElementById("numberOfDead").innerHTML = dead[dead.length-1];
        document.getElementById("numberOfInfected").innerHTML = Math.max.apply(null, sick);
        document.getElementById("numberOfImmune").innerHTML = imune[imune.length-1];
        document.getElementById("numberOfPopulation").innerHTML = healthy[healthy.length-1];
    } catch(e) {}
    window.chart = new Chart(chart, {
        type: 'line',
        options: {
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
                    borderColor: "green",
                    backgroundColor: "green"
                },
                {
                    label: 'Immunisé',
                    data: imune,
                    borderColor: "blue",
                    backgroundColor: "blue"
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
    generateChart(document.getElementById("chart-simulation"), data.label, data.dead, data.healthy, data.imune, data.sick)
});