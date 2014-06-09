var express		= require('express');
var router		= express.Router();
var toolset		= require("toolset");
var fs			= require('fs-extra');	//File System - for file manipulation

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'Express' });
});


// Get getdmains page to upload/enter fields
router.get('/getdmains', function(req, res) {
	res.render('getdmains',  {hello: "it is raining"} );
});


// Upload the files/form information
router.route('/upload').post(function (req, res, next) {
	console.log(req.body.keyword);
	console.log(req.files.inputFile.name);

	var fn = require("../process/getdmains");
	fn.process('./uploads/'+req.files.inputFile.name, './uploads/'+req.files.accountsFile.name, req.body.keyword, function(outputfile){
		res.render('done', {file: outputfile});
	});
		
});


// File available for download here
router.get('/download/outfiles/:filename', function(req, res){
	
	var file = req.params.filename;
	res.download('outfiles/' + file); // Set disposition and send it.
});


module.exports = router;
