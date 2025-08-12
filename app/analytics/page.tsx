"use client";
import Graphs from '@/components/Graphs';
import { useAuthUserContext } from '@/context/AuthContext';
import { useGroupContext } from '@/context/GroupContext';
import { useToast } from '@/context/ToastContext';
import { subscribeToGroupExpenses } from '@/lib/database';
import { Expense } from '@/lib/database.schema';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
type CategorySummary = Record<string, number>;
type MonthlyCategoryData = {
  name: string;
  value: number;
}[];
const AnalyticsPage = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthlyCategoryData, setMonthlyCategoryData] = useState<MonthlyCategoryData>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { user } = useAuthUserContext();
  const { showToast } = useToast();
  const { selectedGroup } = useGroupContext();
  useEffect(() => {
    if (!user) {
      redirect('/auth/login');
    }
  }, [user]);
  useEffect(() => {
    if (!selectedGroup) {
      setExpenses([]);
      return;
    }
    const unsubscribe = subscribeToGroupExpenses(
      selectedGroup?.id,
      (fetchedExpenses: Expense[]) => {
        setExpenses(
          fetchedExpenses.map((exp) => ({
            ...exp,
          }))
        );
      },
      (error: any) => {
        console.error("Error fetching group expenses:", error);
        showToast("Failed to load group expenses. Please try again.", 'error');
      }
    );
    return () => unsubscribe && unsubscribe();
  }, [selectedGroup]);
  useEffect(() => {
    const monthlyCategoryAggregates: Record<string, number> = {};
    const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    expenses.forEach(expense => {
      const expenseDate =
        expense.expenseDate instanceof Date
          ? expense.expenseDate
          : (expense.expenseDate?.toDate ? expense.expenseDate.toDate() : new Date(expense.expenseDate.seconds * 1000));
      if (expenseDate >= startOfMonth && expenseDate <= endOfMonth) {
        monthlyCategoryAggregates[expense.category] = (monthlyCategoryAggregates[expense.category] || 0) + expense.amount;
      }
    });
    const chartData: MonthlyCategoryData = Object.keys(monthlyCategoryAggregates).map(cat => ({
      name: cat,
      value: monthlyCategoryAggregates[cat]
    }));
    setMonthlyCategoryData(chartData);
  }, [expenses, selectedDate]);
  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 flex items-start justify-center md:p-4 sm:p-0 font-inter relative">
      <div className="bg-white dark:bg-zinc-950 p-6 md:rounded-3xl sm:rounded-none shadow-2xl w-full max-w-md border border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
        <Graphs monthlyCategoryData={monthlyCategoryData} selectedDate={selectedDate} />
      </div>
    </div>
  );
};
export default AnalyticsPage;
