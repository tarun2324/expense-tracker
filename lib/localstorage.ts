// Utility functions for localStorage group selection

export const GROUP_KEY = "selected-group-id";

export function setSelectedGroupId(groupId: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(GROUP_KEY, groupId);
  }
}

export function getSelectedGroupId(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(GROUP_KEY);
  }
  return null;
}

export function removeSelectedGroupId() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(GROUP_KEY);
  }
}
