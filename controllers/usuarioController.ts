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
       return res.status(401).json("Dados")
    }
    try {
        const usuario = await prisma.usuario.findUnique({
            where:{
                email
            }
        })
        if (usuario?.email !== email) {
            return res.status(401).json("usuario não encontrado")
        }
        const senhaValida =await bcrypt.compare(senha,usuario?.senha as string)
        
        if (!senhaValida) {
           return res.status(401).json("Senha inválidos!")
        }
        const token = jwt.sign({usuario},chaveSecreta,{expiresIn:"1d"})
        return res.status(200).json({
            id:usuario?.id,
            nome:usuario?.nome,
            email:usuario?.email,
            token
        })
        
    } catch (error) {
        return res.status(401).json("Falha ao fazer login!")
    }
}

export const autenticarUsuario = async (req:Request, res:Response)=>{
    try {
        const token = req.headers.authorization?.split(' ')[1] as string;
        const tokenDecodificado:any = jwt.decode(token)
        return res.status(200).json({
            id:tokenDecodificado.usuario.id,
            nome:tokenDecodificado.usuario.nome,
            email:tokenDecodificado.usuario.email,
        })
        
    } catch (error) {
        return res.status(401).json("falha na autenticação")
    }
}

export const deletarUsuario = async(req:Request, res:Response)=>{
    try {
        const {id} = req.body
        const response = await prisma.usuario.delete({
            where:{id}
        })
        return res.status(200).json("Usuario deletado com sucesso!")
    } catch (error) {
        return res.status(401).json("Falha ao deletar usuario!")
    }
}

