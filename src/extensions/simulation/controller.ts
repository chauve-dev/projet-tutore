import {extension} from "../../app/extensionController";
import { spawn } from 'child_process';
import path from "path";

export default class simulationExtension extends extension {

    async before() {

    }

    async after() {

    }

    static runSimulation(h: number, w: number, pm: number, pi: number, pd: number) {
        const process = spawn(
            path.join(__dirname, "bin", "simulator.exe"),
            [
                "h", h.toString(),
                "w", w.toString(),
                "pm", pm.toString(),
                "pi", pi.toString(),
                "pd", pd.toString()
            ]);
        return process
    }
}
