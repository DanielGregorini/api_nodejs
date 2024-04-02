
const connection = require('../connection');
const TABLE = 'tb_timecard';

// Obter todos os cartões-ponto
const getAll = async () => {
    const [query] = await connection.execute(
        `SELECT id_timecard, id_employee, date_card, day_week, h_m_entry, h_m_exit, h_t_entry, h_t_exit, is_vacation, is_medical_certificate FROM ${TABLE}`
    );

    await connection.end();

    return query;
}

const getById = async (id) => {
    const [query] = await connection.execute(
        `SELECT id_timecard, id_employee, date_card, day_week, h_m_entry, h_m_exit, h_t_entry, h_t_exit, is_vacation, is_medical_certificate FROM ${TABLE} WHERE id_timecard = ? LIMIT 1`,
        [id]
    );

    await connection.end();

    return query;
}

const getByIdEmployee = async (id) => {
    const [query] = await connection.execute(
        `SELECT id_timecard, id_employee, date_card, day_week, h_m_entry, h_m_exit, h_t_entry, h_t_exit, is_vacation, is_medical_certificate FROM ${TABLE} WHERE id_employee = ?`,
        [id]
    );

    await connection.end();

    return query;
}

// Inserir
const create = async (timecard) => {
    const { id_employee, date_card, day_week, h_m_entry, h_m_exit, h_t_entry, h_t_exit, is_vacation, is_medical_certificate } = timecard;

    if (!id_employee) {
        throw new Error("id_employee is required for creating a timecard.");
    }

    const [query] = await connection.execute(
        `INSERT INTO ${TABLE} (id_employee, date_card, day_week, h_m_entry, h_m_exit, h_t_entry, h_t_exit, is_vacation, is_medical_certificate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            id_employee,
            date_card,
            day_week,
            h_m_entry,
            h_m_exit,
            h_t_entry,
            h_t_exit,
            is_vacation,
            is_medical_certificate
        ]
    );

    await connection.end();

    return query;
};

// Atualizar timecard
const update = async (id, timecard) => {
    const { date_card, day_week, h_m_entry, h_m_exit, h_t_entry, h_t_exit, is_vacation, is_medical_certificate } = timecard;

    const [rows] = await connection.execute(
        `UPDATE ${TABLE} SET date_card = ?, day_week = ?, h_m_entry = ?, h_m_exit = ?, h_t_entry = ?, h_t_exit = ?, is_vacation = ?, is_medical_certificate = ? WHERE id_timecard = ?`,
        [
            date_card,
            day_week,
            h_m_entry,
            h_m_exit,
            h_t_entry,
            h_t_exit,
            is_vacation,
            is_medical_certificate,
            id
        ]
    );

    await connection.end();

    return rows;
};

// Deletar um usuário do banco de dados
const remove = async (id) => {
    const [query] = await connection.execute(
        `DELETE FROM ${TABLE} WHERE id_timecard=${id}`
    );

    await connection.end();
    
    return query;
}

module.exports = { getAll, getByIdEmployee, create, getById, update, remove };
