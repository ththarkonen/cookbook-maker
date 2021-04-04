<template>
  <div class="modal fade" :id="`${id}`" tabindex="-1" role="dialog" aria-labelledby="addRecipeModal" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <div class="form-group less-margin-bottom">
            <h3 class="card-header text-center font-weight-bold text-uppercase py-4">Resepti</h3>
            <div class="form-group row no-margin-bot">
              <label for="recipeName" class="col-sm-3 col-form-label text-center">Nimi</label>
              <div class="col-sm-9">
                <input type="name" class="form-control" id="recipeName" ref="recipeName" placeholder="Nimi">
              </div>
            </div>
            <div class="form-group row no-margin-bot">
              <label for="portions" class="col-sm-3 col-form-label text-center">Annoksia</label>
              <div class="col-sm-9">
                <input type="name" class="form-control" id="portions" ref="portions" placeholder="Esim. 5-6 annosta tai 12 kappaletta">
              </div>
            </div>
            <h3 class="card-header text-center font-weight-bold text-uppercase py-4 ">Kokonaisvalmistusaika</h3>
            <div class="form-group row no-margin-bot text-center">
              <label for="prepHours" class="col-sm-3 col-form-label text-center">Tunnit</label>
              <div class="col-sm-9">
                <input type="name" class="form-control" id="prepHours" ref="prepHours" placeholder="Valmistusaika (tunnit)">
              </div>
            </div>
            <div class="form-group row no-margin-bot">
              <label for="prepMins" class="col-sm-3 col-form-label text-center">Minuutit</label>
              <div class="col-sm-9">
                <input type="name" class="form-control" id="prepMins" ref="prepMins" placeholder="Valmistusaika (minuutit)">
              </div>
            </div>
            <h3 class="card-header text-center font-weight-bold text-uppercase py-4 ">Paistaminen</h3>
            <div class="form-group row no-margin-bot text-center">
              <label for="cookHours" class="col-sm-3 col-form-label text-center">Tunnit</label>
              <div class="col-sm-9">
                <input type="name" class="form-control" id="cookHours" ref="cookHours" placeholder="Paistoaika (tunnit)">
              </div>
            </div>
            <div class="form-group row no-margin-bot">
              <label for="cookMins" class="col-sm-3 col-form-label text-center">Minuutit</label>
              <div class="col-sm-9">
                <input type="name" class="form-control" id="cookMins" ref="cookMins" placeholder="Paistoaika (minuutit)">
              </div>
            </div>
            <div class="form-group row no-margin-bot text-center">
              <label for="cookTemp" class="col-sm-3 col-form-label text-center">Paistolämpötila</label>
              <div class="col-sm-9">
                <input type="name" class="form-control" id="cookTemp" ref="cookTemp" placeholder="Lämpötila">
              </div>
            </div>
          </div>
          <!-- Editable table -->
          <div class="card">
            <h3 class="card-header text-center font-weight-bold text-uppercase py-4">Raaka-aineet</h3>
            <div class="card-body">
              <div id="ingredientsTable" class="table-editable">
                <table class="table table-bordered table-responsive-md table-striped text-center">
                  <thead>
                    <tr>
                      <th class="text-center">Ainesosa</th>
                      <th class="text-center">Määrä</th>
                      <th class="text-center">Järjestä</th>
                      <th class="text-center">
                        <span class="table-add float-right mb-3 mr-2" v-on:click="addRecipeLine($event, '', '')"><a href="#!" class="text-success"><i
                              class="glyphicon glyphicon-plus" aria-hidden="true"></i></a></span></th>
                    </tr>
                  </thead>
                  <tbody ref="recipeTableBody">
                    <RecipeLine ingredient="perunoita" amount="1 kg"></RecipeLine>
                    <RecipeLine ingredient="jauhelihaa" amount="400 g"></RecipeLine>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <!-- Editable table -->
          <div class="card">
            <h3 class="card-header text-center font-weight-bold text-uppercase py-4">Välivaiheet</h3>
            <div class="card-body">
              <div id="table" class="table-editable">
                <table class="table table-bordered table-responsive-md table-striped text-center">
                  <thead>
                    <tr>
                      <th class="text-center">Välivaihe</th>
                      <th class="text-center">Järjestä</th>
                      <th class="text-center"><span class="table-add float-right mb-3 mr-2" v-on:click="addRecipeStepLine($event, '')"><a href="#!" class="text-success"><i
                            class="glyphicon glyphicon-plus" aria-hidden="true"></i></a></span></th>
                    </tr>
                  </thead>
                  <tbody ref="recipeStepsTableBody">
                    <RecipeStepLine step="Tee perunamuusia"></RecipeStepLine>
                    <RecipeStepLine step="Tee lisää perunamuusia"></RecipeStepLine>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <!-- Editable table -->
          <div class="card">
            <h3 class="card-header text-center font-weight-bold text-uppercase py-4">Ehdotus</h3>
            <div class="card-body">
              <div class="form-group">
                <textarea class="form-control" id="suggestionTextArea" ref="suggestion" rows="3"></textarea>
              </div>
            </div>
          </div>
          <!-- Editable table -->
          <div class="card">
            <h3 class="card-header text-center font-weight-bold text-uppercase py-4">Vinkki</h3>
            <div class="card-body">
              <div class="form-group">
                <textarea class="form-control" id="tipTextArea" ref="tip" rows="3"></textarea>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-cancel pull-left" data-dismiss="modal">Sulje</button>
          <button type="button" class="btn btn-secondary btn-cancel pull-left" v-on:click="clearRecipe">Tyhjennä</button>
          <button type="button" class="btn btn-primary btn-recipe" v-on:click="addRecipe">Tallenna</button>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>

  import RecipeLine from '@/components/newRecipeLine.vue'
  import RecipeStepLine from '@/components/newRecipeStepLine.vue'
  import Vue from 'vue'

  export default {
    props: {
      id: String,
    },

    data: function() {
      return {
        savingMode: true,
      }
    },

    components: {
      RecipeLine, RecipeStepLine
    },

    methods: {

      addRecipeLine(e, ing, amount) {

        var ComponentClass = Vue.extend(RecipeLine);
        var recipeLine = new ComponentClass({
            propsData: { ingredient: ing, amount: amount }
        })

        recipeLine.$mount();
        this.$refs.recipeTableBody.append(recipeLine.$el);
      },

      addRecipeStepLine(e, step) {

        var ComponentClass = Vue.extend(RecipeStepLine);
        var recipeStepLine = new ComponentClass({
            propsData: { step: step }
        });

        recipeStepLine.$mount();
        this.$refs.recipeStepsTableBody.append(recipeStepLine.$el);
      },

      addRecipe() {
        console.log("Adding recipe")

        var inputs = this.$refs;

        var name = inputs.recipeName.value;
        var filename = name.replace(/[^A-Za-z0-9\-_]/g, '-');
        filename = filename + ".tex";

        var portions = inputs.portions.value;

        var prepHours = inputs.prepHours.value;
        var prepMins = inputs.prepMins.value;

        var cookHours = inputs.cookHours.value;
        var cookMins = inputs.cookMins.value;
        var cookTemp = inputs.cookTemp.value;

        var suggestion = inputs.suggestion.value;
        var tip = inputs.tip.value;

        var ingredients = [];
        var amounts = [];
        var steps = [];

        var ingredientLines = inputs.recipeTableBody.children;
        var stepLines = inputs.recipeStepsTableBody.children;

        for( var ii = 0; ii < ingredientLines.length; ii++){

          var tempIng = ingredientLines[ii].children[0].innerHTML;
          var tempAmount = ingredientLines[ii].children[1].innerHTML;

          tempIng = tempIng.replace(/&nbsp;/g, " ");
          tempAmount = tempAmount.replace(/&nbsp;/g, " ");

          ingredients.push(tempIng);
          amounts.push(tempAmount);
        };

        for( var ii = 0; ii < stepLines.length; ii++){

          var tempStep = stepLines[ii].children[0].innerHTML;

          tempStep = tempStep.replace(/&nbsp;/g, " ");
          steps.push(tempStep);
        };

        var recipeObj = { text: name,
                          file: filename,
                          portions: portions,
                          class: "recipe",
                          indent: true,
                          image: 'glyphicon glyphicon-file',
                          preparationTimeHours: prepHours,
                          preparationTimeMins: prepMins,
                          cookingTimeHours: cookHours,
                          cookingTimeMins: cookMins,
                          cookingTemperature: cookTemp,
                          amounts: amounts,
                          ingredients: ingredients,
                          steps: steps,
                          suggestion: suggestion,
                          tip: tip
                        };

        if( this.savingMode ) {
          this.$emit("recipeAdded", recipeObj);
        } else {
          this.$emit("recipeEdited", recipeObj);
        };

        $('#addRecipeModal').modal('hide')
      },

      loadRecipe(recipeObj){
        console.log("Loading recipe info")

        $(this.$refs.recipeTableBody).empty();
        $(this.$refs.recipeStepsTableBody).empty();

        console.log(recipeObj)

        var refs = this.$refs;
        refs.recipeName.value = recipeObj.text;

        refs.portions.value = recipeObj.portions;

        refs.prepHours.value = recipeObj.preparationTimeHours;
        refs.prepMins.value = recipeObj.preparationTimeMins;

        refs.cookHours.value = recipeObj.cookingTimeHours;
        refs.cookMins.value = recipeObj.cookingTimeMins;
        refs.cookTemp.value = recipeObj.cookingTemperature;

        refs.suggestion.value = recipeObj.suggestion;
        refs.tip.value = recipeObj.tip;

        var ingredients = recipeObj.ingredients;
        var amounts = recipeObj.amounts;
        var steps = recipeObj.steps;

        for(var ii = 0; ii < ingredients.length; ii++){

          var tempIng = ingredients[ii];
          this.addRecipeLine( "", ingredients[ii], amounts[ii]);
        };

        for(var ii = 0; ii < steps.length; ii++){

          var tempStep = steps[ii];
          this.addRecipeStepLine( "", tempStep);
        };

      },

      clearRecipe() {
        console.log("Clearing recipe inputs")

        $(this.$refs.recipeTableBody).empty();
        $(this.$refs.recipeStepsTableBody).empty();

        var refs = this.$refs;
        refs.recipeName.value = "";

        refs.portions.value = "";

        refs.prepHours.value = "";
        refs.prepMins.value = "";

        refs.cookHours.value = "";
        refs.cookMins.value = "";
        refs.cookTemp.value = "";

        refs.suggestion.value = "";
        refs.tip.value = "";
      }

    },

    mounted: function() {
    }
  }
</script>

<style>
  .modal-content {
    border-radius: 0px!important;
    border-color: #9a1b52!important;
    border: 2px solid #9a1b52!important;
    background-color: #9a1b52;
    margin-left: 5px;
  }

  .btn-recipe, .btn-cancel {
    border-radius: 0px!important;
  }

  .table-add {
    float: center;
    font-size: 15px;
  }

  .glyphicon-plus, .glyphicon-arrow-up, .glyphicon-arrow-down  {
    color: #9a1b52!important
  }

  #tipTextArea {
    border-radius: 0px;
  }

  #recipeNameInput {
    border-radius: 0px;
  }

  .less-margin-bottom {
    padding-bottom: 0px;
  }

  .form-control {
    border-radius: 0px!important;
  }

  .no-margin-bot {
    margin-bottom: 1px!important;
  }

  .col-form-label {
    display: block;
    text-align: center;
    line-height: 250%;
  }

</style>
