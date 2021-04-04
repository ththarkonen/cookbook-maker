const Promise = require('promise');
const path = require('path');
var fs = require('fs');
const {spawn} = require('child_process');

const fractionRegExp = /[1-9][0-9]*\/[1-9][0-9]*/g;
const percentageRegExp = /(?<!\\)%/g;

module.exports = {

  createCookbookPDF( tocObjects, texPath){

    return new Promise(function (resolve, reject){

      console.log("Compiling the tex files...")

      var mainTex = createPreamble();

      console.log(mainTex)

      console.log(tocObjects)
      for(var ii = 0; ii < tocObjects.length; ii++){

        var tempItem = tocObjects[ii];
        console.log(tempItem);
        console.log(tempItem.class)

        if (tempItem.class == "topic") {
          mainTex += addSection(tempItem.text);
        } else if (tempItem.class == "recipe") {

          createRecipeFile( tempItem, texPath );
          mainTex += addRecipe(tempItem.file);
          mainTex += "\\clearpage\n";
        };



      }

      mainTex += "\\end{document}";

      const mainFilePath = path.join( texPath, '/main.tex');

      fs.writeFile( mainFilePath, mainTex, (err) => {
          if (err) throw err;
          console.log('main.tex created at ' + mainFilePath + '.');

          compileCookbookInit( texPath, mainFilePath, resolve, reject);
      });

    });

  },

}

function empty(placeholder){

}

function createPreamble() {

  var preambleStr = "\\documentclass[a4paper,11pt]{book}\n";
  preambleStr += "\\usepackage[finnish]{babel}\n";
  preambleStr += "\\usepackage[T1]{fontenc}\n";
  preambleStr += "\\usepackage[utf8]{inputenc}\n";
  preambleStr += "\\usepackage{lmodern}\n";
  preambleStr += "\\usepackage{nicefrac}\n";
  preambleStr += "\\usepackage[nowarnings]{xcookybooky}\n";
  preambleStr += "\\usepackage{calc}\n";
  preambleStr += "\\usepackage{pgf}\n";
  preambleStr += "\n";

  preambleStr += "\\newlength{\\parline}\n";
  preambleStr += "\\newlength{\\paroutindent}\n";
  preambleStr += "\\newlength{\\lineheight}\n";
  preambleStr += "\\setlength{\\lineheight}{\\heightof{abcdefghijklmnoprstuvwxyzåäö}}\n";
  preambleStr += "\n";

  preambleStr += "\\newcommand{\\countlines}[1]{%\n";
  preambleStr += "\\setlength{\\paroutindent}{\\expandafter\\parindent}\n";
  preambleStr += "\\setlength{\\parline}{\\heightof{\\noindent\\begin{minipage}{\\linewidth}%\n";
  preambleStr += "\\setlength{\\parindent}{\\paroutindent}\\hspace{2.5em}#1\\end{minipage}}}%\n";
  preambleStr += "\\pgfmathparse{int(round(\\parline / (0.9*\\lineheight)))}\n";
  preambleStr += "#1}\n";

  preambleStr += "\\newcommand{\\steptext}[1]{\\negthinspace\\negthinspace\\countlines{#1}{\\ifnum\\pgfmathresult<2 \\vspace{\\baselineskip}\\fi}}\n";

  preambleStr += "\\DeclareRobustCommand{\\textcelcius}{\\ensuremath{^{\\circ}\\mathrm{C}}}\n";
  preambleStr += "\\setcounter{secnumdepth}{0}\n";
  preambleStr += "\\renewcommand*{\\recipesection}[2][]{\\section[#1]{#2}}\n";
  preambleStr += "\\renewcommand{\\sectionmark}[1]{}\n";
  preambleStr += "\\newcommand{\\fakesection}[1]{\\par\\refstepcounter{chapter}\\chaptermark{#1}\\addcontentsline{toc}{chapter}{\\protect\\numberline{\\thechapter}#1}}\n";
  preambleStr += "\n";

  preambleStr += "\\usepackage{hyperref}";
  preambleStr += "\\hypersetup{";
  preambleStr += "pdfauthor = {Cookbook-maker},\n";
  preambleStr += "pdftitle = {Keittokirja},\n";
  preambleStr += "pdfsubject = {Keittokirja},\n";
  preambleStr += "pdfkeywords = {recipes, cookbook, reseptit, keittokirja},\n";
  preambleStr += "pdfstartview = {FitV},\n";
  preambleStr += "pdfview = {FitH},\n";
  preambleStr += "pdfpagemode = {UseNone},\n";
  preambleStr += "bookmarksopen = {true},\n";
  preambleStr += "pdfpagetransition = {Glitter},\n";
  preambleStr += "colorlinks = {true},\n";
  preambleStr += "linkcolor = {black},\n";
  preambleStr += "urlcolor = {blue},\n";
  preambleStr += "citecolor = {black},\n";
  preambleStr += "filecolor = {black},}\n";
  preambleStr += "\n";

  preambleStr += "\\hyphenpenalty=10000\n";
  preambleStr += "\\hbadness=10000 \n";
  preambleStr += "\n";

  preambleStr += "\\setHeadlines{\n";
  preambleStr += "inghead = Raaka-aineet,\n";
  preambleStr += "hinthead = ,\n";
  preambleStr += "prephead = Valmistus,\n";
  preambleStr += "continuationhead = ,\n";
  preambleStr += "continuationfoot = ,\n";
  preambleStr += "portionvalue = }\n";
  preambleStr += "\n";

  preambleStr += "\\renewcommand{\\step}\n";
  preambleStr += "{%\n";
  preambleStr += "\\stepcounter{step}\n";
  preambleStr += "\\lettrine\n";
  preambleStr += "[%\n";
  preambleStr += "lines=2,\n";
  preambleStr += "lhang=0,\n";
  preambleStr += "loversize=0.15,\n";
  preambleStr += "slope=0em,\n";
  preambleStr += "findent=1em,\n";
  preambleStr += "nindent=0em\n";
  preambleStr += "]{\\thestep}{}}\n";

  preambleStr += "\\begin{document}\n";

  preambleStr += "\\renewcommand{\\contentsname}{Sisällysluettelo}\n"
  preambleStr += "\\tableofcontents\n";
  preambleStr += "\\newpage\n";

  return preambleStr;
}

