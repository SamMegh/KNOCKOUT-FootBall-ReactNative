import { Picker } from "@react-native-picker/picker";
import moment from "moment";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CalendarWeekSelector = ({ values, handleChange }) => {
  const [selectedMonth, setSelectedMonth] = useState(moment().month());
  const [weeks, setWeeks] = useState([]);
  const [selectedWeekIndices, setSelectedWeekIndices] = useState([]);

  useEffect(() => {
    generateCalendar(selectedMonth);
  }, [selectedMonth]);

  const generateCalendar = (monthIndex) => {
    const currentMonth = moment().month();
    const currentYear = moment().year();

    // If selected month is before current month, assume it's next year
    const year = monthIndex < currentMonth ? currentYear + 1 : currentYear;

    const startOfMonth = moment([year, monthIndex]).startOf("month");
    const endOfMonth = moment([year, monthIndex]).endOf("month");

    const calendar = [];
    let current = startOfMonth.clone().startOf("week");
    const lastDay = endOfMonth.clone().endOf("week");

    while (current.isSameOrBefore(lastDay)) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push(current.clone());
        current.add(1, "day");
      }
      calendar.push(week);
    }

    setWeeks(calendar);
  };

  const toggleWeekSelection = (weekIndex) => {
    const today = moment().startOf("day");
    const weekStart = weeks[weekIndex][0].clone().startOf("day");

    // ❌ Block if week already started (past or current)
    if (weekStart.isSameOrBefore(today)) return;

    // ✅ Only future weeks selectable
    const updated = [weekIndex];
    setSelectedWeekIndices(updated);

    const start = weeks[weekIndex][0].format("YYYY-MM-DD");
    const end = weeks[weekIndex][6].format("YYYY-MM-DD");

    handleChange("totalWeeks")("1");
    handleChange("start")(start);
    handleChange("end")(end);
  };

  return (
    <View style={{ gap: 10 }}>
      <Text style={styles.label}>📅 Select Month</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedMonth}
          onValueChange={(itemValue) => setSelectedMonth(itemValue)}
          style={styles.picker}
        >
          {Array.from({ length: 12 }, (_, i) => {
            const now = moment();
            const currentMonth = now.month();
            const currentYear = now.year();
            const year = i < currentMonth ? currentYear + 1 : currentYear;

            return (
              <Picker.Item
                key={i}
                label={`${moment().month(i).format("MMMM")} ${year}`}
                value={i}
              />
            );
          })}
        </Picker>
      </View>

      <Text style={styles.label}>📅 Calendar View</Text>
      <View style={styles.calendar}>
        <View style={styles.weekRow}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <Text key={day} style={styles.dayHeader}>
              {day}
            </Text>
          ))}
        </View>

        {weeks.map((week, index) => {
          const today = moment().startOf("day");
          const weekStart = week[0].clone().startOf("day");
          const isDisabled = weekStart.isSameOrBefore(today);
          const isSelected = selectedWeekIndices.includes(index);

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.weekContainer,
                isDisabled && styles.disabledWeek,
                isSelected && styles.selectedWeek,
              ]}
              onPress={() => toggleWeekSelection(index)}
              disabled={isDisabled}
            >
              <View style={styles.weekRow}>
                {week.map((day, i) => (
                  <Text
                    key={i}
                    style={[
                      styles.dayCell,
                      day.month() !== selectedMonth && { color: "#9CA3AF" },
                      isSelected && styles.selectedText,
                      isDisabled && styles.disabledText,
                    ]}
                  >
                    {day.date()}
                  </Text>
                ))}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 6,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
    color: "#111827",
  },
  calendar: {
    gap: 4,
    padding: 4,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#4B5563",
  },
  weekContainer: {
    borderWidth: 2,
    borderColor: "#4B5563",
    borderRadius: 10,
    marginBottom: 4,
    overflow: "hidden",
  },
  disabledWeek: {
    opacity: 0.5,
    backgroundColor: "#1f2937", // Tailwind gray-800
  },
  selectedWeek: {
    backgroundColor: "#2563eb", // Tailwind blue-600
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  dayHeader: {
    width: "13%",
    textAlign: "center",
    fontWeight: "bold",
    color: "#fff",
  },
  dayCell: {
    width: "13%",
    textAlign: "center",
    color: "#fff",
    fontSize: 14,
  },
  selectedText: {
    color: "#fff",
    fontWeight: "bold",
  },
  disabledText: {
    color: "#9CA3AF",
  },
});

export default CalendarWeekSelector;
