// Run with: node main.js inputfile accountinfo outputfile keyword

var toolset 	= require("toolset");
var _ 			= require("underscore");
var sleep 	    = require("sleep");
var newuser = require('./getnewuser.js');

var inputfile = process.argv[2];	// file of domains to parse 
var accountinfo = process.argv[3]; 	// file containing account names and passwords
var outputfile = process.argv[4];	// file to output to
var keyword = process.argv[5];		// keyword that will be searched for in the domainnames


// Function that queries WhoisXML api to get information on the domainname
function lookupName(domain, usrn, pw, callback) {
	
	// Construct the url that returns info on the domain
	var url = "http://www.whoisxmlapi.com/whoisserver/WhoisService?domainName="+domain+"&outputFormat=json&username=" + usrn + "&password=" + pw;

	toolset.file.read(url, function(xx) {
		callback(xx);
	});
}


function main() {

	toolset.file.read(inputfile, function(response) {
		
		// Split the inputfile into lines
		var lines = response.split("\n");
		
		// Create a process stack
		var stack = new toolset.stack();
		
		// Empty string to start the file
		var filestart = "";

		// Create/begin to write to output file
		toolset.file.write(outputfile, filestart, function() {
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

						stack.add(function(params, cb){
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
														toolset.file.append(outputfile, output, function() {
																console.log("continuing");
																cb();
														});
													} else {
														cb();
													}
												}
												catch(e) {
													console.log("error: ", e);
													cb();
												}
											});
										} else {
											cb();
										}
									});	
								} 
								catch (e) {
									cb();
							}							
							//cb();
						});
					}
				}
			}
		});
		
		// Process the stack and print "finished" when done	
		stack.process(function() {
			console.log("finished");
		}, false);
		
	});
}

main();
