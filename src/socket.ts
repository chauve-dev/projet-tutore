import {Server} from "socket.io";
import instance from "./instance";
import simulationExtension from "./extensions/simulation/controller";

export default function(io: Server){
    io.sockets.on('connection', function(socket) {

        console.log('user as '+socket.id)

        socket.on('hello', () => {
            socket.emit("message", 'It works')
        })

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });

        socket.on('run-simulation', (data) => {
            var list: Array<any> = [];
            var sim = simulationExtension.runSimulation();
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
                socket.emit("simulation-result", list)
            })


        });

    });
}
