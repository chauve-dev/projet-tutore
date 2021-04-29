import {extension} from "../../app/extensionController";
import { spawn } from 'child_process';
import path from "path";
export default class simulationExtension extends extension {

    async before() {

    }

    async after() {

    }

    static runSimulation() {
        const p = spawn(path.join(__dirname, "bin", "simulator"));
        return p
    }
}
