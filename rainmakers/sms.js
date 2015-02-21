//Reads twilio sms list, publishes to database and sends an sms response if needed

// Twilio Credentials 
var account_sid = 'AC0f2e76413be85bfc363359ea65ef9c98'; 
var auth_token = 'ebf41d784f99e4a0be4a2ae67aa36266'; 
 
//require the Twilio module and create a REST client 
var client = require('../lib')(account_sid, auth_token); 
var request = require('request');
var querystring = require('querystring');
var http = require('http');
var twilioNum = "+441133201084";
var groups = {};

var options = {
        host: 'un-rainmakers.winder.nom.za',
        port: 80,
        path: '/api/Report',
        method: 'POST'
    };

client.messages.list({    
}, function(err, data) { 
    data.messages.forEach(function(message) { 

        var elapsed = Date.now() - Date.parse(message.dateSent);

        to = message.to;
        from = message.from;

        //group by numbers, assume the twilio API returns the latest one first
        if(to != twilioNum){
            if(!(to in groups)) {
                groups[ to ] = message;
            }
        }
        else{
            if(!(from in groups)){
                groups[ from ]= message;
            }
        }

        //send request to persist in silverstripe database
        var data = JSON.stringify({
              Incedent: message.body,
              MessageID: message.sid
            });

         var req = http.request(options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                //console.log("body: " + chunk);
            });
         });

         req.write(data);
         req.end();
    }); 

    //parse the messages and see if a response sms is required
    for (var key in groups) {
       var message = groups[key];
       console.log(message.direction);
       if(message.direction.match(/inbound/i)){
            console.log( "Attempting to reply");

            if(message.body.match(/good/i)){
                var response = "Thank you!!";
            }
            else if(message.body.match(/bad/i)){
                var response = "We are sorry";
            }
            client.messages.create({
                body: response,
                to: key,
                from: twilioNum,
            }, function(err, message) {
                process.stdout.write(err);
            });
       }
       else{
            console.log( "Already replied");
       }
    }
});


