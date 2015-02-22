module.exports = {
  hello: function () {
setInterval(function() {

//Reads twilio sms list, publishes to database and sends an sms response if needed

// Twilio Credentials 
var account_sid = 'AC0f2e76413be85bfc363359ea65ef9c98'; 
var auth_token = 'ebf41d784f99e4a0be4a2ae67aa36266'; 
 
//require the Twilio module and create a REST client 
var client = require('twilio')(account_sid, auth_token); 
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

    //defensive check
    if( data == 'undefined' || typeof data == 'undefined'){
      return;
    }
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

        //LOCATION:pick a random location for now, as we only have UK country codes for text messages
        var rand = Math.floor(Math.random() * 6) + 1;
        if(rand == 1){
          var lat = "15.714"; var lon = "-1.384"; //Sudan
        } else if(rand == 2){
          var lat = "15.714"; var lon = "-1.384"; //Mali
        } else if(rand == 3){
            var lat = "-17.979";var lon = "-67.05"; //Bolivia
        } else if(rand == 4){
            var lat = "34.629";var lon = "75.87"; //Kashmir
        } else if(rand == 5){
            var lat = "36.194";var lon = "54.315"; //Iran 
        } else if(rand == 6){
            var lat = "-3.430";var lon = "17.377"; //Congo
        };

        //INCIDENTS:parse messages to populate incident in database
        if(message.body.match(/good/i) && message.body.match(/t/i)){
          var incident = "Good - Getting Things";
        } else if(message.body.match(/good/i) && message.body.match(/p/i)){
          var incident = "Good - People";
        }else if(message.body.match(/good/i) && message.body.match(/o/i)){
          var incident = "Good - Others";
        }else if(message.body.match(/bad/i) && message.body.match(/v/i)){
          var incident = "Bad - Violence";
        }else if(message.body.match(/bad/i) && message.body.match(/s/i)){
          var incident = "Bad - Sexual Misconduct";
        }else if(message.body.match(/bad/i) && message.body.match(/p/i)){
          var incident = "Bad - Broken Promise";
        }else if(message.body.match(/bad/i) && message.body.match(/c/i)){
          var incident = "Bad - Suspected Corruption";
        }else if(message.body.match(/bad/i) && message.body.match(/n/i)){
          var incident = "Bad - Insult";
        }else if(message.body.match(/bad/i) && message.body.match(/o/i)){
          var incident = "Bad - Others";
        }else{
          var incident = message.body;
        }

        //send request to persist in silverstripe database
        var data = JSON.stringify({
              Incedent: incident,
              MessageID: message.sid,
              Lon: lon,
              Lat: lat,
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
                var response = "Thank you for your response. We have noted your feedback. ";
                response = response.concat( "For safety reasons please delete this message now." );
            }
            else if(message.body.match(/bad/i)){
                var response = "We are sorry, your feedback is looked into with urgency. ";
                response = response.concat( "For safety reasons please delete this message now." );
            } else{
                var response = "Sorry, we are unable to understand your feedback. ";
                response = response.concat( "Please visit www.rainmakers.com/feedback for eligible SMS codes.");
            }

            client.messages.create({
                body: response,
                to: key,
                from: twilioNum,
            }, function(err, message) {
                process.stdout.write(message.sid);
            });
       }
       else{
            console.log( "Already replied");
       }
    }
});
console.log('Hello');
}, 2000);

       },
    };

