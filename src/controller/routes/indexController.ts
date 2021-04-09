import controller from "../../app/controller";

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

    maps(){
        this.response.render('pages/maps');
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
}