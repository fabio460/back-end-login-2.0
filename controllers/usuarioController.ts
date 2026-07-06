import "dotenv/config";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getUsuario = async(req:Request, res:Response) =>{
    try {
        const usuario = await prisma.usuario.findMany()
        res.json(usuario)
    } catch (error) {
        res.json("erro")
    }
}