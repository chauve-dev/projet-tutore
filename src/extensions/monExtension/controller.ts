import {extension} from "../../app/extensionController";
import { Application, Request, Response } from "express";
import { spawn } from 'child_process';
import instance from "../../instance";

export default class monExtension extends extension {

    async before() {
        console.log("before")
        this.application.get('/extension', (req: Request, res: Response) => {
            res.send("ok");
        })

        let variable: string | undefined;
    }

    async after() {
        console.log("after")
    }

}