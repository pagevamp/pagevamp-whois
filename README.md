# Pagevamp-whois
Pagevamp whois lookup for domains on specific keywords, generates CSV of registrant names and emails

## Installation 
	
1. You can install from git:

	```$ git clone https://github.com/pagevamp/pagevamp-whois```
	
	Or [download the zip](http://github.com/pagevamp/pagevamp-whois/zipball/master/)

2. Go to the folder, then install the dependencies in  terminal:
	
	```$ npm install```



## Usage

Run with:

	```$ node terminal.js inputfile accountsfile outputfile keyword```

inputfile:

- Must be csv with first field containing the domain and second field containing its recent change (“new” or “delete”).

- Example:
		domain0.com, new, 
		domain1.com, delete,
		domain2.com, new,

accountsfile:
- Must contain username and password on each line separated by a space. 
- Example:
		username0 password0
		username1 password1
		username2 password2

outputfile:
- The name of the file to output results to. 

keyword:
- The keyword to search for. 