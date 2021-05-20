import * as crypto from "crypto";


let auth: Map<String, String>= new Map();
auth.set("admin@argon.com", crypto.createHash('sha256').update("secret").digest('hex'))

export {auth}