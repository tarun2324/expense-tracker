"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { GroupMeta } from "@/lib/database.schema";
import { getGroupsForUser } from "@/lib/database";
import { getSelectedGroupId, setSelectedGroupId } from "@/lib/localstorage";
import { useAuthUserContext } from "@/context/AuthContext";

interface GroupContextType {
  groups: GroupMeta[];
  selectedGroup: GroupMeta | null;
  setSelectedGroupId: (groupId: string) => void;
  loading: boolean;
}

const GroupContext = createContext<GroupContextType>({
  groups: [],
  selectedGroup: null,
  setSelectedGroupId: () => {},
  loading: true,
});

export const useGroupContext = () => useContext(GroupContext);

export const GroupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthUserContext();
  const [groups, setGroups] = useState<GroupMeta[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<GroupMeta | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch groups for user
  useEffect(() => {
    if (!user) {
      setGroups([]);
      setSelectedGroup(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getGroupsForUser(user.uid).then((fetchedGroups) => {
      setGroups(fetchedGroups);
      // Try to restore selected group from localStorage
      const storedGroupId = getSelectedGroupId();
      const found = fetchedGroups.find(g => g.id === storedGroupId);
      setSelectedGroup(found || fetchedGroups[0]);
      setLoading(false);
    });
  }, [user]);

  // Update localStorage when selectedGroup changes
  useEffect(() => {
    if (selectedGroup) {
      setSelectedGroupId(selectedGroup.id);
    }
  }, [selectedGroup]);

  const handleSetSelectedGroupId = (groupId: string) => {
    const found = groups.find(g => g.id === groupId);
    setSelectedGroup(found || null);
  };

  return (
    <GroupContext.Provider value={{ groups, selectedGroup, setSelectedGroupId: handleSetSelectedGroupId, loading }}>
      {children}
    </GroupContext.Provider>
  );
};
