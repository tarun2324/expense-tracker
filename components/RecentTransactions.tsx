import React, { useState, useEffect } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { useGroupContext } from '@/context/GroupContext';
import { getGroupExpensesForMonth } from '@/lib/database';
import { Expense } from '@/lib/database.schema';
import { Timestamp } from 'firebase/firestore';

interface RecentTransactionsProps {
  selectedDate: Date;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ selectedDate }) => {
  const { selectedGroup } = useGroupContext();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedGroup || !selectedDate) return;
    setLoading(true);

    // Get month and year from selectedDate
    const month = selectedDate.getMonth() + 1; // JS months are 0-based
    const year = selectedDate.getFullYear();

    getGroupExpensesForMonth(selectedGroup.id, year, month).then(allExpenses => {
      console.log('Fetched expenses:', allExpenses);
      
      setExpenses(allExpenses.sort((a, b) => (b.createdAt as unknown as Timestamp).seconds - (a.createdAt as unknown as Timestamp).seconds));
      setLoading(false);
    });
  }, [selectedGroup, selectedDate]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="fixed bottom-6 right-6 z-50 text-white rounded-full shadow-lg p-2 flex items-center justify-center transition-colors bg-black hover:bg-zinc-800"
          aria-label="Show Recent Transactions"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-h-[70vh] overflow-y-auto p-0" side="top" align="end">
        <div className="flex flex-col">
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
          </div>
          <div
            className="flex-1 overflow-y-auto"
            style={{ minHeight: '200px', maxHeight: '50vh' }}
          >
            {expenses.length > 0 ? (
              expenses.map((expense: Expense) => (
                <div
                  key={expense.id}
                  className="flex justify-between items-start px-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-none"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {expense.segregation} • {expense.category}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {(() => {
                        const dateValue = expense.expenseDate;
                        if (dateValue instanceof Date) {
                          return dateValue.toLocaleDateString();
                        }
                        // Handle Firestore Timestamp
                        if (dateValue && typeof dateValue.toDate === 'function') {
                          return dateValue.toDate().toLocaleDateString();
                        }
                        return '';
                      })()}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-red-500">
                    ₹{expense.amount.toLocaleString('en-IN')}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                No transactions added yet.
              </div>
            )}
            {loading && (
              <div className="py-4 text-center text-gray-400 text-xs">Loading...</div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default RecentTransactions;
