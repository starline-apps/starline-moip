var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');
AWS.config.update({region: 'us-east-1'});
var dynamodb = new AWS.DynamoDB();

module.exports = {
    update: function (req, res, next) {
        if (req.body != undefined){
            if (req.body.status_pagamento!= undefined && req.body.email_consumidor!= undefined){
                if (req.body.status_pagamento.toString()==="1"){
                    var params = {
                        TableName: 'Users',
                        Key: {
                            "UserEmail": {
                                "S": req.body.email_consumidor
                            }
                        },
                        AttributeUpdates: {
                            "IsSubscribed": {
                                Action: 'PUT',
                                Value: {
                                    N: '1'
                                }
                            }

                        },
                        ReturnValues: 'UPDATED_NEW'
                    };
                    dynamodb.updateItem(params, function(err, data) {
                        if (err){
                            console.log(err, err.stack); // an error occurred
                            res.send(401);
                        }
                        else{
                            console.log(data);           // successful response
                            res.send(200);
                        }
                    });
                }
            }
        }

    },
    get: function (req, res, next) {

        var params = {
            TableName : 'Users',
            Key : {
                "UserEmail" : {
                    "S" : req.params.email
                }
            }
        }
        dynamodb.getItem(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     res.json(data);           // successful response
        });
    },
  getActiveUsers : function(req, res, next){
    var arr = [];
    var lastWritten, interval;
    var now = Math.round(+new Date()/1000);
    dynamodb.scan({
      TableName : 'Users'
    }, function(err, data) {
      if (err) { console.log(err); return; }


      interval = 2628000;
      console.log( (now - interval));
      for (var ii in data.Items) {

        lastWritten = parseInt(data.Items[ii].LastWritten.N);

        if (lastWritten > (now - interval)){

          arr.push(data.Items[ii]);
        }


      }
      res.json(arr);
    });
  },
  getActiveUsersLength : function(req, res, next){
    var arr = [];
    var lastWritten, interval;
    var now = Math.round(+new Date()/1000);
    dynamodb.scan({
      TableName : 'Users'
    }, function(err, data) {
      if (err) { console.log(err); return; }
      var ctAll = 0;
      var ct = 0;
      interval = 2628000;
      console.log( (now - interval));
      for (var ii in data.Items) {

        lastWritten = parseInt(data.Items[ii].LastWritten.N);
        ctAll++;
        if (lastWritten > (now - interval)){

          arr.push(data.Items[ii]);
          ct++;
        }


      }
      res.json({all:ctAll, active:ct});
    });
  },
    update3s: function (req, res, next) {


        dynamodb.listTables({ "Limit": 12}, function(err, res) {
            if(err)
                console.log(err);
            else {
                console.log('ListTable from "test":');
                console.log(res);
            }
        });

    }

}
