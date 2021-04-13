import controller from "../../app/controller";
import simulationExtension from "../../extensions/simulation/controller";

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

    simulation(){
        simulationExtension.runSimulation(1, 1, 1, 1, 1).stdout.on('data', (data) => {
            console.log(data.toString());
            try {
                data = JSON.parse(data.toString())
                this.response.json(data)
            }catch (e) {
                console.log(e);
            }
        })
    }
}
