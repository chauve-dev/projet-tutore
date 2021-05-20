import controller from "../../app/controller";
import {auth} from "../../auth";
import crypto from "crypto";

export default class loginController extends controller{
    login(){
        this.response.render('pages/login');
    }

    doLogin(){
        const username = this.request.body.username
        const password =  crypto.createHash('sha256').update(this.request.body.password).digest('hex')

        if (auth.get(username) === password) {
            this.session.isLogged = true;
        }

        this.response.redirect("/")
    }

    logout() {
        this.session.isLogged = false;
        this.response.redirect("/")
    }

}