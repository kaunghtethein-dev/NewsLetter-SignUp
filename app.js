const express = require('express');
const app = express();

const request = require('request');
const bodyParser = require('body-parser');
const https = require('https');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(request,response){
    response.sendFile(__dirname+"/signup.html");
})

app.post("/",function(request,response){
    var firstName = request.body.firstName;
    var lastName = request.body.lastName;
    var email = request.body.email;
    
    var data = {
        members: [
           {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
           }

        ]
    };
    var jsonData = JSON.stringify(data);

    var url = "https://us18.api.mailchimp.com/3.0/lists/58c19fd101";
    var options = {
        method: "POST",
        auth: "kaunghtethein:b7b9f336c58b6081ad6c34d71b528e8-us18"
    }

    const req = https.request(url,options,function(res){
        if(res.statusCode===200){
            response.sendFile(__dirname+"/success.html");
        }
        else {
            response.sendFile(__dirname+"/failure.html");
        }
        res.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })
    req.write(jsonData);
    req.end();
})

app.post("/failure",function(request,response){
    response.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000");
})