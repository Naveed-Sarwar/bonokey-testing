import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../prisma/prisma";
import { verify } from "../../controller/Auth";

type Bank = {
  name: string;
  nameAR: string;
  logo: string;
  address: string;
  url: string;
  salaryTransfer: boolean;
  minSalary: number;
  minLoan: number;
  offer: boolean;
};

type Sector = {
  name: string;
  nameAR: string;
};

type Salary = {
  min: number;
  max: number;
};

type SaleRep = {
  name: string;
  mobile: string;
  email: string;
  branch: string;
  bankId: number;
};

type Apr = {
  bankId: number;
  salaryId: number;
  sectorId: number;
  value: number;
};

type Body = {
  token: any;
  banks: any;
  sectors: any;
  salaries: any;
  saleReps: any;
  apr: any;
};

type Data = {
  error?: string;
};

const NextApi = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { token, banks, sectors, salaries, saleReps, apr }: Body = JSON.parse(
    req.body
  );
  if ((await verify(token)) === null)
    return res.status(401).json({ error: "Invalid token" });
  if (!banks || !sectors || !salaries || !saleReps || !apr)
    return res.status(400).json({ error: "Missing parameters" });

  try {
    await prisma.$queryRaw`TRUNCATE TABLE "AprValue" RESTART IDENTITY CASCADE;`;
    await prisma.$queryRaw`TRUNCATE TABLE "SaleRep" RESTART IDENTITY CASCADE;`;
    await prisma.$queryRaw`TRUNCATE TABLE "Sector" RESTART IDENTITY CASCADE;`;
    await prisma.$queryRaw`TRUNCATE TABLE "Salary" RESTART IDENTITY CASCADE;`;
    await prisma.$queryRaw`TRUNCATE TABLE "Bank" RESTART IDENTITY CASCADE;`;

    const newBanks: Bank[] = banks.map((bank: any) => {
      const newBank: Bank = {} as Bank;
      newBank.name = bank.name;
      newBank.nameAR = bank.nameAR;
      newBank.logo = bank.logo;
      newBank.address = bank.address;
      newBank.url = bank.url;
      newBank.salaryTransfer = bank.salaryTransfer === "true";
      newBank.minSalary = parseInt(bank.minSalary);
      newBank.minLoan = parseInt(bank.minLoan);
      newBank.offer = bank.offer === "true";
      return newBank;
    });
    await prisma.bank.createMany({ data: newBanks, skipDuplicates: true });

    const newSectors: Sector[] = sectors.map((sector: any) => {
      const newSector: Sector = {} as Sector;
      newSector.name = sector.name;
      newSector.nameAR = sector.nameAR;
      return newSector;
    });
    await prisma.sector.createMany({ data: newSectors, skipDuplicates: true });

    const newSalaries: Salary[] = salaries.map((salary: any) => {
      const newSalary: Salary = {} as Salary;
      newSalary.min = parseInt(salary.min);
      newSalary.max = parseInt(salary.max);
      return newSalary;
    });
    await prisma.salary.createMany({ data: newSalaries, skipDuplicates: true });

    const newSaleReps: SaleRep[] = saleReps.map((saleRep: any) => {
      const newSaleRep: SaleRep = {} as SaleRep;
      newSaleRep.name = saleRep.name;
      newSaleRep.mobile = saleRep.mobile;
      newSaleRep.email = saleRep.email;
      newSaleRep.branch = saleRep.branch;
      newSaleRep.bankId = parseInt(saleRep.bankId);
      return newSaleRep;
    });
    await prisma.saleRep.createMany({
      data: newSaleReps,
      skipDuplicates: true,
    });

    const newAPRs: Apr[] = apr.map((apr: any) => {
      const newAPR: Apr = {} as Apr;
      newAPR.bankId = parseInt(apr.bankId);
      newAPR.salaryId = parseInt(apr.salaryId);
      newAPR.sectorId = parseInt(apr.sectorId);
      newAPR.value = parseFloat(apr.value.replaceAll(",", "."));
      return newAPR;
    });
    await prisma.aprValue.createMany({ data: newAPRs, skipDuplicates: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }

  res.status(200).json({});
};

export default NextApi;
