var accountSid = 'ACf5e175f913bd96a8be7a9ddb3af7433f'; 
var authToken = 'c831c407d108bfb24c40096964bd7462'; 
 
var client = require('twilio')(accountSid, authToken); 
 
client.messages.list({    
 }, function(err, data) { 
 	data.messages.forEach(function(message) { 
 		 console.log(message.friendlyName); 
 		 	}); 
		 	});
