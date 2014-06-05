var request = require('request');
var toolset = require('toolset');
var _		= require('underscore');



//read from users file
// file should be
// username password
// username password
exports.getuserinfo = function(filename, callback) {

	toolset.file.read(filename, function(response) {
			// Split the files into lines
		var lines = response.split("\n");
		var valids = {};
		var stack = new toolset.stack();

		var user  = _.each(lines, function(line){
			
			var splitted = line.split(" ");
			var username = splitted[0],
				password = splitted[1];

			stack.add(function(params, cb){
				request('http://www.whoisxmlapi.com/accountServices.php?servicetype=accountbalance&username='+username+'&password='+password+'&output_format=json', function(error, response, body){
					if (!error && response.statusCode == 200){
						//console.log("body balance", body);
						body = JSON.parse(body);
						
						if (body.balance > 0){
							var toreturn = {"username": username, "password": password};
							valids = toreturn;
							stack.reset();
						}
					}

					cb();
				});
			});



		});
		
		stack.process(function () {
			callback(valids);
		});
		
		
			
	});
};