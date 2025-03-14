import React, { useEffect, useState } from "react";
import { Calendar } from "./ui/calendar";

interface CalendarDailyEntryProps {
    defaultDate?: string;
}

const CalendarDailyEntry: React.FC<CalendarDailyEntryProps> = ({ defaultDate }) => {
    const [date, setDate] = useState<Date | undefined>(undefined);

    useEffect(() => {
        if (defaultDate) {
            const utcDate = new Date(defaultDate + "T00:00:00Z");
            setDate(utcDate);
        } else {
            setDate(new Date());
        }
    }, [defaultDate]);

    const handleDateSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate);

        if (selectedDate) {
            const formattedDate = new Date(selectedDate);
            formattedDate.setDate(formattedDate.getDate() + 1);
            const formattedDateString = formattedDate.toISOString().split("T")[0];
            if (typeof window !== "undefined") {
                window.location.href = `/nutrition/daily-entry/${formattedDateString}`;
            }
        }
    };

    return (
        <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="rounded-md border"
            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
        />
    );
};

export default CalendarDailyEntry;
