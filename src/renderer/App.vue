<template>
  <div class="container">

    <div class="col-md-3 custom-col">
      <h3>Reseptit <button type="button" id="addRecipeButton" v-on:click="openRecipeMenu(true, $event)" class="btn btn-primary btn-add">+</button></h3>

      <draggable
        class="list-group"
        tag="ul"
        v-model="recipes"
        v-bind="dragOptions"
        @start="drag = true"
        @end="drag = false"
      >
        <transition-group type="transition" :name="!drag ? 'flip-list' : null">
          <li class="list-group-item" v-for="element in recipes" :key="element.order">
            <i :class="element.fixed ? 'fa fa-anchor' : element.image" @click="element.fixed = !element.fixed" aria-hidden="true"></i>
            {{ element.text }}
            <i class="glyphicon glyphicon-remove delete" v-on:click="deleteItem" aria-hidden="true"></i>
            <i class="glyphicon glyphicon-edit edit" v-on:click="openRecipeMenu(false, $event)" aria-hidden="true"></i>
          </li>
        </transition-group>
      </draggable>
    </div>
    <div class="col-md-3 custom-col">

      <h3>Rakenne
        <button type="button" id="addTopicButton" v-on:click="openTopicMenu" class="btn btn-primary btn-add">+</button>
        <button type="button" id="updateButton" v-on:click="updatePDF()" class="btn btn-primary btn-update"><i class="glyphicon glyphicon-refresh"></i></button>
        <button type="button" id="sortButton" v-on:click="sortAlphabetical()" class="btn btn-primary btn-sort"><i class="glyphicon glyphicon-font"></i></button>
      </h3>
      <draggable
        class="list-group"
        tag="ul"
        v-model="tableOfContents"
        v-bind="dragOptions"
        @start="drag = true"
        @end="drag = false"
      >
        <transition-group type="transition" :name="!drag ? 'flip-list' : null">
          <li class="list-group-item" v-for="element in tableOfContents" :key="element.order">
            <span v-if="element.indent">
              &nbsp &nbsp
            </span>
            <i :class="element.fixed ? 'fa fa-anchor' : element.image" @click="element.fixed = !element.fixed" aria-hidden="true"></i>
            {{ element.text }}
            <span v-if="element.indent">
              <i class="glyphicon glyphicon-remove delete" v-on:click="deleteItem" aria-hidden="true"></i>
              <i class="glyphicon glyphicon-edit edit" v-on:click="openRecipeMenu(false, $event)" aria-hidden="true"></i>
            </span>
            <span v-if="!element.indent">
              <i class="glyphicon glyphicon-remove delete" v-on:click="deleteItem" aria-hidden="true"></i>
            </span>
          </li>
        </transition-group>
      </draggable>
    </div>
    <div id="iframeDiv" class="col-md-6 custom-col-md-8">
      <PDFJSViewer ref="pdfViewer" :path="`${libPath}`" :fileName="`${filePath}`"/>
    </div>

    <!-- Modals -->
    <addRecipeModal ref="addRecipeModal" :id="'addRecipeModal'" v-on:recipeAdded="addRecipe" v-on:recipeEdited="editRecipe"></addRecipeModal>
    <addTopicModal  :id="'addTopicModal'" v-on:topicAdded="addTopic"></addTopicModal>
  </div>
</template>

<script>

const path = require('path');
const getAppDataPath = require("appdata-path");
var fs = require('fs');

import '@/assets/js/bootstrap.min.js'
import PDFJSViewer from '@/components/PDFJSViewer'
import draggable from "vuedraggable";
import addRecipeModal from "@/components/addRecipeModal.vue";
import addTopicModal from "@/components/addTopicModal.vue";
import cookbook from "@/assets/js/cookbook_latex.js";

