var toolset		= require("toolset");
var _			= require("underscore");
var newuser		= require('./getnewuser.js');
var fs			= require('fs-extra');

// Function that queries WhoisXML api to get information on the domainname
function lookupName(domain, usrn, pw, callback) {
	
	// Construct the url that returns info on the domain
	var url = "http://www.whoisxmlapi.com/whoisserver/WhoisService?domainName="+domain+"&outputFormat=json&username=" + usrn + "&password=" + pw;

	toolset.file.read(url, function(xx) {
		callback(xx);
	});
}

exports.process = function(inputfile, accountinfo, outfile, keyword, renderpage) {
	var outputfile;
	if (outfile == null) {
		outputfile = Math.random().toString(36).slice(2) + ".csv";
	}
	else {
		outputfile = outfile;
	}
	console.log("OUTPUT :" + outputfile);
	//var outputfile = Math.random().toString(36).slice(2) + ".csv";

	console.log("inputfile: " + inputfile);
	console.log("accountinfo: " + accountinfo);
	console.log("keyword: " + keyword);

	toolset.file.read(inputfile, function(response) {
		
		// Split the inputfile into lines
		var lines = response.split("\n");
		
		// Create a process stack
		var stack = new toolset.stack();
		
		// Empty string to start the file
		var filestart = "";

		// Create/begin to write to output file
		toolset.file.write('./outfiles/'+outputfile, filestart, function() {
				console.log("start");
			});

		// Iterate through all the lines of the input file
		_.each(lines, function(line) {
			if (line.substr(0,1) == "#") {
				// skip the comments
			} else {

				//  Process each line into a different task
				var parts = line.split(",");

				// check if the domainname was newly acquired
				if (parts[1] == "new") {

					//check if domain contains keyword
					if (parts[0].indexOf(keyword) > -1){

						stack.add(function(params, heyimdone){
								try {
									// Retrieve information for an account with query balance
									newuser.getuserinfo(accountinfo, function(response){
										if (response){

											// query WhoisXML api for info on the domainname
											lookupName(parts[0], response.username, response.password, function(whoisReponse){
												
												// load info on domainname as JSON
												data = JSON.parse(whoisReponse);
												try {

													// Check that the name isn't "Registration Private"
													if (data.WhoisRecord.registrant.name != "Registration Private") {
														
														// Build string of information on domainname, name, email, , , ,
														var output = "";
														output += parts[0];
														output += ",";
														// Split name and print only the first name
														var nameparts = data.WhoisRecord.registrant.name.split(" ");
														output += nameparts[0];
														output += ",";
														output += data.WhoisRecord.registrant.email;
														output += ",";
														output += ",";
														output += ",";
														output += '\n';
														
														// Print string to a file
														toolset.file.append('./outfiles/'+outputfile, output, function() {
																console.log("continuing");
																heyimdone();
														});
													}else{
														console.log("continuing. found private");
														heyimdone();
													}
												}
												catch(e) {
													console.log("error: ", e);
													heyimdone();
												}
											});
										}else{
											heyimdone();
										}
									});
								}catch(e){
									heyimdone();
								}
							
						});
					}
				}
			}
		});
		
		toolset.log("stack:", stack.stack);

		// Process the stack and print "finished" when done	
		stack.process(function() {

			
			renderpage(outputfile);
		}, false);
		
	});

	

};