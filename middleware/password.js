const passwordValidator = require('password-validator');

const schemaValidator = new passwordValidator();

schemaValidator
.is().min(8)// Longeur minimum 8
.is().max(100)// longueur maximum 100
.has().uppercase()// Minimum une majuscule
.has().lowercase()// Minimum une minuscule
.has().digits() // Doit avoir un number
.has().not().spaces() //Pas d'espace
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist


module.exports = (req, res, next) => {
if (schemaValidator.validate(req.body.password)) {
    next();
}else{
    
     return res.status(400).json({error: `Doit contenir 8 caractères minimum, une majuscule et 1 nombre ${schemaValidator.validate('req.body.password', { list: true })}`});
}

}


