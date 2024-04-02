const express = require('express');
const router = express.Router();
const UserRepository = require('../repository/user');
const jwt = require("jsonwebtoken");
const env = require('../env')
/*

*@param {*} params objeto contento os parâmetros para codificar no token

@param {*} timeout tempo de exiração do token em segundo
*
*
*d

*/
const generateToken = (params = {}, timeout = 86400) => {
    return jwt.sign(params, env.SECRETKEY, { expiresIn: timeout });
};

router.post('/', async (req, res) => {

    //console.log(req.body)

    // Verifica se login e password foram fornecidos no corpo da requisição
    if (!req.body.login || !req.body.password) {
        return res.status(400).json({ error: "Credenciais não fornecidas" });
    }

    // Obtém login e password do corpo da requisição
    const { login, password } = req.body;

    try {
        // Tenta fazer a consulta no banco de dados
        const dbResult = await UserRepository.getByEmailAndPassoword(login, password);

        // Verifica se encontrou algum usuário com as credenciais fornecidas
        if (dbResult.length === 0) {
            return res.status(401).json({ error: "Credencial inválida" });
        }

        // Gera o token de autenticação
        const token = generateToken({
            id: dbResult[0].id,
            login: dbResult[0].login,
        }, 86400);


        dbResult[0].password = undefined;

        // Obtenha a data atual
        const now = new Date();

        // Configure a data para amanhã
        const expiresTomorrow = new Date(now);
        expiresTomorrow.setDate(now.getDate() + 1);

        // Configure a hora para 01:00 da manhã
        expiresTomorrow.setHours(0, 0, 0, 0);

        // Retorne a data de expiração configurada
        return res.json({
            token,
            user: dbResult[0],
            loggedId: now,
            expiresIn: expiresTomorrow
        });



    } catch (error) {
        // Se ocorrer um erro durante a execução da consulta, retorna uma mensagem de erro
        console.error('Erro ao fazer login:', error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
});


module.exports = router;