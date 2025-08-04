import React, { useState, useRef, useCallback, useEffect } from 'react';

interface RecentTransactionsProps {
  recentTransactions: Expense[];
  expensesLength: number;
  fetchMoreTransactions: () => Promise<void>;
  hasMore: boolean;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  recentTransactions,
  expensesLength,
  fetchMoreTransactions,
  hasMore,
}) => {
  const [open, setOpen] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastTransactionRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchMoreTransactions();
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore, fetchMoreTransactions]
  );

  useEffect(() => {
    if (!open && observer.current) {
      observer.current.disconnect();
    }
  }, [open]);

  return (
    <>
      {/* Floating Button */}
      <button
        className="fixed bottom-6 right-6 z-50 text-white rounded-full shadow-lg p-2 flex items-center justify-center transition-colors"
        onClick={() => setOpen(true)}
        aria-label="Show Recent Transactions"
        style={{ display: open ? 'none' : 'flex' }}
      >
        {/* History Icon (Heroicons Outline) */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* Modal Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={() => setOpen(false)}
          />
          {/* Drawer */}
          <div className="relative w-full max-w-sm h-[80vh] bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-t-3xl shadow-xl overflow-y-auto flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Transactions
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((expense, idx) => {
                  const isLast = idx === recentTransactions.length - 1;
                  return (
                    <div
                      key={expense.id}
                      ref={isLast ? lastTransactionRef : undefined}
                      className="flex justify-between items-start px-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-none"
                    >
                      <div>
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {expense.segregation} • {expense.category}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {expense.description} • {expense.expenseDate.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-red-500">
                        ₹{expense.amount.toLocaleString('en-IN')}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                  No transactions added yet.
                </div>
              )}
              {hasMore && (
                <div className="py-4 text-center text-gray-400 text-xs">
                  Loading more...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecentTransactions;
