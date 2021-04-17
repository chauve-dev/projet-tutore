import controller from "../../app/controller";
import instance from "../../instance";

export default class indexContoller extends controller{
    index(){
        this.response.render('pages/dashboard');
    }

    icons(){
        this.response.render('pages/icons');
    }

    login(){
        this.response.render('pages/login');
    }

    histories(){
        this.response.render('pages/histories');
    }

    profile(){
        this.response.render('pages/profile');
    }

    register(){
        this.response.render('pages/register');
    }

    resetpassword(){
        this.response.render('pages/reset-password');
    }

    tables(){
        this.response.render('pages/tables');
    }

    async simulation(){
        this.response.render("pages/simulation");
    }
}
