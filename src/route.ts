export default [
    {path: "/", controller: "indexController", type: "get"},
    {path: "/login", controller: "loginController::login", type: "get"},
    {path: "/logout", controller: "loginController::logout", type: "get"},
    {path: "/login", controller: "loginController::doLogin", type: "post"},
    {path: "/histories", controller: "indexController::histories", type: "get"},
]
