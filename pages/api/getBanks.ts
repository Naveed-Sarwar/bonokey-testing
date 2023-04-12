import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../prisma/prisma";

type Data = {
    error: string | null;
    data: {
        banks: string;
    } | null;
};

export default async function getBanksHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
    try {
        const banks = await prisma.bank.findMany({ include: { aprValues: true, saleReps: true } });
    console.log("banks" , banks);
        
    } catch (error) {
        console.log("Something went wrong getting banks: " + error);
        return res.status(200).json({
            error: "Something went wrong getting banks: " + error,
            data: null,
        });
    }
}
