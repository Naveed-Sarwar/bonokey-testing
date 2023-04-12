import { Props as BankProps } from "../components/Bank";

export default [
  {
    name: "Lowest Rate",
    nameAR: "أقل نسبة ربح",
    sort: (a: BankProps, b: BankProps) => a.apr - b.apr,
  },
  {
    name: "Offers",
    nameAR: "العروض",
    filter: (bank: BankProps) => bank.offer,
    sort: (a: BankProps, b: BankProps) => a.apr - b.apr,
  },
  {
    name: "No Salary Needed",
    nameAR: "بدون تحويل راتب",
    filter: (bank: BankProps) => !bank.salaryTransfer,
    sort: (a: BankProps, b: BankProps) => a.apr - b.apr,
  },
];

type filter = (data: BankProps) => boolean;
type sort = (a: BankProps, b: BankProps) => number;

export type Filter = {
  name: string;
  nameAR: string;
  filter?: filter;
  sort?: sort;
};
