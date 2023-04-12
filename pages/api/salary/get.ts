import prisma from "../../../prisma/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import * as PrismaTypes from "@prisma/client";

type Body = {
  salary: number;
};

type Data = {
  salary?: PrismaTypes.Salary;
  error?: string;
};

const NextApi = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { salary }: Body = JSON.parse(req.body);
  if (!salary) return res.status(400).json({ error: "Missing parameters" });

  const result = await prisma.salary.findFirst({
    where: {
      OR: [
        {
          min: {
            lt: salary,
          },
          max: {
            gte: salary,
          },
        },
        {
          min: {
            lt: salary,
          },
          max: {
            equals: -1,
          },
        },
        {
          min: {
            equals: -1,
          },
          max: {
            gte: salary,
          },
        },
      ],
    },
  });
  if (!result)
    return res.status(404).json({ error: "Couldn't find a Salary Value" });

  res.status(200).json({ salary: result });
};

export default NextApi;
