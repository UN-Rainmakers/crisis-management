var accountSid = 'ACf5e175f913bd96a8be7a9ddb3af7433f'; 
var authToken = 'c831c407d108bfb24c40096964bd7462'; 
 
var client = require('twilio')(accountSid, authToken); 
 
client.messages('[MessageSid]').get(function(err, message) { 
	console.log(message.body);  
	});