function addSection(sectionName) {

  return "\\fancyhead[LE,RO]{\\thechapter. \\MakeUppercase{" + sectionName + "}}\n \\fakesection{" + sectionName + "}\n";
}

function addRecipe(recipeFile) {

  return "\\input{" + recipeFile + "}";
}

function createRecipeFile( recipeObj, texPath ) {

  const ings = recipeObj.ingredients;
  const amounts = recipeObj.amounts;
  const steps = recipeObj.steps;

  const prepHoursExist = ( recipeObj.preparationTimeHours != 0 && recipeObj.preparationTimeHours != "" );
  const prepMinsExist = ( recipeObj.preparationTimeMins != 0 && recipeObj.preparationTimeMins != "" );
  const prepTimeExist = prepHoursExist || prepMinsExist;

  const cookHoursExist = ( recipeObj.cookingTimeHours != 0 && recipeObj.cookingTimeHours != "" );
  const cookMinsExist = ( recipeObj.cookingTimeMins != 0 && recipeObj.cookingTimeMins != "" );
  const temperatureExist = ( recipeObj.cookingTemperature != 0 && recipeObj.cookingTemperature != "" );
  const cookingTimeExist = cookHoursExist || cookMinsExist;

  const portionsExist = ( recipeObj.portions.trim() != "" );

  var str = "\\begin{recipe}[%\n";

  if( prepTimeExist ){
    str += "preparationtime = {";

    if( prepHoursExist ){
      str += "\\unit[" + recipeObj.preparationTimeHours.replace( percentageRegExp,"\\%") + "]{h} ";
    };

    if( prepMinsExist ){
      str += "\\unit[" + recipeObj.preparationTimeMins.replace( percentageRegExp,"\\%") + "]{min}";
    }

    str += "},\n";
  };

  if( cookingTimeExist ){

    str += "bakingtime = {";

    if( cookHoursExist ){
      str += "\\unit[" + recipeObj.cookingTimeHours.replace( percentageRegExp,"\\%") + "]{h} ";
    };

    if( cookMinsExist ){
      str += "\\unit[" + recipeObj.cookingTimeMins.replace( percentageRegExp,"\\%") + "]{min}";
    };

    str += "},\n";
  };

  if( temperatureExist ){
    str += "bakingtemperature = {\\unit[" + recipeObj.cookingTemperature.replace( percentageRegExp,"\\%") + "]{\\textcelcius}},\n";
  };

  if( portionsExist ){
    str += "portion = {\\portion{" + recipeObj.portions.replace( percentageRegExp,"\\%") + "}},";
  };

  str += "]\n";

  str += "{" + recipeObj.text.replace( percentageRegExp,"\\%") + "}\n";
  str += "\\ingredients{%\n";

  for(var ii = 0; ii < ings.length; ii++){

    const tempAmount = replaceFraction( amounts[ii] ).replace( percentageRegExp,"\\%");

    str += tempAmount + " & " + ings[ii].replace( percentageRegExp,"\\%") + "\\\\ \n";
  };

  str += "}\n";

  str += "\\preparation{%\n";

  for(var ii = 0; ii < steps.length; ii++){
    str += "\\step \\steptext{" + steps[ii].replace( percentageRegExp,"\\%") + "}\n";
  };

  str += "}\n";

  str += "\\suggestion{%\n";
  str += recipeObj.suggestion.replace( percentageRegExp,"\\%") + "\n";
  str += "}\n";

  str += "\\hint{%\n";
  str += "~" +recipeObj.tip.replace( percentageRegExp,"\\%") + "\n";
  str += "}\n";
  str += "\\end{recipe}";

  console.log(str)

  console.log(texPath)

  const filePath = path.join( texPath, recipeObj.file);
  fs.writeFileSync( filePath, str);
  console.log("Create recipe file: " + recipeObj.file);
}

function replaceFraction(str){

  const found = str.match(fractionRegExp);

  if( found != null ){

    const nums = found[0].split('/');
    const niceFrac = "\\!\\nicefrac{" + nums[0] + "}{" + nums[1] + "}";

    str = str.replace( fractionRegExp, niceFrac);
    return str;
  } else {
    return str;
  };
}

function compileCookbookInit( texPath, mainTexFilePath, resolve, reject ) {

  console.log("Compiling")
  var success = false;

  const options = { silent: true};
  var exeChild = spawn( 'pdflatex', ["-output-directory", texPath, mainTexFilePath], options );

  exeChild.stdout.on('data', function(data) {
    //console.log(data.toString());
  });

  exeChild.on('close', (code) => {
    console.log(code)
    if (code == 0) {
      compileCookbook( texPath, mainTexFilePath, resolve, reject )
    } else {
      reject(false);
    };
  });
}

function compileCookbook( texPath, mainTexFilePath, resolve, reject ) {

  var success = false;

  const options = { silent: true};
  var exeChild = spawn( 'pdflatex', ["-output-directory", texPath, mainTexFilePath], options );

  exeChild.stdout.on('data', function(data) {
    //console.log(data.toString());
  });

  exeChild.on('close', (code) => {
    console.log(code)
    if (code == 0) {
      resolve(true);
    } else {
      reject(false);
    };
  });
}
