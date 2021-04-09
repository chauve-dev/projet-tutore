import {Socket} from "socket.io";

export default class instance {

    private static _instance: instance;
    public data: any = {};
    io: Socket | undefined;

    public static getInstance()
    {
        if(instance._instance == undefined) {
            instance._instance = new instance();
            return instance._instance;
        }else{
            return instance._instance;
        }
    }
}
