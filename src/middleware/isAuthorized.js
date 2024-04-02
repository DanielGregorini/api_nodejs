//middleware é responsavel por vereficiar se o token passado
//na requsição e válido
const env = require('../env')
const jwt = require('jsonwebtoken');

const isAuthorized = (req, res, next) =>{

    const{authorization} = req.headers;

    if(!authorization){
        return res.status(404).json({message: "No token"})
    }

    jwt.verify(authorization, env.SECRETKEY,
        (err, decoded) => {
            console.log(decoded);
            if(err) return res.status(401).json({
                message: "Failed to authenticate token"
            })
            req.user = decoded;
            return next();

        });
}

module.exports = isAuthorized;