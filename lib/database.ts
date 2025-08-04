import {
  addDoc,
  collection,
  DocumentData,
  DocumentReference,
  FirestoreError,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
  where
} from 'firebase/firestore';
import { Expense, ExpenseData, GroupMeta, Income, IncomeData } from "./database.schema";
import { db } from "./firebase";

const appId = "default-app-id"; // Replace with your actual app ID
export const PERSONAL_GROUP_ID = 'personal-expenses'; // Default personal group ID

export const getGroupExpenses = async (groupId: string): Promise<Expense[]> => {
  const expensesRef = collection(db, `artifacts/${appId}/groups/${groupId}/expenses`);
  const querySnapshot = await getDocs(expensesRef);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Expense));
};


export const getGroupIncomes = async (groupId: string): Promise<Income[]> => {
  const incomesRef = collection(db, `artifacts/${appId}/groups/${groupId}/incomes`);
  const querySnapshot = await getDocs(incomesRef);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Income));
};


/**
 * Adds an expense to Firestore for a specific group.
 * @param groupId The ID of the group.
 * @param userId The ID of the user adding the expense.
 * @param expenseData The expense data (amount, category, description, expenseDate, segregation).
 * @returns A promise that resolves with the DocumentReference of the new expense.
 */
export const addGroupExpense = async (
  groupId: string,
  userId: string,
  expenseData: ExpenseData
): Promise<DocumentReference<DocumentData>> => {
  if (!db) {
    console.error("Firestore not initialized.");
    throw new Error("Firestore not initialized.");
  }
  const expensesCollectionRef = collection(db, `artifacts/${appId}/groups/${groupId}/expenses`);
  return await addDoc(expensesCollectionRef, {
    ...expenseData,
    expenseDate: Timestamp.fromDate(expenseData.expenseDate),
    createdAt: serverTimestamp(),
    userId: userId
  });
};


export const addGroupIncome = async (
  groupId: string,
  userId: string,
  income: IncomeData
): Promise<DocumentReference<DocumentData>> => {
  const incomesRef = collection(db, `artifacts/${appId}/groups/${groupId}/incomes`);
  return await addDoc(incomesRef, { ...income, userId });
};


/**
 * Sets up a real-time listener for expenses for a specific group.
 * @param groupId The ID of the group.
 * @param callback The callback function to be called with the fetched expenses.
 * @param errorCallback The callback function for errors.
 * @returns An unsubscribe function.
 */
export const subscribeToGroupExpenses = (
  groupId: string,
  callback: (expenses: Expense[]) => void,
  errorCallback: (error: FirestoreError) => void
): () => void => {
  if (!db) {
    console.error("Firestore not initialized.");
    return () => {};
  }
  const expensesCollectionRef = collection(db, `artifacts/${appId}/groups/${groupId}/expenses`);
  const q = query(expensesCollectionRef);

  return onSnapshot(
    q,
    (snapshot) => {
      const fetchedExpenses: Expense[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          expenseDate: data.expenseDate?.toDate ? data.expenseDate.toDate() : new Date(data.expenseDate),
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
        } as Expense;
      });
      fetchedExpenses.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      callback(fetchedExpenses);
    },
    errorCallback
  );
};

/**
 * CRUD for GroupMeta
 * Returns groups for the current user only.
 */
export const getGroupsForUser = async (userId: string): Promise<GroupMeta[]> => {
  const groupsRef = collection(db, `artifacts/${appId}/groups`);
  const q = query(groupsRef, where("users", "array-contains", userId));
  const querySnapshot = await getDocs(q);

  let groups = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(doc.data().createdAt)
  } as GroupMeta));

  if (groups.length === 0) {
    const personalGroupRef = await addGroup("Personal Expenses", [userId], userId);
    const personalGroupSnap = await getDoc(personalGroupRef);
    const personalGroup = {
      id: personalGroupSnap.id,
      ...personalGroupSnap.data(),
      createdAt: personalGroupSnap.data()?.createdAt?.toDate ? personalGroupSnap.data()?.createdAt.toDate() : new Date(personalGroupSnap.data()?.createdAt)
    } as GroupMeta;
    groups = [personalGroup];
  }

  return groups;
};

export const addGroup = async (name: string, users: string[], userId: string): Promise<DocumentReference<DocumentData>> => {
  const groupsRef = collection(db, `artifacts/${appId}/groups`);
  return await addDoc(groupsRef, {
    name,
    users,
    admins: [userId],
    createdAt: serverTimestamp()
  });
};
