const path = require("path");

module.exports = {

	mode: "development",
	
	entry:"./src/index.ts",

	output:{
		filename: "bundle.js",
		path:path.join(__dirname,"dist") 
	},

	devServer:{
		static:{
			directory: path.join(__dirname,"./dist"),
		}
	},

	devtool:"inline-source-map",
	
	module:{
		rules:[
			{test:/\.ts$/,loader:"ts-loader"},
			{test:/\.json$/,loader:"json-loader"}
		]
	},

	resolve :{
		extensions:[
			".ts",".js",".json",
		]
	}
};