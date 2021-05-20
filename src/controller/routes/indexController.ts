import controller from "../../app/controller";
import instance from "../../instance";

export default class indexContoller extends controller{
    index(){
        this.response.render('pages/dashboard');
    }

    icons(){
        this.response.render('pages/icons');
    }

    histories(){
        this.response.render('pages/histories');
    }

}
