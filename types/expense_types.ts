
interface IncomeData {
  amount: number;
  source: string;
  incomeDate: Date;
  [key: string]: any;
}

interface Income extends IncomeData {
  id: string;
  userId: string;
}
