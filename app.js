// app.js
const fs = require("fs").promises;
const path = require("path");
const getFilePaths = require("./getFilePaths.js");
const downloadFile = require("./downloadFile.js");
const unzipAll = require("./unzipAll.js");

// We use an IIFE because`await` can only work inside an `async` function.
(async () => {
  const sourceUrl =  "Generate your source Url from OS Data website...";

//Where to?
  const targetDir = "Where do you want the data to go...?";


  // // Await download and unzip:
  await downloadFile(sourceUrl, targetDir);
  await unzipAll(targetDir);

  // Now we have a directory with several subdirectories containing, among other files, .asc grids representing elevations of 50m raster cells.
  // Let's extract an array of all paths then filter .asc files in the NG grid square:
  let allPaths = getFilePaths(targetDir);
  let ascPaths = allPaths.filter(
    (filepath) =>
      path.parse(filepath).ext === ".asc" && filepath.includes("/ng/")
  );

  // We'll create a directory to hold our .asc files
  let ascTarget = path.resolve(targetDir, "asc_skye");
  await fs.mkdir(ascTarget);

  // Then loop through and copy each file into this ./asc folder
  for (let i = 0; i < ascPaths.length; i++) {
    let parsedpath = path.parse(ascPaths[i]);
    let target = path.resolve(ascTarget, parsedpath.base);
    await fs.copyFile(ascPaths[i], target);
    console.log("Copied", parsedpath.base);
  }

  console.log("Completed copying .asc files!");
})(); // <- Invoke the function immediately!