export default {
  name: "Cookbook-maker",
  display: "Transitions",
  order: 1,
  components: {
    draggable, PDFJSViewer, addRecipeModal, addTopicModal
  },
  data() {
    return {

      recipes: [],
      tableOfContents: [],

      drag: false,
      recipes: [],

      counter: 1,

      editElement: {},

      libPath: __pdfViewerPath,
      filePath: path.join(__publicPath, `/ohje.pdf`),

      appDataPath: "",
      recipeFolderPath: "",
      recipesFileJSON: "",
      tocFileJSON: "",
    };
  },
  methods: {

    openRecipeMenu(savingMode, e) {
      console.log("Adding a recipe")

      this.$refs.addRecipeModal.savingMode = savingMode;

      if(savingMode){
        console.log("Starting a new recipe")
        this.$refs.addRecipeModal.clearRecipe();
      } else {

        var ul_recipes = e.path[3];
        var ul_toc = e.path[4];

        if( ul_recipes.nodeName == "UL" ){

          var li = e.path[1];
          var index = Array.prototype.indexOf.call( ul_recipes.childNodes[0].childNodes, li);

          this.editElement = { list: this.recipes, index: index, order: this.recipes[index].order};
        } else {

          var li = e.path[2];
          var index = Array.prototype.indexOf.call( ul_toc.childNodes[0].childNodes, li);

          this.editElement = { list: this.tableOfContents, index: index, order: this.tableOfContents[index].order};
        };

        console.log("Loading recipe to be edited")
        this.$refs.addRecipeModal.loadRecipe( this.editElement.list[index] );
      };

      $('#addRecipeModal').modal('show')
    },

    openTopicMenu() {
      console.log("Adding a topic");
      $('#addTopicModal').modal('show')
    },

    addRecipe(newRecipeObject) {

      this.counter = this.counter + 1;
      newRecipeObject.order = this.counter;
      this.recipes.push(newRecipeObject);

      this.saveJSON();
    },

    addTopic(newTopicObject) {
      console.log("Adding topic")

      this.counter = this.counter + 1;
      newTopicObject.order = this.counter;
      this.tableOfContents.push( newTopicObject );

      this.updateLists();
      this.saveJSON();
    },

    updatePDF() {
      console.log("Updating the PDF")
      var compilePDF = cookbook.createCookbookPDF(this.tableOfContents, this.recipeFolderPath);
      this.$refs.pdfViewer.updateFile(" ");

      compilePDF
      .then( result => {
        console.log(result)

        const pdfPath = path.join( this.recipeFolderPath, '/main.pdf');
        console.log( pdfPath )
        this.$refs.pdfViewer.updateFile(pdfPath);

        this.saveJSON();
      })
    },

    sortAlphabetical() {
      console.log("Sorting recipes under topics")
    },

    editRecipe(editedRecipeObject) {
      console.log("Editing a recipe")

      var listTemp = this.editElement.list;
      var index = this.editElement.index;

      editedRecipeObject.order = this.editElement.order;
      listTemp[index] = editedRecipeObject;

      this.saveJSON();
      this.$forceUpdate();
    },

    deleteItem(e) {
      console.log("Deleting a recipe")

      var ul_recipes = e.path[3];
      var ul_toc = e.path[4];

      if( ul_recipes.nodeName == "UL" ){

        var li = e.path[1];
        var index = Array.prototype.indexOf.call( ul_recipes.childNodes[0].childNodes, li);
        this.recipes.splice( index, 1);
      } else {

        var li = e.path[2];
        var index = Array.prototype.indexOf.call( ul_toc.childNodes[0].childNodes, li);
        this.tableOfContents.splice( index, 1);
      };

      this.saveJSON();
    },

    saveJSON() {

      const recipeListJSON = JSON.stringify( this.recipes, null, 2);
      const tocJSON = JSON.stringify( this.tableOfContents, null, 2);

      if (!fs.existsSync(this.appDataPath)) {
          fs.mkdirSync( this.appDataPath, { recursive: true });
      };

      if (!fs.existsSync(this.recipeFolderPath)) {
          fs.mkdirSync( this.recipeFolderPath, { recursive: true });
      };

      fs.writeFile( this.tocFileJSON, tocJSON, (err) => {
          if (err) throw err;
          console.log('TOC saved.');
      });

      fs.writeFile( this.recipesFileJSON, recipeListJSON, (err) => {
          if (err) throw err;
          console.log('Recipes saved.');
      });
    },

    updateLists(){

      var counter = this.counter;

      var nRecipes = this.recipes.length;
      var nContents = this.tableOfContents.length;

      for(var ii = 0; ii < nRecipes; ii++){

        this.recipes[ii].order = counter;
        counter++;
      };

      for(var ii = 0; ii < nContents; ii++){

        this.tableOfContents[ii].order = counter;
        counter++;
      };

      this.counter = counter;
    },
  },

  mounted: function(){

    var appDataPath = getAppDataPath("Cookbook-maker");

    this.appDataPath = appDataPath;
    this.recipeFolderPath = path.join( appDataPath, '/recipes' );
    this.recipesFileJSON = path.join( appDataPath, '/recipes.json');
    this.tocFileJSON = path.join( appDataPath, '/toc.json');

    var dataRecipes = fs.readFileSync( this.recipesFileJSON );
    var dataTOC = fs.readFileSync( this.tocFileJSON );

    console.log(this.libPath)

    this.recipes = JSON.parse(dataRecipes);
    this.tableOfContents = JSON.parse(dataTOC);

    this.updateLists();
  },

  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  }
};
</script>

<style>
  @import url('~@/assets/css/bootstrap.min.css');
  .button {
    margin-top: 35px;
  }
  .flip-list-move {
    transition: transform 0.5s;
  }
  .no-move {
    transition: transform 0s;
  }
  .ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }
  .list-group {
    min-height: 20px;
  }
  .list-group-item {
    cursor: move;
  }
  .list-group-item i {
    cursor: pointer;
  }

  body, html {
    height: 100%;
    overflow-y: hidden;
  }

  .container {
    padding: 2px;
    padding-bottom: 5px;
    margin: 0px;
    background: #9a1b52;
    width: 100%;
    height: 100%;
  }

  .custom-col {
    background: #ffffff;
    margin: 2px;
    height: 100%;
    overflow-y: scroll;
  }

  .custom-col-md-8 {
    background: #ffffff;
    margin: 2px;
    width: calc( 50% - 12px );
    height: 100%;
  }
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent; /* make scrollbar transparent */
  }
  .webviewer {
    width: 100%;
    height: 100%;
    padding: 5px;
  }

  .btn-add {
    border-radius: 0px;
    border-color: #9a1b52;
    background-color: #9a1b52;
  }

  .btn-update, .btn-sort {
    border-radius: 0px;
    border-color: #9a1b52;
    background-color: #9a1b52;
    float: right;
    margin-left: 5px;
  }

  .edit, .delete {
    float: right;
    color: #9a1b52
  }

  .delete {
      margin-left: 20px;
  }

  h3 {
      margin-bottom: 20px;
  }

  .btn-sort {
    visibility: hidden;
  }

  #iframeDiv {
    padding: 0px;
  }

</style>
