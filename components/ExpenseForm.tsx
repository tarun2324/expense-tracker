import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthUserContext } from '@/context/AuthContext';
import { useGroupContext } from '@/context/GroupContext';
import { useToast } from '@/context/ToastContext';
import { addGroupExpense } from '@/lib/database';
import React from 'react';
import { useForm } from 'react-hook-form';

interface ExpenseFormProps {
  selectedDate?: Date;
}

const SEGREGATIONS = ['Luxury', 'Essential'];
const CATEGORIES = ['Food', 'Entertainment', 'Subscription', 'Miscellaneous', 'Gift', 'Travel'];

const PAYMENT_APPS = [
  'Cred',
  'Google Pay',
  'Phone Pe',
  'Amazon Pay',
  'Amazon Money',
  'Swiggy Wallet',
  'Zomato Wallet',
];

const BANKS = [
  'HDFC',
  'ICICI',
  'SBI',
  'Central Bank',
  'Diners Black',
  'Sapphiro',
  'ICICI Amazon',
  'Tata Neu',
  'Cash'
];

const ExpenseForm: React.FC<ExpenseFormProps> = ({ selectedDate }) => {
  const { selectedGroup } = useGroupContext();
  const { user } = useAuthUserContext();
  const { showToast } = useToast();
  const form = useForm({
    defaultValues: {
      amount: '',
      description: '',
      category: '',
      segregation: '',
      bank: '',
      payment_app: '',
    }
  });

  if (!user || !selectedGroup) {
    return null;
  }

  const onSubmit = (data: any) => {
    if (!data.amount || !data.category || !data.segregation) {
      showToast("Please fill in all fields.", 'error');
      return;
    }
    addGroupExpense(selectedGroup.id, user.uid, {
      amount: parseFloat(data.amount),
      description: data.description,
      category: data.category,
      segregation: data.segregation,
      expenseDate: selectedDate || new Date(),
    });
    form.reset();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white dark:bg-[#111] p-4 rounded-xl shadow border max-w-md mx-auto">
      <Form {...form}>
        <h2 className="text-xl font-semibold mb-4">Add Expense</h2>
        <div className="flex gap-4 mb-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-center w-1/2">
                <FormControl>
                  <Input {...field} type="number" placeholder="Amount" className="text-sm" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-center w-1/2">
                <FormControl>
                  <Input {...field} type="text" placeholder="Description" className="text-sm" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mb-4 border-t border-gray-200 pt-4">
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="segregation"
              render={({ field }) => (
                <>
                  {SEGREGATIONS.map((seg) => (
                    <FormItem key={seg} className="flex items-center gap-1">
                      <FormControl>
                        <input
                          type="radio"
                          name="segregation"
                          value={seg}
                          checked={field.value === seg}
                          onChange={() => field.onChange(seg)}
                          className="hidden peer"
                          id={`seg-${seg}`}
                        />
                      </FormControl>
                      <Label htmlFor={`seg-${seg}`} className="px-2 py-1 rounded text-xs cursor-pointer bg-gray-100 dark:bg-[#1c1c1c] peer-checked:bg-purple-200 peer-checked:text-purple-900">
                        {seg}
                      </Label>
                    </FormItem>
                  ))}
                </>
              )}
            />
          </div>
        </div>
        <div className="mb-4 border-t border-gray-200 pt-4">
          <div className="flex flex-wrap gap-2">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <>
                  {CATEGORIES.map((cat) => (
                    <FormItem key={cat} className="flex items-center gap-1">
                      <FormControl>
                        <input
                          type="radio"
                          name="category"
                          value={cat}
                          checked={field.value === cat}
                          onChange={() => field.onChange(cat)}
                          className="hidden peer"
                          id={`cat-${cat}`}
                        />
                      </FormControl>
                      <Label htmlFor={`cat-${cat}`} className="px-2 py-1 rounded text-xs cursor-pointer bg-gray-100 dark:bg-[#1c1c1c] peer-checked:bg-purple-200 peer-checked:text-purple-900">
                        {cat}
                      </Label>
                    </FormItem>
                  ))}
                </>
              )}
            />
          </div>
        </div>
        <div className="mb-4 border-t border-gray-200 pt-4">
          <div className="flex flex-wrap gap-2">
            <FormField
              control={form.control}
              name="bank"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <div className="flex flex-wrap gap-2">
                    {BANKS.map((bank) => (
                      <FormItem key={bank} className="flex items-center gap-1">
                        <FormControl>
                          <input
                            type="radio"
                            name="bank"
                            value={bank}
                            checked={field.value === bank}
                            onChange={() => field.onChange(bank)}
                            className="hidden peer"
                            id={`bank-${bank}`}
                          />
                        </FormControl>
                        <Label
                          htmlFor={`bank-${bank}`}
                          className="px-2 py-1 rounded text-xs cursor-pointer bg-gray-100 dark:bg-[#1c1c1c] peer-checked:bg-purple-200 peer-checked:text-purple-900"
                        >
                          {bank}
                        </Label>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
            <div className="mb-4 border-t border-gray-200 my-2" />
            <div className="flex flex-wrap gap-2">
            <FormField
              control={form.control}
              name="payment_app"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <div className="flex flex-wrap gap-2">
                    {PAYMENT_APPS.map((app) => (
                      <FormItem key={app} className="flex items-center gap-1">
                        <FormControl>
                          <input
                            type="radio"
                            name="payment_app"
                            value={app}
                            checked={field.value === app}
                            onChange={() => field.onChange(app)}
                            className="hidden peer"
                            id={`payment_app-${app}`}
                          />
                        </FormControl>
                        <Label
                          htmlFor={`payment_app-${app}`}
                          className="px-2 py-1 rounded text-xs cursor-pointer bg-gray-100 dark:bg-[#1c1c1c] peer-checked:bg-purple-200 peer-checked:text-purple-900"
                        >
                          {app}
                        </Label>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type="submit" className="w-full py-2 text-base font-bold">
          Add Expense
        </Button>
      </Form>
    </form>
  );
}

export default ExpenseForm;