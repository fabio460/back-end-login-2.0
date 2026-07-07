import express from "express";
import cors from "cors";
import { autenticarUsuario, criarUsuario, deletarUsuario, getUsuario, logarUsuario } from "./controllers/usuarioController.js";

const app = express()
app.use(cors())
app.use(express.json())


app.get("/usuario",getUsuario)
app.post("/criarusuario",criarUsuario)
app.post("/logarusuario",logarUsuario)
app.post("/autenticarusuario",autenticarUsuario)
app.delete("/deletarusuario",deletarUsuario)
app.listen(4000,()=>console.log("rodando na porta 4000"))