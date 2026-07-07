import "dotenv/config";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const chaveSecreta = "chaveSecreta"
const prisma = new PrismaClient();

export const getUsuario = async(req:Request, res:Response) =>{
    try {
        const usuario = await prisma.usuario.findMany()
        res.json(usuario)
    } catch (error) {
        res.json("erro")
    }
}

export const criarUsuario = async(req: Request, res: Response)=>{
    const {email, nome, senha} = req.body
    if (!email || !nome || !senha) {
        res.json("dados em branco")
        return null
    }
    try {
        const existeUsuario = await prisma.usuario.findUnique({
            where:{email}
        })
        if (existeUsuario) {
            res.json("Já existe este usuário!")
        }
        const salt =await bcrypt.genSalt(10)
        const senhaHasheada =await bcrypt.hash(senha,salt)
        const usuario = await prisma.usuario.create({
            data:{
                email,
                nome,
                senha:senhaHasheada
            }
        })
        res.status(200).json("usuario criado com sucesso!")
    } catch (error) {
        res.status(400).json("Falha ao criar usuario!")       
    }
}

export const logarUsuario = async(req:Request, res:Response)=>{
    const {email, senha} = req.body
    if (!email || !senha) {
        res.status(401).json("Dados")
    }
    try {
        const usuario = await prisma.usuario.findUnique({
            where:{
                email
            }
        })
        if (senha !== usuario?.senha) {
            res.json("Usuário ou senha inválidos!")
        }
        
        const token = jwt.sign({usuario},chaveSecreta,{expiresIn:"1d"})
        res.status(200).json(token)
        
    } catch (error) {
        res.status(401).json("Falha ao fazer login!")
    }
}

export const autenticarUsuario = async (req:Request, res:Response)=>{
    try {
        const tokenString = req.headers.authorization?.split(' ')[1];
        const token =JSON.parse(tokenString as string);
        if (!token) {
            res.status(401).json("token inválido")
        }
        const tokenValido = jwt.verify(token,chaveSecreta) as string
        res.status(200).json(jwt.decode(tokenValido))
        
    } catch (error) {
        res.status(401).json("falha na autenticação")
    }
}

