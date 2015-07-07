// Middleware de autorización de acceso HTTP restringido
exports.loginRequired = function(req, res, next){
  if (req.session.user){  // si el usuario está autenticado
    next();    // pasamos el control al siguiente middleware la ruta definida en routes/index.js
  }
  else {
    res.redirect('/login');
  }
}

// GET /login   -- formulario de login
exports.new = function (req, res) {
  // cargo los errores ocurridos o los inicializo caso de no haber error
  var sessionErrors = req.session.errors || {};
  req.session.errors = {};  // inicializo la captura de errores para la próxima transacción

  res.render('sessions/new', {errors: sessionErrors});  // carga el formulario new session
};

// POST /login -- crear la sesión
exports.create = function(req, res) {
  var login = req.body.login;
  var password = req.body.password;

  var userController = require('./user_controller');
  userController.autenticar(login, password, function (error, user){
    if (error) { // si hay error retornamos mensajes de error de sesión
      req.session.error= [{"message": 'Se ha producido un error: '+error}];
      res.redirect("/login");
      return;
    }

    // si no hay error creo la sesión del usuario
    req.session.user = {id: user.id, username: user.username, ultimoAcceso: Date.now()};    // guardo los datos del usuario y la hora del último acceso
    res.redirect(req.session.redir.toString()); // redirect al path anterior al login
  });
};

// DELETE /logout -- Destruir sesión
exports.destroy = function (req,res) {
  delete req.session.user;
  res.redirect(req.session.redir.toString());  // redirect al path anterior al login
};