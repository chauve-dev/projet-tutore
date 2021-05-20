export default [
    {path: "*", controller: "authController", type: ['get', 'post'], exception: ['login']},
]