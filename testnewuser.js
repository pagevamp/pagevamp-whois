var newuser = require('./getnewuser.js');
var toolset = require('toolset');

newuser.getuserinfo("passwords.txt", function(response){
	if (response){
		toolset.log("received username and password:", response);
		toolset.log("username:", response.username);
		toolset.log("password:", response.password);
	}
});