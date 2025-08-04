import React, { useState } from 'react';

interface CalendarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function getDayName(date: Date) {
  return weekdays[date.getDay()];
}
function getMonthName(date: Date) {
  return months[date.getMonth()];
}
function getDatesForWeek(currentDate: Date) {
  const dayOfWeek = currentDate.getDay();
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - dayOfWeek);
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    dates.push(d);
  }
  return dates;
}
function getDaysInMonth(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: (Date | null)[] = [];
  const startDayOfWeek = firstDay.getDay();
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  return days;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, setSelectedDate }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonthForCalendar, setCurrentMonthForCalendar] = useState<Date>(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  );

  const weekDates = getDatesForWeek(selectedDate);
  const daysInCurrentCalendarMonth = getDaysInMonth(currentMonthForCalendar);

  const handlePrevMonthForCalendar = () => {
    setCurrentMonthForCalendar(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const handleNextMonthForCalendar = () => {
    setCurrentMonthForCalendar(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  const handleDateClickInCalendar = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      setShowCalendar(false);
    }
  };

  return (
    <>
      <div className="flex flex-row flex-wrap items-start justify-between mb-6">
        <div
          className="text-xl font-bold text-zinc-900 dark:text-white cursor-pointer flex items-center"
          onClick={() => {
            setShowCalendar(!showCalendar);
            setCurrentMonthForCalendar(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
          }}
        >
          {getMonthName(selectedDate)}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 mx-1 transition-transform duration-300 ${showCalendar ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex space-x-1 sm:space-x-2 w-full sm:w-auto justify-between sm:justify-start">
          {weekDates.map((date, index) => (
            <button
              key={index}
              onClick={() => setSelectedDate(date)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex flex-col items-center justify-center text-xs font-medium transition-all duration-200
                ${
                  date.toDateString() === new Date().toDateString()
                    ? 'bg-black text-white shadow-lg'
                    : date.toDateString() === selectedDate.toDateString()
                    ? 'bg-white text-black dark:bg-white dark:text-black shadow-lg'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
            >
              <span>{getDayName(date).charAt(0)}</span>
              <span>{date.getDate()}</span>
            </button>
          ))}
        </div>
      </div>

      {showCalendar && (
        <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700 mb-6 w-full max-w-md mx-auto transition-colors">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handlePrevMonthForCalendar}
              className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zinc-700 dark:text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h3 className="text-base sm:text-lg font-semibold text-zinc-800 dark:text-zinc-200 text-center flex-1">
              {currentMonthForCalendar.toLocaleString('default', { month: 'long' })} {currentMonthForCalendar.getFullYear()}
            </h3>
            <button
              onClick={handleNextMonthForCalendar}
              className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zinc-700 dark:text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs sm:text-sm mb-2">
            {weekdays.map(day => (
              <div key={day} className="font-medium text-zinc-500 dark:text-zinc-400">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {daysInCurrentCalendarMonth.map((date, index) => (
              <button
                key={index}
                onClick={() => handleDateClickInCalendar(date)}
                className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full transition-all duration-200
                  ${
                    date
                      ? date.toDateString() === selectedDate.toDateString()
                        ? 'bg-white text-black dark:bg-white dark:text-black shadow-md'
                        : date.toDateString() === new Date().toDateString()
                        ? 'bg-black text-white shadow-md'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                      : 'cursor-default'
                  }`}
                disabled={!date}
              >
                {date ? date.getDate() : ''}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Calendar;
