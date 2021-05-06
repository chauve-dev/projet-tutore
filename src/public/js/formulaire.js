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
                <option value="distancing">Distanciation</i></option>
                <option value="washingHand">Lavages des mains réguliers</option>
                <option value="mask">Masque</option>
                <option value="closeSchool">Écoles fermées</option>
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