var whois = require('node-whois')
var _ = require("underscore");

// /^Registrant Name/

// /Registrant Email/

whois.lookup('tatersandtotsphotography.com', function(err, data) {
	// console.log(data)

	var lines = data.split("\n");

	var firstname;
	var email;

	_.each(lines, function(line) {
		console.log(data);

		if (/^Registrant Name: /.test(line)) {
			var stripline = line.replace(/Registrant Name: /, '');
			//console.log("stripline: " + stripline);
			var nameparts = stripline.split(" ");
			firstname = nameparts[0];
			//console.log(line);
		}		


		if (/^Registrant Email/.test(line)) {
			email = line.replace(/Registrant Email: /, '');

			//console.log(line);
		}

		
	});

	// console.log(firstname);
	// console.log(",");
	// console.log(email);
	// console.log(",");
    
})