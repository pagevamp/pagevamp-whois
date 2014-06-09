// Run with: node main.js inputfile accountinfo outputfile keyword

var toolset		= require("toolset");
var _			= require("underscore");
var sleep		= require("sleep");
var newuser		= require('./process/getnewuser.js');
var dmains		= require('./process/getdmains.js');

var inputfile	= process.argv[2];	// file of domains to parse 
var accountinfo	= process.argv[3]; 	// file containing account names and passwords
var outputfile	= process.argv[4];	// file to output to
var keyword		= process.argv[5];	// keyword that will be searched for in the domainnames


// Function that queries WhoisXML api to get information on the domainname
function lookupName(domain, usrn, pw, callback) {
	
	// Construct the url that returns info on the domain
	var url = "http://www.whoisxmlapi.com/whoisserver/WhoisService?domainName="+domain+"&outputFormat=json&username=" + usrn + "&password=" + pw;

	toolset.file.read(url, function(xx) {
		callback(xx);
	});
}


/* 
* todo: Rewrite main() to call from process/getdmains.js 
* todo: ex) dmains.process(inputfile, accountinfo, outputfile, keyword)
*/
function main() {

	dmains.process(inputfile, accountinfo, outputfile, keyword, function(outputfile){
		// nothing here
	});

}

main();
