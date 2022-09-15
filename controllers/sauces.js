const fs = require('fs');
const Sauces = require('../models/Sauces');


exports.getAllsauces = (req, res, next) => {
  Sauces.find()
    .then((sauce) => { res.status(200).json(sauce); })
    .catch((error) => {
      res.status(400).json({ error: error });
    }
    );
}

exports.createSauces = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);//pour transformer en obj
   delete sauceObject._userId; //Supprime userId un nouvel identifiant va etre généré par MongoDB

  // console.log('sauce:', sauceObject);
  // console.log({body: req.body.sauce});
  // console.log({file: req.file});

  const sauce = new Sauces({ //sauce selon le schéma
    userId: req.auth.userId, //identifiant utilisateur du token
    name: sauceObject.name,
    manufacturer: sauceObject.manufacturer,
    description: sauceObject.description,
    mainPepper: sauceObject.mainPepper,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,// URL image
    heat: sauceObject.heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce.save()
    .then(() => {
      res.status(201).json({ message: 'Enregistrer' });
    }
    ).catch(
      (error) => {
        res.status(400).json({ error: error });
      }
    );
}

exports.getOneSauce = (req, res, next) => {
  Sauces.findOne({
    _id: req.params.id // récupère la sauce correspondant id de la requête
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
}


exports.modifySauce = (req, res, next) => {
  
  const sauceObjectVariable =  req.file ? { //si contient un fichier objetvariable pour nouvelle sauce 
    userId: req.auth.userId,
    name: JSON.parse(req.body.sauce).name,
    manufacturer: JSON.parse(req.body.sauce).manufacturer,
    description: JSON.parse(req.body.sauce).description,
    mainPepper: JSON.parse(req.body.sauce).mainPepper,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    heat: JSON.parse(req.body.sauce).heat,
  } : {
    name: req.body.name,
    manufacturer: req.body.manufacturer,
    description: req.body.description,
    mainPepper: req.body.mainPepper,
    image: req.body.imageUrl,
    heat: req.body.heat
  };
  delete sauceObjectVariable._userId;

  Sauces.findOne({ _id: req.params.id }) // la sauce correspondant id de la requête
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) { //  si userId  différent 
        res.status(403).json({ message: 'Modification impossible' });
      } else {
        
        let filename = ""   // suppression de l'encienne imagege
        if (req.file != undefined) { 
          filename = sauce.imageUrl.split('/images/')[1] 
        };
        fs.unlink(`images/${filename}`, () => {
          Sauces.updateOne({ _id: req.params.id }, sauceObjectVariable) // id est modifiée avec ne nouvelle obj
            .then(() => { res.status(200).json({ message: 'Modifié!' }) })
            .catch(error => res.status(401).json({ message: error }));
        })
      }
    })
    .catch(error => {
      res.status(400).json({ error });
    });

}



module.exports.deleteOneSauce = (req, res) => {
  Sauces.findOne({ _id: req.params.id }) // la sauce correspondant id de la requête
    .then(sauce => {
      if (sauce.userId != req.auth.userId) { //  si userId  différent 
        res.status(401).json({ message: 'suppression impossible !' })
      } else {
        const filename = sauce.imageUrl.split('/images/')[1]; // le dossier image de la sauce
        fs.unlink(`images/${filename}`, () => { // fs.unlink pour suppression
          Sauces.deleteOne({ _id: req.params.id })
            .then(() => { res.status(200).json({ message: 'Supprimé !' }) })
            .catch(error => res.status(400).json({ error }));
        })
      }
    })
    .catch(error => { res.status(500).json({ error: error }) })
};


module.exports.likeSauce = (req, res, next) => {

  console.log(req.body);
  console.log("message", req.params);

  Sauces.findOne({ _id: req.params.id })
    .then((sauce) => {
      console.log(sauce);
      // ajout like
      if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {//si user id pas dans tableau usersLiked et qu'il aime alors like:1 et donc userId passe dans le tableau
        Sauces.updateOne({ _id: req.params.id }, { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } })
          .then(() => res.status(201).json({ message: 'like 1' }))
          .catch((error) => res.status(400).json({ error: error }));
      };
      // supp like
      if (sauce.usersLiked.includes(req.body.userId) && req.body.like === 0) {
        Sauces.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } })
          .then(() => res.status(201).json({ message: 'like 0' }))
          .catch((error) => res.status(400).json({ error: error }));
      };
      //ajout dislikes
      if (!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
        Sauces.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } })
          .then(() => res.status(201).json({ message: 'dislike 1' }))
          .catch((error) => res.status(400).json({ error: error }));
      };
      // supp dislikes
      if (sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0) {
        Sauces.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } })
          .then(() => res.status(201).json({ message: 'dislike 0' }))
          .catch((error) => res.status(400).json({ error: error }));
      };

    })
    .catch((error) => res.status(400).json({ error }))
};