const express = require('express');
const fs = require('fs');
const app = express();


app.use((req, res, next) => {
// write your logging code here

    var agent = req.headers['user-agent'];
    var newDate = new Date();
    var time = newDate.toISOString();
    var method = req.method;
    var resource = '/';
    var version = req.httpVersion;
    var status = 200;

    var logObject = agent.replace(/,/g, '') + ',' + time + ',' + method + ',' + resource + ',' + 'HTTP/' + version + ',' + status;

    fs.appendFile('log.csv', "\n" + logObject, function(err) {
        if (err) throw err;
    });

    console.log(logObject);

    next();

});

app.get('/', (req, res) => {
// write your code to respond "ok" here
    res.send('ok');
    
});

app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here
    
    fs.readFile('log.csv', 'utf8', (err, data) => {
        
        if (err) res.status(500).send(err.message); // use this instead of THROW, throw will shut down express
        
        
        // going to hold all data objects
        var dataArray = [];

        // an array of lines
        var linesArray = data.split('\n');

        // removes header line
        linesArray.shift();

        // loop through each line
        linesArray.forEach( function (line){
            
            // an array of values
            var valuesArray = line.split(',');
            
        
            // an object that holds the log information
            var dataObject = {
                "Agent" : valuesArray[0],
                "Time" : valuesArray[1],
                "Method" : valuesArray[2],
                "Resource" : valuesArray[3],
                "Version" : valuesArray[4],
                "Status" : valuesArray[5]
            }
                // data array holds all the data objects
            dataArray.push(dataObject);
                
        })

        res.json(dataArray);

    })
    
});


module.exports = app;