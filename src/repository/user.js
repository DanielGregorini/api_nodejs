const connection = require('../connection');
const TABLE = 'tb_user';

//obter todos os usuarios
const getAll = async () => {
    const [query] = await connection.execute(
        `SELECT id, login, password FROM ${TABLE}`
    );
    return query;
}

//obter um usuario pelo id
const getById = async (id) => {
    const [query] = await connection.execute(
        `SELECT login, password FROM ${TABLE} WHERE id_user = 
        ${id} LIMIT 1`
    );
    return query;
}

const getByEmailAndPassoword = async (login, password) => {

    const [rows] = await connection.execute(
        `SELECT id_user, login, password FROM ${TABLE} WHERE login = ? AND password = ? LIMIT 1`,
        [login, password]
    );

    return rows;
}


//obter uma login
const getLogin = async (user) => {
    try {
        const [rows] = await connection.execute(
            `SELECT id_user, login, password FROM ${TABLE} WHERE login = ? AND password  = ? LIMIT 1`,
            [user.login, user.password]
        );

        // Verifique o número de linhas no resultado
        const rowCount = rows.length;

        return rowCount;
    } catch (error) {
        // Lide com erros aqui, por exemplo, registrando ou lançando uma exceção
        console.error('Erro na consulta: ' + error);
        throw error;
    }
};

//insert
const create = async (user) => {
    const [query] = await connection.execute(
        `INSERT INTO ${TABLE} (login, password) VALUES (?, ?)`,
        [
            user.login,
            user.password, // Convertendo o email para minúsculas
        ]
    );
    return query;
};

//atualizar
const update = async (id, user) => {

    const [rows] = await connection.execute(
        `UPDATE ${TABLE} SET user = ?, password = ? WHERE id_user = ?`,
        [user.login, user.password, id]
    );

    return rows;
};

//deletar um usuario do banco de dados
const remove = async (id) => {
    const [query] = await connection.execute(
        `DELETE FROM ${TABLE} WHERE id_user = ${id}`
    );
    return query;
}

module.exports = { getAll, create, getById, update, remove, getLogin, getByEmailAndPassoword}