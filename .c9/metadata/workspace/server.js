{"changed":true,"filter":false,"title":"server.js","tooltip":"/server.js","value":"//module.exports = {app,http,io};\n//var fs = require('fs');\n\n\n//fs.readFileSync('socketIO.js');\n\nvar app = require('express')();\nvar http = require('http').Server(app);\nvar io = require('socket.io')(http);\nvar path = require(\"path\");\nvar cookieParser = require('cookie-parser');\nvar bodyParser = require('body-parser');\nvar util = require('util');\n\nvar smsApi=require('./sms-api');\nvar DAL = require(\"./firebaseDB\");\nvar BL = require(\"./BL\");\n\napp.use(bodyParser.json());\napp.use(bodyParser.urlencoded({\n  extended: true\n}));\n\napp.use(cookieParser());\n\n/////////////////////////////\nvar DataBase={};\nvar connectedClients=[];\n\nio.on('connection', function(socket){\n\n  console.log('a user connected');\n    \n     socket.on('identify', function(user_phone_number){\n       var exist=false;\n       for(var i=0;i<connectedClients.length;i++)\n     {\n       if(connectedClients[i].key==user_phone_number)\n       {\n         connectedClients[i].value = socket.id;\n         exist = true;\n       }\n     }\n     if(!exist)\n     connectedClients.push({key:user_phone_number,value:socket.id});\n\n    console.log('I am '+user_phone_number);\n    socket.emit('identified');\n  });\n\n  socket.on('disconnect',function(){\n    \n     for(var i=0;i<connectedClients.length;i++)\n     {\n       if(connectedClients[i].value==socket.id)\n       {\n         connectedClients[i].key = null;\n       }\n     }\n    \n    connectedClients[connectedClients.indexOf(socket.id)]=null;\n  });\n  socket.on('MiniRegister', function(user_phone_number/*,callback*/){\n    var phone_nember_exist = false;\n     DAL.getUserByPhoneNumber(user_phone_number).then(function(user) {\n        socket.emit('UserPhoneNumberExists');\n    },function(){\n      \n    \n        connectedClients.push({key:user_phone_number,value:socket.id});\n        \n        var sms_code = Math.floor((Math.random() * 10000) + 1001);\n            var miniuser={\n            user_phone_number:user_phone_number,\n            sms_code:sms_code,\n            current_socket_id:socket.id\n        };\n        \n        DAL.miniRegister(miniuser,function(success){\n          // if(typeof callback ==='function')\n           //{\n             if(success){\n               //callback(user);\n               smsApi.sendSms(user_phone_number,sms_code);\n               socket.emit(\"MiniRegisterSuccess\");\n             }\n             else{\n               //callback();\n               //socket.emit(\"MiniRegisterFaild\")\n             }\n           //}\n          \n        }) \n    \n    })\n  });\n  \n  socket.on('ConfirmSmsCode',function(code,user_phone_number){\n    DAL.getMiniUserByPhoneNumber(user_phone_number,function(tempUser){\n      if(tempUser){\n        if(code==tempUser.sms_code){\n          //console.log(\"emit \")\n            DAL.removeMiniUserByPhoneNumber(user_phone_number);\n            socket.emit(\"SmsCodeConfirmed\",BL.generateToken(tempUser));\n        }\n        else{\n        socket.emit('WrongCode');\n        }\n      }\n      \n    });\n    \n  });\n\n   /* socket.on('outgoingCall', function(to){\n      \n      var from=\"not set\";\n      for(var i = 0;i<connectedClients.length;i++){\n        if(connectedClients[i].value==socket.id){\n          from = connectedClients[i].key;\n        }\n      }\n            var to_socket=\"not set\";\n      for(var i = 0;i<connectedClients.length;i++){\n        if(connectedClients[i].key==to){\n          to_socket = connectedClients[i].value;\n        }\n      }\n      \n      DAL.getUserByPhoneNumber(from).then(function(user)\n      {//lHDKxa4VqBdVL3eJAAAC\n        io.to(to_socket).emit(\"incomingCall\",\"for lolz\");\n      });\n      \n      \n    \n  });*/\n  \n\n  socket.on('register', function(user_name){\n    DataBase[user_name] = socket.id;\n    console.log(user_name+' registered');\n  });\n  /*socket.on('ring', function(user_name){\n    io.to(DataBase[user_name]).emit('triggerRing');\n    console.log('ringing at '+user_name);\n  });*/\n\n\n\n  \n    socket.on('addcampain', function(campain){\n    DAL.addCampain(campain,function(allready_exists){\n      console.log(allready_exists? 'The campain is allredy exist!':\n                                    'Campaign succssesfuly added');\n    });\n  });\n  \n  \n  console.log('socket:' +socket.id);\n});\n\nvar allowCrossDomain = function(req, res, next) {\n  res.header('Access-Control-Allow-Origin', '*');\n  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');\n  res.header('Access-Control-Allow-Headers', 'Content-Type');\n\n  next();\n};\n\napp.use(allowCrossDomain);\n\napp.use('/', require('./routes/tokens-generator'));\napp.use('/', require('./routes/services'));\napp.use('/', require('./routes/DAL'));\n\napp.use('/', require('./routes/ofekService'));\n\n\n\napp.listen(3333);\nconsole.log('server is runing, listening on port 3333');\nhttp.listen(3000, function(){\n  console.log('sockets on :3000');\n});\n\n/*process.on('uncaughtException', function (err) {\n    console.error(err.stack);\n    console.log(\"Node NOT Exiting...\");\n});*/\n\n/*setTimeout(function () {  \n  util.puts('Throwing error now.');\n  throw new Error('User generated fault.');\n}, 5000);*/\nmodule.exports = io;","undoManager":{"mark":-2,"position":13,"stack":[[{"start":{"row":174,"column":38},"end":{"row":175,"column":0},"action":"insert","lines":["",""],"id":2}],[{"start":{"row":175,"column":0},"end":{"row":176,"column":0},"action":"insert","lines":["",""],"id":3}],[{"start":{"row":176,"column":0},"end":{"row":176,"column":43},"action":"insert","lines":["app.use('/', require('./routes/services'));"],"id":4}],[{"start":{"row":176,"column":31},"end":{"row":176,"column":39},"action":"remove","lines":["services"],"id":5},{"start":{"row":176,"column":31},"end":{"row":176,"column":32},"action":"insert","lines":["o"]}],[{"start":{"row":176,"column":32},"end":{"row":176,"column":33},"action":"insert","lines":["f"],"id":6}],[{"start":{"row":176,"column":33},"end":{"row":176,"column":34},"action":"insert","lines":["e"],"id":7}],[{"start":{"row":176,"column":34},"end":{"row":176,"column":35},"action":"insert","lines":["k"],"id":8}],[{"start":{"row":176,"column":35},"end":{"row":176,"column":36},"action":"insert","lines":["S"],"id":9}],[{"start":{"row":176,"column":36},"end":{"row":176,"column":37},"action":"insert","lines":["e"],"id":10}],[{"start":{"row":176,"column":37},"end":{"row":176,"column":38},"action":"insert","lines":["r"],"id":11}],[{"start":{"row":176,"column":38},"end":{"row":176,"column":39},"action":"insert","lines":["v"],"id":12}],[{"start":{"row":176,"column":39},"end":{"row":176,"column":40},"action":"insert","lines":["i"],"id":13}],[{"start":{"row":176,"column":40},"end":{"row":176,"column":41},"action":"insert","lines":["c"],"id":14}],[{"start":{"row":176,"column":41},"end":{"row":176,"column":42},"action":"insert","lines":["e"],"id":15}]]},"ace":{"folds":[],"customSyntax":"javascript","scrolltop":0,"scrollleft":0,"selection":{"start":{"row":26,"column":0},"end":{"row":27,"column":24},"isBackwards":true},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":0},"timestamp":1439709802784}