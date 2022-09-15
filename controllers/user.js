const User = require('../models/User')

const bcrypt = require('bcrypt');// me permet de crypter mes mots de passe 
const jwt = require('jsonwebtoken');// permet envoie le token a chaque requette au serveur pour verifier que cest bien la meme personne qui envoie la requette 

exports.signup = (req, res, next) => {
    console.log('signup request:', req.body)
    bcrypt.hash(req.body.password, 10) // hash prend le password et va le transformer
    .then(hash =>{
      const user = new User({ 
        email : req.body.email, 
        password : hash
    })
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })  
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email})// trouve lutilisateur dans base de donner qui a cette email
    .then(user => {
        if (user === null) {
            res.status(401).json({message: 'indentifiant ou mot de passe incorrect'})
        }else{
            bcrypt.compare(req.body.password, user.password) // si user trouver compare le mot de passe au hash du user
            .then(valid => {
                if (!valid) {
                    res.status(401).json({message: 'indentifiant ou mot de passe incorrect'})
                }else{
                    res.status(200).json({// si valide retourne le token 
                        userId: user._id,
                        token: jwt.sign(//méthode sign() utilise une clé secrète pour chiffrer un token qui peut contenir un payload personnalisé et avoir une validité limitée
                            {userId: user._id},
                            `${process.env.TOKEN}`,// key permet l'encryptage du token
                            {expiresIn: '24h'}
                        )
                    });
                }
            })
            .catch(error => {
                res.status(500).json({ error })
            })
        }
    })
    .catch(error=> {
        res.status(500).json( {error} );
    })
};
