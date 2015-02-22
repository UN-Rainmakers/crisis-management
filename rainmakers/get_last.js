module.exports = function (request, response) {

//var account_sid = 'ACf5e175f913bd96a8be7a9ddb3af7433f';
//var auth_token = 'c831c407d108bfb24c40096964bd7462';


// Joanne's token
var account_sid = 'AC0f2e76413be85bfc363359ea65ef9c98';
var auth_token = 'ebf41d784f99e4a0be4a2ae67aa36266';

var client = require('twilio')(account_sid, auth_token); 
client.messages.list({    
 }, function(err, data) { 
 	//defensive check
    if( data == 'undefined' || typeof data == 'undefined'){
      return;
    }
 	data.messages.forEach(function(message) { 
 		if(message.direction.match(/inbound/i)){
 			console.log(message.body);
 			response.send(message.body);
 			return;
 		}; 		
 	});	
});
};

