const fs = require("fs");
// const {parse} = require("json2csv");
// const json2xls = require('json2xls');
const cheerio = require("cheerio");
const jsonexport = require("jsonexport");
require ('dotenv').config()
// const path = require("path");
// const {json2excel, excel2json} = require("js2excel");

// const DxfParser = require("dxf-parser");
// const pcheerio = require('pseudo-cheerio');

const currentPath = process.env.CURRENTPATH



fs.readdir(currentPath, {encoding: "utf8", withFileTypes: true}, function (
  err,
  files
) {
  Promise.all(
    files.map(async (file, index) => {
      if (file.isFile()) {
        return new Promise((resolve, reject) => {
          function readContent(callback) {
            fs.readFile(
              `${currentPath}` + "/" + `${file.name}`,
              "utf8",
              function (err, content) {
                if (err) reject(err);
                callback(null, content);

              }
            );
          }



          readContent(function (err, content) {

            const $ = cheerio.load(content);
            const svg = $("svg");
            const fileData =
              {
              filename: file.name,
              width: svg.attr("width"),
              height: svg.attr("height"),
            }

             resolve(([fileData].filter(item => item.width != "210mm")))


          });


        }).catch((error) => console.log({error}));
      }


    })

  ).then((content) => {
      jsonexport(content, function (err, csv) {
        if (err) return console.error(err);
        const writer = fs.createWriteStream("other-filtered-pictures.csv");

        writer.write(csv);
      });

    }).catch((error) => console.log({error}));
});




