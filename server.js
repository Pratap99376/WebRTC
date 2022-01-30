var WebSocket = require('ws').Server;
    var wss = new WebSocket({port: 8000});
    var users = {};
    wss.on("connection",(connection) => {
    	connection.on("message",(message) => {
    		var data = JSON.parse(message);
    		switch(data.type){
    			case "login":
    				if(users[data.name]){
    					sendTo(connection,{
    						type:"login",
    						success:false
    					});
    				}
    				else{
    					users[data.name] = connection;
    					connection.name = data.name;
    					sendTo(connection,{
    						type:"login",
    						success:true
    					});
    				}
    				break;
    			case "candidate":
    				console.log("Sending candidate to");
    				var conn = users[data.name];
    				if(conn != null){
    					sendTo(conn,{
    						type:"candidate",
    						candidate:data.candidate
    					});
    				}
    				break;
    			case "offer":
    				var conn = users[data.name];
                    if(conn != null){
                        connection.othername = data.name;
                        sendTo(conn,{
                            type:"offer",
                            success:true,
                            offer:data.offer,
                            name:connection.name
                        });
                    }
                    else{
                        sendTo(connection,{
                            type:"offer",
                            success:false
                        });
                    }
    				break;
                case "answer":
                    var conn = users[data.name];
                    if(conn != null){
                        connection.othername = data.name;
                        sendTo(conn,{
                            type:"answer",
                            answer:data.answer
                        });
                    }
    		}
    	});
    });
    function sendTo(connection,data){
    	connection.send(JSON.stringify(data));
    } 