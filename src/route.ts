export default [
    {path: "/", controller: "indexController", type: "get"},
    {path: "/icons", controller: "indexController::icons", type: "get"},
    {path: "/login", controller: "indexController::login", type: "get"},
    {path: "/maps", controller: "indexController::maps", type: "get"},
    {path: "/profile", controller: "indexController::profile", type: "get"},
    {path: "/register", controller: "indexController::register", type: "get"},
    {path: "/reset-password", controller: "indexController::resetpassword", type: "get"},
    {path: "/tables", controller: "indexController::tables", type: "get"},
    {path: "/simulation", controller: "indexController::simulation", type: "get"}
]
