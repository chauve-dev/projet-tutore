import {Server} from "socket.io";
import PouchDB from 'pouchdb';
import simulationExtension from "./extensions/simulation/controller";

export default function(io: Server){
    io.sockets.on('connection', function(socket) {

        console.log('user as '+socket.id)

        socket.on('destroy', () => {
            new PouchDB('simulations').destroy()
        })

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });

        socket.on('getSimulationById', (id) => {
            const db = new PouchDB('simulations');
            db.get(id).then((obj) => {
                socket.emit("simulationById", obj)
            }).catch(() => {
                socket.emit("error", "Aucune simulation ne possède cet identifiant")
            })
        });

        socket.on('getSimulations', () => {
            const db = new PouchDB('simulations');
            db.allDocs({
                include_docs: true,
                attachments: true
            }).then(function (result) {
                var toSend: Array<any> = [];
                result.rows.forEach(value => {
                    toSend.push({
                        // @ts-ignore
                        date: value.doc.date,
                        id: value.id,
                        // @ts-ignore
                        name: value.doc.name
                    })
                })
                socket.emit('simulationList', toSend)
            }).catch(function (err) {
                console.log(err);
            });
        });

        socket.on('getLastSimulation', () => {
            const db = new PouchDB('simulations');
            db.allDocs({
                include_docs: true,
                attachments: true,
            }).then(function (result) {
                // @ts-ignore
                const sResult = result.rows.slice().sort((a, b) => b.doc.date - a.doc.date)
                db.get(sResult[1].id).then((obj) => {
                    socket.emit('lastSimulation', obj)
                }).catch(() => {
                    socket.emit("error", "Aucune simulation ne possède cet identifiant")
                });
            }).catch(function (err) {
                console.log(err);
            });
        });


        socket.on('run-simulation', (data) => {
            for(var i = 0; i < data.length; i++){
                var obj = data[i];
                for(var prop in obj){
                    if(obj.hasOwnProperty(prop) && obj[prop] !== null && !isNaN(obj[prop])){
                        obj[prop] = +obj[prop];
                    }
                }
            }
            const list: Array<any> = [];
            const sim = simulationExtension.runSimulation();
            var name = "";
            data.forEach((line: any) => {
                if("name" in line) name = line.name;
                sim.stdin.write(JSON.stringify(line));
            })
            sim.stdin.write(JSON.stringify({"endMesure":1}));
            sim.stdout.on('data', (data) => {
                try {
                    data = JSON.parse(data.toString())
                    list.push(data)
                }catch (e) {
                    console.log(e);
                }
            });


            sim.stdout.on("close", ()=> {
                const db = new PouchDB('simulations');
                db.post({
                    name: name,
                    date: Date.now().toString(),
                    sim: list
                }).then(data => {
                    console.log(data.id)
                });
                socket.emit("simulation-result", list)
            })


        });

    });
}
