/* Definición del módelo Quiz, es decir de nuestra trabla de preguntas quiz.
   Aquí sólo defino los campos pregunta y respuesta aunque la tabla real de la
   base de datos tendrá un campo clave id que aquí no utilizo
*/

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Quiz',
		{	pregunta: {
				type: DataTypes.STRING,
				validate: { notEmpty: {msg: " Falta pregunta"}}
			},
			respuesta: {
				type: DataTypes.STRING,
				validate: { notEmpty: {msg: " Falta respuesta"}}
			},
			tema: {
				type: DataTypes.STRING
			}
		});
}