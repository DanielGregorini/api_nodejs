const connection = require('../connection');
const TABLE = 'tb_employee';

//obter todos os funcionários
const getAll = async () => {
    const [query] = await connection.execute(
        `SELECT id_employee, name, position, type FROM ${TABLE}`
    );
    return query;
}

const getById = async (id) => {
    const [query] = await connection.execute(
        `SELECT id_employee, name, position, type FROM ${TABLE} WHERE id_employee = ? LIMIT 1`,
        [id]
    );
    return query;
}

//insert
const create = async (employee) => {
    const [query] = await connection.execute(
        `INSERT INTO ${TABLE} (name, position, type) VALUES (?, ?, ?)`,
        [
            employee.name.toUpperCase(),
            employee.position.toLowerCase(),
            employee.type
        ]
    );
    return query;
};

//atualizar
const update = async (id, employee) => {

    const [rows] = await connection.execute(
        `UPDATE ${TABLE} SET name = ?, position = ?, type = ? WHERE id_employee = ?`,
        [employee.name, employee.position, employee.type, id]
    );

    return rows;
};

//deletar um usuario do banco de dados
const remove = async (id) => {
    const [query] = await connection.execute(
        `DELETE FROM ${TABLE} WHERE id_employee=${id}`
    );
    return query;
}

module.exports = { getAll, create, getById, update, remove,}