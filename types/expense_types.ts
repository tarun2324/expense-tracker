
interface ExpenseData {
  amount: number;
  category: string;
  description: string;
  expenseDate: Date;
  segregation?: string;
  [key: string]: any;
}

interface IncomeData {
  amount: number;
  source: string;
  incomeDate: Date;
  [key: string]: any;
}

interface Expense extends ExpenseData {
  id: string | number;
  createdAt: Date;
  userId: string;
}

interface Income extends IncomeData {
  id: string;
  userId: string;
}
