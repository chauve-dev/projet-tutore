import {Server} from "socket.io";
import PouchDB from 'pouchdb';
import simulationExtension from "./extensions/simulation/controller";
import {val} from "objection";

export default function(io: Server){
    io.sockets.on('connection', function(socket) {

        console.log('user as '+socket.id)

        socket.on('hello', () => {
            socket.emit("message", 'It works')
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
                        id: value.id
                    })
                })
                socket.emit('simulationList', toSend)
            }).catch(function (err) {
                console.log(err);
            });
        })


        socket.on('run-simulation', (data) => {
            const list: Array<any> = [];
            const sim = simulationExtension.runSimulation();
            data.forEach((line: any) => {
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
                    date: Date.now().toString(),
                    sim: list
                });
                socket.emit("simulation-result", list)
            })


        });

    });
}
