'use client';
import React from "react";

type TabItem = {
  value: string;
  label: string;
  className?: string;
};

type GroupBtnProps = {
  items: TabItem[];
  selected: TabItem["value"];
  onClick: (value: TabItem["value"]) => void;
  className?: string;
  itemClassName?: string;
};

const GroupBtn: React.FC<GroupBtnProps> = ({
  items,
  selected,
  onClick,
  className = "",
  itemClassName = "",
}) => {
  return (
    <div className={`inline-flex rounded-xl overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 ${className}`}>
      {items.map((item, idx) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onClick(item.value)}
          className={`px-4 py-2 text-sm font-semibold transition-colors duration-200
            ${idx === 0 ? 'rounded-l-xl' : ''}
            ${idx === items.length - 1 ? 'rounded-r-xl' : ''}
            ${
              selected === item.value
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
                : 'bg-transparent text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }
            ${itemClassName}
            ${item.className ?? ""}
          `}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default GroupBtn;
