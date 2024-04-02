const express = require('express');
const router = express.Router();

const TimecardRepository = require('../repository/timecard');
const isAuthorized = require('../middleware/isAuthorized');

// Obter todas os cartoes
router.get("/", isAuthorized, async (req, res) => {
    const timecards = await TimecardRepository.getAll();
    console.log('\nConsultando todos os cartões-ponto')
    return res.json(timecards);
});

// Obter por ID
router.get("/:id", isAuthorized, async (req, res) => {

    const id = req.params.id;
    const timecard = await TimecardRepository.getById(id);
    console.log('Consultuando timecard: ',id)

    if (timecard .length === 0) {
        return res.status(404).json({ error: "Timecard não encontrado" });
        console.log('NÃO ACHADO o cartão-ponto: ',id)
    }

    console.log(timecard[0]);
    return res.json(timecard[0]);
});

// Obter por ID employee
router.get("/employee/:id", isAuthorized,async (req, res) => {

    const id = req.params.id;
    const timecards = await TimecardRepository.getByIdEmployee(id);
    console.log('Consultuando timecards pelo funcionario: ',id)

    if (timecards.length === 0) {
        console.log('NÃO ACHADO os cartão-ponto do funcionario: ',id)
        return res.status(404).json({ error: "Funcionário não encontrado" });
        
    }

    //console.log(timecards);
    return res.json(timecards);
});

// Criar um cartao-ponto
router.post("/", isAuthorized, async (req, res) => {
    try {
        console.log('\nInserindo cartão-ponto:\n', req.body,'\n')
        // Validar os dados recebidos antes de criar um funcionário
       
        const dbResult = await TimecardRepository.create(req.body);

        if (dbResult.affectedRows == 0) {
            return res.status(400).json({ message: "Falha ao inserir o cartão-ponto" });
        }

        req.body.id = dbResult.insertId;
        return res.json(req.body);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
});

// Atualizar cartao-ponto
router.put("/:id", isAuthorized, async (req, res) => {
    const { id } = req.params;

    console.log('\nAtualizando o cartão-ponto:', id, '\n',req.body,'\n')

    const timecard = req.body;
    const timecardDB = await TimecardRepository.getById(id);

    if (timecardDB.length === 0) {
        return res.status(400).json({ error: "cartão ponto não encontrado com o ID fornecido." });
    }

    try {
        const dbResult = await TimecardRepository.update(id, timecard);
    
        if (dbResult.affectedRows === 0) {
            return res.status(404).json({ error: "Nao afetou nem uma linha na hora de atualizar o card time" });
        }
    
        // Se a atualização foi bem-sucedida, você pode retornar os dados atualizados se desejar.
        const timecardDBUpdate = await TimecardRepository.getById(id);
        return res.json(timecardDBUpdate);
    
    } catch (err) {
        return res.status(400).json({ error: "erro" + err });
    }
});

// Deletar um time card
router.delete("/:id", isAuthorized, async (req, res) => {
    const { id } = req.params;

    console.log("\nDeletando Cartão Ponto ID: ", id)

    const timecardDB = await TimecardRepository.getById(id);

    if (timecardDB.length === 0) {
        return res.status(404).json({ error: "cartao ponto não encontrado" });
    }

    const dbResult = await TimecardRepository.remove(id);

    if (dbResult.affectedRows === 0) {
        return res.status(400).json({ error: "Falha ao deletar um cartao ponto" });
    }

    return res.json({ message: "cartao ponto deletado" });
});

module.exports = router;