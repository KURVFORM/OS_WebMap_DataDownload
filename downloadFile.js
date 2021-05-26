const fs = require("fs-extra"); //replaced fs with fs-extra 
const path = require("path");
const axios = require("axios");
const extract = require("extract-zip");

/* ============================================================
Function: Uses Axios to download file as stream using Promise

/downloadFiles.js
============================================================ */
const download_file = (url, filename) =>
  axios({
    url,
    responseType: "stream"
  }).then(
    (response) =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(filename))
          .on("finish", () => resolve())
          .on("error", (e) => reject(e));
      })
  );

/* ============================================================
Download File

/downloadFiles.js
============================================================ */
async function downloadFile(url, targetdir) {

  try {

    //Create a timestamped backup of existing directory
    var tsdate = new Date().getDate();
    var tsmonth = new Date().getMonth()+1; //Add 1 as January starts at 0
    var tsyear = new Date().getFullYear();
    var tshours = new Date().getHours();
    var tsminutes = new Date().getMinutes();
    var tsseconds = new Date().getSeconds();
    let targetarchive = (targetdir + "_backup_" + tsdate + tsmonth + tsyear + "_" + tshours + tsminutes + tsseconds);

    await fs.copySync(targetdir, targetarchive) 
    console.log("Creating previous files back up ..."); 

    // Remove previous directory folder of old info
    fs.rmdirSync(targetdir, {recursive: true})
    console.log("Removing previous files ...");

    // Giving user ongoing feedback in the terminal:
    console.log("Download starting ...");
    let interval = setInterval(() => console.log("..."), 5000);

    let targetfile = path.resolve(targetdir + ".zip");

    // Wait until the file is fully downloaded
    await download_file(url, targetfile);

    // Now make the target directory, extract the zipped file into it, and delete the downloaded zipfile.
    await fs.mkdirSync(targetdir);
    await extract(targetfile, { dir: path.resolve(targetdir)});
    await fs.unlinkSync(targetfile);

    // Complete!
    clearInterval(interval);
    console.log("Completed downloading files");
  } catch (error) {
    console.error(error);
  }
}

module.exports = downloadFile; // <- so we can import the function into another script