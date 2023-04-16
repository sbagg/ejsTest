const fs = require('fs');
let ejs = require('ejs');

  /**
   * @description Main function that runs ejs schema site creation 
   */
    function main() {
        let tempRoot = "./temp_site/"
        let indexFolder = './';
        let schemasFolder = './_schemas/';
        let contextFolder = './_contexts/';
        let folders = [indexFolder, schemasFolder, contextFolder]

        for(let folder of folders){
            fs.readdirSync(folder).forEach(file => {
                let md = '';
                let md_path = '';
                let md_name = '';
                let ejsFile = '';
                let htmlFile = '';
                let typeCollection = '';
                let viewsFolder = "./views/pages/";
                let CollectionPath = "https://ucd-library.github.io/schema/";
                
                /* Create the following items:
                    * temp directory, 
                    * collection path variable, 
                    * ejsFile variable, 
                    * html output variable, 
                    * md variable
                */
                const regex = /\.md/g;
                if(file.match(regex)) {
                    md = folder + file;
                    md_name = file.split(".md")[0];
                    if(!indexFolder.includes(folder) ){
                        fldr = folder.split("./");
                        fs.mkdirSync(tempRoot + fldr[1] + md_name,{recursive: true});
                        htmlFile = tempRoot + fldr[1] + md_name + "/index.html";
                        if(folder.includes("/_schemas")) {
                            typeCollection = "schemas";
                            md_path = CollectionPath + "_" + typeCollection + "/" + md_name;
                            ejsFile = viewsFolder + fldr[1] + "article.ejs";
                        }else if(folder.includes("/_contexts")) {
                            typeCollection = "contexts";
                            md_path = CollectionPath + "_" + typeCollection + "/" + md_name;
                            ejsFile = viewsFolder + fldr[1] + "contexts.ejs";
                        }
                    } else {
                        htmlFile = tempRoot + "./" + md_name + ".html";
                        fldr = folder.split("./");
                        ejsFile = viewsFolder + fldr[1] + md_name + ".ejs";
                    }
                }

                //If there is an md file created, it goes to the next prompt, otherwise skipped
                if (md != "") {
                    if(typeCollection != '') createCollection(typeCollection, tempRoot, md_name, md_path);
                    addMarkdown(md, ejsFile, htmlFile);
                }    
            });
        }

        //contexts collection htmlFile then removes temp file
        let schemaEJS = "./views/pages/_schemas/article.ejs";
        let contextsEJS = "./views/pages/_contexts/contexts.ejs";
        addMarkdown(tempRoot + "temp_contexts_collection.md", 
                    contextsEJS, 
                    tempRoot + "_contexts/index.html");
        fs.unlinkSync(tempRoot + "temp_contexts_collection.md");

        //schemas collection htmlFile
        addMarkdown(tempRoot + "temp_schemas_collection.md", 
                    schemaEJS, 
                    tempRoot + "_schemas/index.html");
        fs.unlinkSync(tempRoot + "temp_schemas_collection.md");

    }

  /**
   * @description Adds the cooresponding markdown file to the ejs file and outputs HTML
   * @param {String} md - Markdown file path
   * @param {String} ejsFile - EJS file path
   * @param {String} htmlFile - Output HTML file path
   */
    function addMarkdown(md, ejsFile, htmlFile){
        fs.readFile(md, (err, inputD) => {
            if (err) throw err;
            let mdRead = inputD.toString()
        
            ejs.renderFile(ejsFile, {markdown: mdRead}, function(err, str){
            fs.appendFile(htmlFile, str, function (err) {
                    if (err) throw err;
                    console.log('Created...' + htmlFile);
                });
            });
        })
    }


  /**
   * @description Creates the collection pages for the site for all markdown files
   * @param {String} typeCollection - Schemas/Contexts collection folder
   * @param {String} tempRoot - Initial Temporary file path
   * @param {String} md_name - Collection Markdown Name
   * @param {String} md_path - Collection Markdown file paths
   */
    function createCollection(typeCollection, tempRoot, md_name, md_path){
        let cFile = "";
        if(typeCollection == "schemas") cFile = tempRoot + "temp_schemas_collection.md";
        else if(typeCollection == "contexts") cFile = tempRoot + "temp_contexts_collection.md";
        let cContent = '###### [' + md_name + '](' + md_path + ')\n';
        fs.appendFile(cFile, cContent, function (err) {
            if (err) throw err;
            console.log('Collection Line added to: ' + cFile);

        });
    }


if (require.main === module) {
  main();
}    
