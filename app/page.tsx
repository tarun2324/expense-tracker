'use client';
import Calendar from '@/components/Calendar';
import ExpenseForm from '@/components/ExpenseForm';
import Graphs from '@/components/Graphs';
import GroupBtn from '@/components/GroupBtn';
import RecentTransactions from '@/components/RecentTransactions';
import Settings from '@/components/Settings';
import { useAuthUserContext } from '@/context/AuthContext';
import { useGroupContext } from '@/context/GroupContext';
import { useToast } from '@/context/ToastContext';
import { subscribeToGroupExpenses } from '@/lib/database';
import { redirect } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type CategorySummary = Record<string, number>;
type MonthlyCategoryData = {
  name: string;
  value: number;
}[];

enum ViewType {
  Tracker = 'tracker',
  Graphs = 'graphs'
}

const AppContent = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [dailyExpense, setDailyExpense] = useState<number>(0);
  const [monthlyExpense, setMonthlyExpense] = useState<number>(0);
  const [categorySummary, setCategorySummary] = useState<CategorySummary>({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAllTransactions, setShowAllTransactions] = useState<boolean>(false);

  const [currentView, setCurrentView] = useState<ViewType>(ViewType.Tracker);

  const [monthlyCategoryData, setMonthlyCategoryData] = useState<MonthlyCategoryData>([]);

  const { user } = useAuthUserContext();
  const { showToast } = useToast();
  const { selectedGroup } = useGroupContext();

  useEffect(() => {
    if (!user) {
      redirect('/auth/login');
    }
  }, [user]);

  // Fetch expenses from Firestore (always group-based)
  useEffect(() => {
    if (!selectedGroup) {
      setExpenses([]);
      return;
    }
    // Always subscribe to group expenses, using personal group if needed
    const unsubscribe = subscribeToGroupExpenses(
      selectedGroup?.id, // Replace with actual group logic if needed
      (fetchedExpenses: Expense[]) => {
        setExpenses(
          fetchedExpenses.map((exp) => ({
            ...exp,
            expenseDate: exp.expenseDate instanceof Date
              ? exp.expenseDate
              : new Date(exp.expenseDate),
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

  // Calculate daily and monthly total expenses and category summary
  useEffect(() => {
    let dailyTotal = 0;
    let monthlyTotal = 0;
    const summary: CategorySummary = {};
    const monthlyCategoryAggregates: Record<string, number> = {};

    const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1);

    const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

    expenses.forEach(expense => {
      if (expense.expenseDate >= startOfDay && expense.expenseDate < endOfDay) {
        dailyTotal += expense.amount;
        const displayCategory = expense.segregation ? `${expense.segregation} - ${expense.category}` : expense.category;
        summary[displayCategory] = (summary[displayCategory] || 0) + expense.amount;
      }
      if (expense.expenseDate >= startOfMonth && expense.expenseDate <= endOfMonth) {
        monthlyTotal += expense.amount;
        monthlyCategoryAggregates[expense.category] = (monthlyCategoryAggregates[expense.category] || 0) + expense.amount;
      }
    });

    setDailyExpense(dailyTotal);
    setMonthlyExpense(monthlyTotal);
    setCategorySummary(summary);

    const chartData: MonthlyCategoryData = Object.keys(monthlyCategoryAggregates).map(cat => ({
      name: cat,
      value: monthlyCategoryAggregates[cat]
    }));
    setMonthlyCategoryData(chartData);

  }, [expenses, selectedDate]);

  const recentTransactions = useMemo(
    () => showAllTransactions ? expenses : expenses.slice(0, 3),
    [showAllTransactions, expenses]
  );

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center p-4 sm:p-0 font-inter relative">
      <div className="bg-white dark:bg-zinc-950 p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md border border-zinc-200 dark:border-zinc-800 relative overflow-hidden">

        <Settings />

        {/* View Switcher */}
        <GroupBtn
          items={[
            { label: 'Tracker', value: ViewType.Tracker },
            { label: 'Graphs', value: ViewType.Graphs }
          ]}
          selected={currentView}
          onClick={(view) => setCurrentView(view as ViewType)}
          className="justify-center mb-6 mt-4"
        />

        {currentView === ViewType.Tracker ? (
          <>
            <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

            <div className="bg-zinc-50 dark:bg-zinc-900 p-5 rounded-2xl mb-6 shadow-inner border border-zinc-200 dark:border-zinc-800 transition-all duration-300">
              <div className="flex justify-between items-center mb-2">
                <div className="text-lg font-semibold text-zinc-700 dark:text-zinc-200">Daily Expense</div>
                <div className="text-3xl font-bold text-black dark:text-white">₹{dailyExpense.toLocaleString('en-IN')}</div>
              </div>
              <div className="flex justify-between items-center mb-3">
                <div className="text-lg font-semibold text-zinc-700 dark:text-zinc-200">Monthly Expense</div>
                <div className="text-3xl font-bold text-black dark:text-white">₹{monthlyExpense.toLocaleString('en-IN')}</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                {Object.entries(categorySummary).map(([category, amount]) => (
                  <div key={category} className="flex justify-between">
                    <span>{category}</span>
                    <span className="font-medium">₹{amount.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            <RecentTransactions
              recentTransactions={recentTransactions}
              expensesLength={expenses.length}
              showAllTransactions={showAllTransactions}
              setShowAllTransactions={setShowAllTransactions}
            />

            <ExpenseForm
              selectedDate={selectedDate}
            />
          </>
        ) : (
          <Graphs monthlyCategoryData={monthlyCategoryData} selectedDate={selectedDate} />
        )}
      </div>
    </div>
  );
};

export default AppContent;
