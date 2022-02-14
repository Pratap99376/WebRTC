
    var WebSocket = require('ws').Server;
    var wss = new WebSocket({port: 8000});
    //Global
    var users = [],members = [],main = {};
    wss.on("connection",(connection) => {
        connection.on("message",(message) => {
            var data = JSON.parse(message); 
            switch(data.type){
            	case "login":
            		if(users.indexOf(data.name) == -1){
            			members.push(data.name);
            			users.push(data.name);
            			users.push(connection);
            			connection.send(JSON.stringify({type:"1"}));
            		}
            		else{
            			connection.send(JSON.stringify({type:"2"}));
            		}
            		break;
            	case "data":
            		connection.send(JSON.stringify({
            			type:"data",
            			result:members
            		}));
            		break;
            	case "vibrate":
            		for(i = 0;i < users.length;i++){
            			if(users[i] == data.name){
            				users[i + 1].send(JSON.stringify({type:"v"}));
            				break;
            			}
            		}
                    break;
                case "offer":
                    for(k = 0;k < users.length;k++){
                        if(users[k] == data.name){
                            if(users[k + 1]){
                                users[k + 1].send(JSON.stringify({
                                    type:"offer",
                                    offer:data.offer
                                }));
                            }
                            break;
                        }
                    }
                    break;
                case "main":
                    main = connection;
                    break;
                case "answer":
                   if(main){
                    main.send(JSON.stringify({
                        type:"answer",
                        answer:data.answer
                    }));
                   }
                   break;
                case "candidate":
                    console.log("candidate");
                    if(data.name){
                        for(k = 0;k < users.length;k++){
                        if(users[k] == data.name){
                            if(users[k + 1]){
                                users[k + 1].send(JSON.stringify({
                                    type:"candidate",
                                    candidate:data.candidate
                                }));
                            }
                            break;
                          }
                        }
                    }
                    else{
                        main.send(JSON.stringify({
                            type:"candidate",
                            candidate:data.candidate
                        }));
                    }
            } 
        });
    });