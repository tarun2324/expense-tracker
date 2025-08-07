
"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { addGroup } from "@/lib/database";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuthUserContext } from "@/context/AuthContext";
import { useForm } from "react-hook-form";

interface UserOption {
  uid: string;
  email: string;
}


const AddGroup: React.FC = () => {
  const { user } = useAuthUserContext();
  const [searchResult, setSearchResult] = useState<UserOption | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<UserOption[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const form = useForm({
    defaultValues: {
      groupName: '',
      email: '',
    },
  });

  // Search user by email in Firestore users collection
  const handleSearch = async (email: string) => {
    setFormError(null);
    setSearchResult(null);
    setSearchLoading(true);
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        setSearchResult({ uid: doc.data().uid, email: doc.data().email });
      } else {
        setFormError("No user found with that email.");
      }
    } catch (e) {
      setFormError("Error searching user.");
    }
    setSearchLoading(false);
  };

  const handleAddUser = () => {
    if (searchResult && !selectedUsers.some(u => u.uid === searchResult.uid)) {
      setSelectedUsers([...selectedUsers, searchResult]);
      setSearchResult(null);
      form.setValue('email', '');
    }
  };

  const handleRemoveUser = (uid: string) => {
    setSelectedUsers(selectedUsers.filter(u => u.uid !== uid));
  };

  const onSubmit = async (data: { groupName: string; email: string }) => {
    setCreating(true);
    setFormError(null);
    try {
      if (!data.groupName.trim()) {
        setFormError("Group name is required.");
        setCreating(false);
        return;
      }
      if (!user) {
        setFormError("You must be signed in.");
        setCreating(false);
        return;
      }
      // Always include current user as admin and member
      const userIds = Array.from(new Set([user.uid, ...selectedUsers.map(u => u.uid)]));
      await addGroup(data.groupName, userIds, user.uid);
      form.reset();
      setSelectedUsers([]);
    } catch (e) {
      setFormError("Error creating group.");
    }
    setCreating(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-zinc-900 p-6 rounded-xl shadow border mt-8">
      <h2 className="text-xl font-semibold mb-4">Create New Group</h2>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Form {...form}>
        <div className="mb-4">
          <FormField
            control={form.control}
            name="groupName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Group Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter group name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mb-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add User by Email</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input {...field} placeholder="Enter user email" disabled={searchLoading} />
                  </FormControl>
                  <Button type="button" onClick={() => handleSearch(field.value)} disabled={searchLoading || !field.value}>
                    {searchLoading ? "Searching..." : "Search"}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {searchResult && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm">{searchResult.email}</span>
              <Button type="button" size="sm" onClick={handleAddUser}>
                Add
              </Button>
            </div>
          )}
          {formError && <div className="text-red-500 text-xs mt-1">{formError}</div>}
        </div>
        <div className="mb-4">
          <Label>Selected Users</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {user && (
              <span className="px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-700 text-xs">
                {user.email} (You)
              </span>
            )}
            {selectedUsers.map(u => (
              <span key={u.uid} className="flex items-center px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-xs">
                {u.email}
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="ml-1"
                  onClick={() => handleRemoveUser(u.uid)}
                >
                  ×
                </Button>
              </span>
            ))}
          </div>
        </div>
        <Button
          className="w-full"
          type="submit"
          disabled={creating}
        >
          {creating ? "Creating..." : "Create Group"}
        </Button>
        </Form>
      </form>
    </div>
  );
};

export default AddGroup;
