/* Definición del módelo Quiz, es decir de nuestra trabla de preguntas quiz.
   Aquí sólo defino los campos pregunta y respuesta aunque la tabla real de la
   base de datos tendrá un campo clave id que aquí no utilizo
*/

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Quiz',
		{	pregunta: DataTypes.STRING,
			respuesta: DataTypes.STRING,
		});
}