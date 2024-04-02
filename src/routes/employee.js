const express = require('express');
const router = express.Router();

const EmployeeRepository = require('../repository/employee');
const isAuthorized = require('../middleware/isAuthorized');

//const isAuthorized = require('../middleware/isAuthorized');

// Obter todas as usuarios
router.get("/", isAuthorized, async (req, res) => {
    const employees = await EmployeeRepository.getAll();
    return res.json(employees);
});

// Obter por ID
router.get("/:id", async (req, res) => {

    const id = req.params.id;
    const employee = await EmployeeRepository.getById(id);

    console.log('Consultuando funcionario: ',id)

    if (employee .length === 0) {
        return res.status(404).json({ error: "Funcionário não encontrado" });
    }

    console.log(employee[0]);
    return res.json(employee[0]);
});

// Criar funcionário
router.post("/", isAuthorized, async (req, res) => {
    try {
        console.log('Inserindo funcionário:', req.body)
        // Validar os dados recebidos antes de criar um funcionário
        if (!req.body.name || !req.body.position) {
            return res.status(400).json({ message: "Nome e posição são campos obrigatórios" });
        }

        const dbResult = await EmployeeRepository.create(req.body);

        if (dbResult.affectedRows == 0) {
            return res.status(400).json({ message: "Falha ao inserir funcionário" });
        }

        req.body.id = dbResult.insertId;
        return res.json(req.body);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
});

// Atualizar funcionário
router.put("/:id", isAuthorized, async (req, res) => {
    const { id } = req.params;

    console.log("\nAtualizando Funcionário ID: ", id, "\n", req.body )
    
    const employee = req.body;
    const employeeDB = await EmployeeRepository.getById(id);

    if (employeeDB.length === 0) {
        return res.status(400).json({ error: "Employee não encontrado para o ID fornecido." });
    }

    try {
        const dbResult = await EmployeeRepository.update(id, employee);
    
        if (dbResult.affectedRows === 0) {
            return res.status(404).json({ error: "Nao afetou nem uma linha na hora de atualizar um funcionário" });
        }
    
        // Se a atualização foi bem-sucedida, você pode retornar os dados atualizados se desejar.
        const employeeDBUptade = await EmployeeRepository.getById(id);

        return res.json(employeeDBUptade);
    
    } catch (err) {
        return res.status(400).json({ error: "erro" + err });
    }

});


// Deletar funcionário
router.delete("/:id", isAuthorized, async (req, res) => {
    const { id } = req.params;

    console.log("\nDeletando Funcionário ID: ", id)

    const employeeDB = await EmployeeRepository.getById(id);

    if (employeeDB.length === 0) {
        return res.status(404).json({ error: "Funcionario não encontrado" });
    }

    const dbResult = await EmployeeRepository.remove(id);

    if (dbResult.affectedRows === 0) {
        return res.status(400).json({ error: "Falha ao deletar funcionário" });
    }

    return res.json({ message: "funcionário deletado" });
});

module.exports = router;