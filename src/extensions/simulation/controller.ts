import {extension} from "../../app/extensionController";
import { spawn } from 'child_process';
import path from "path";
import * as process from "process";

export default class simulationExtension extends extension {

    async before() {

    }

    async after() {

    }

    static runSimulation(h: number, w: number, pm: number, pi: number, pd: number) {
        const p = spawn(path.join(__dirname, "bin", "simulator"), ["h", h.toString(), "w", w.toString(), "pm", pm.toString(), "pi", pi.toString(), "pd", pd.toString()]);
        return p
    }
}
