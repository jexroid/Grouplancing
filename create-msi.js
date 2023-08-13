const { MSICreator } = require("electron-wix-msi");
const path = require("path");

// Define the input and output directories
const APP_DIR = path.resolve(__dirname, "./dist/win-unpacked");
const OUT_DIR = path.resolve(__dirname, "./build");

// Instantiate the MSICreator
const msiCreator = new MSICreator({
  appDirectory: APP_DIR,
  outputDirectory: OUT_DIR,
  description: "this is a vpn application from grouplancing team made by amirreza farzan and alireza nobakht",
  exe: "GroupLancing",
  name: "AmirrezaFarzan",
  manufacturer: "Jexroid",
  version: "1.0.0",
});

// Create a .wxs template file
msiCreator.create().then(() => {
  // Compile the template to a .msi file
  msiCreator.compile();
});
