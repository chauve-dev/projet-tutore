import controllerMiddelware from "../../app/controllerMiddleware";

export default class authController extends controllerMiddelware{
    index(){
        if(this.session.isLogged) {
            this.next();
        } else {
            this.response.redirect("/login");
        }
    }
}