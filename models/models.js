var path = require('path');

/* Los formatos de la base de dato cuando trabajamos en heroku (Postgres)
 * y cuando trabajamos en local (Sqlite) es:
 * Postgres DATABASE_URL = postgres://user:passwd@host:port/database
 * Sqlite DATABASE_URL = sqlite://:@:/
 */
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name	= (url[6]||null);
var user	= (url[2]||null);
var pwd		= (url[3]||null);
var protocol= (url[1]||null);
var dialect	= (url[1]||null);
var port	= (url[5]||null);
var host	= (url[4]||null);
var storage	= process.env.DATABASE_STORAGE;

// Cargo el modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite
var sequelize = new Sequelize (DB_name, user, pwd,
	{dialect: dialect,
	 protocol: protocol,
	 port: port,
	 host: host,
	 storage: storage,	// solo SQLite .env
	 omitNull: true		// solo Postgres
	});

// Importar la definición de la tabla Quiz de quiz.js
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

// Importar la definición de la tabla Comment de comment.js
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

// Para indicar que la relación quiz--comment es 1:N
// Esta manera de relacionar las tablas hace que se cree un campo QuizId en la tabla Comment que será la foreign key.
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz;		// exportar tabla Quiz
exports.Comment = Comment;

// creo e inicializo la tabla de preguntas en DB
sequelize.sync().then(function() {
	Quiz.count().then(function(count){
		if (count === 0) {
			Quiz.create({
				pregunta: 'Capital de Italia',
				respuesta: 'Roma',
				tema: 'humanidades'
			});
			Quiz.create({
				pregunta: 'Capital de Portugal',
				respuesta: 'Lisboa',
				tema: 'humanidades'			
			});
			Quiz.create({
				pregunta: 'En que año se descubrió el ADN',
				respuesta: '1869',
				tema: 'ciencia'		
			});
			Quiz.create({
				pregunta: 'Quién fue el premio Nobel de Medicina en 1906',
				respuesta: 'Santiago Ramón y Cajal',
				tema: 'ciencia'		
			});
			Quiz.create({
				pregunta: 'Cuántos bytes tiene 1 Kilobyte',
				respuesta: '1024',
				tema: 'tecnologia'		
			})		
			.then(function(){console.log('Base de datos inicio')});
		};
	});
});