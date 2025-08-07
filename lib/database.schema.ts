// Firestore Database Schema for Expense Tracker (Groups-based)

import { Timestamp } from "firebase/firestore";

/**
 * Collection: artifacts/{appId}/groups/{groupId}/expenses
 * Document fields:
 *   - id: string (Firestore document ID)
 *   - userId: string (who added/updated)
 *   - amount: number
 *   - category: string
 *   - description: string
 *   - expenseDate: Timestamp (Firestore)
 *   - segregation: string
 *   - createdAt: Timestamp (Firestore)
 */
export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  expenseDate: Timestamp; // Can be stored as Timestamp or Date object
  segregation: string;
  createdAt: Date; // Can be stored as Timestamp or Date object
}

/**
 * Collection: artifacts/{appId}/groups/{groupId}/incomes
 * Document fields:
 *   - id: string (Firestore document ID)
 *   - userId: string (who added/updated)
 *   - amount: number
 *   - source: string
 *   - incomeDate: Timestamp (Firestore)
 *   - createdAt: Timestamp (Firestore)
 */
export interface Income {
  id: string;
  userId: string;
  amount: number;
  source: string;
  incomeDate: Date;
  createdAt: Date;
}

/**
 * Collection: artifacts/{appId}/groups
 * Document fields:
 *   - id: string (Firestore document ID)
 *   - name: string
 *   - createdAt: Timestamp (Firestore)
 *   - users: string[] (user IDs who can access/update)
 *   - admins: string[] (user IDs with admin rights)
 */
export interface GroupMeta {
  id: string;
  name: string;
  createdAt: Date;
  users: string[];
  admins: string[];
}

/**
 * Data required to add a new expense (without id, createdAt)
 */
export interface ExpenseData {
  amount: number;
  category: string;
  description: string;
  expenseDate: Date;
  segregation: string;
}

/**
 * Data required to add a new income (without id, createdAt)
 */
export interface IncomeData {
  amount: number;
  source: string;
  incomeDate: Date;
}
