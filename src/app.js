//importacoes
import express from "express"
import cors from "cors"

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3006;

app.listen(PORT, () => {
    console.log(`-- BACKEND cartão ponto da video som --`);
    console.log(`App executando na porta ${PORT}`);
});

app.get("/", async (req, res) => {
    return res.send("APLI na escuta!!");
});

app.use("/employee", require('./routes/employee'));
app.use("/timecard", require('./routes/timecard'));
app.use("/login", require('./routes/login'));