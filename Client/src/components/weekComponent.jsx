import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CalendarWeekSelector = ({ values, handleChange }) => {
  const [selectedMonth, setSelectedMonth] = useState(moment().month());
  const [weeks, setWeeks] = useState([]);
  const [selectedWeekIndices, setSelectedWeekIndices] = useState([]);

  useEffect(() => {
    generateCalendar(selectedMonth);
  }, [selectedMonth]);

const generateCalendar = (monthIndex) => {
  const year = moment().year();
  const startOfMonth = moment([year, monthIndex]).startOf('month');
  const endOfMonth = moment([year, monthIndex]).endOf('month');

  const calendar = [];
  let current = startOfMonth.clone().startOf('week'); // includes previous month
  const lastDay = endOfMonth.clone().endOf('week');   // includes next month

  while (current.isSameOrBefore(lastDay)) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(current.clone());
      current.add(1, 'day');
    }
    calendar.push(week);
  }

  setWeeks(calendar);
};

const toggleWeekSelection = (weekIndex) => {
  let updated = [];

  if (selectedWeekIndices.includes(weekIndex)) {
    // Deselect if already selected
    updated = [];
  } else {
    // Select only the tapped week
    updated = [weekIndex];
  }

  setSelectedWeekIndices(updated);

  const selectedLabels = updated.map((i) => {
    const start = weeks[i][0].format('MMM D');
    const end = weeks[i][6].format('D');
    return `${start} - ${end}`;
  });

  // 🗓️ Set start and end to that week's range
  let overallStart = '';
  let overallEnd = '';
  if (updated.length === 1) {
    overallStart = weeks[updated[0]][0].format('YYYY-MM-DD');
    overallEnd = weeks[updated[0]][6].format('YYYY-MM-DD');
  }

  // Update Formik fields
  handleChange('totalWeeks')(selectedLabels.join(', '));
  handleChange('start')(overallStart);
  handleChange('end')(overallEnd);
};

  const getColorForWeek = (index) => {
    const colors = ['#FFCDD2', '#F8BBD0', '#E1BEE7', '#D1C4E9', '#C5CAE9', '#B2DFDB', '#FFF9C4'];
    return colors[index % colors.length];
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
          {Array.from({ length: 12 }, (_, i) => (
            <Picker.Item key={i} label={moment().month(i).format('MMMM')} value={i} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>📅 Calendar View</Text>
      <View style={styles.calendar}>
  <View style={styles.weekRow}>
    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
      <Text key={day} style={styles.dayHeader}>{day}</Text>
    ))}
  </View>

  {weeks.map((week, index) => (
    <TouchableOpacity
      key={index}
      style={styles.weekContainer}
      onPress={() => toggleWeekSelection(index)}
    >
      <View
        style={[
          styles.weekRow,
          selectedWeekIndices.includes(index) && {
            backgroundColor: getColorForWeek(index),
          },
        ]}
      >
        {week.map((day, i) => (
          <Text
  key={i}
  style={[
    styles.dayCell,
    day.month() !== selectedMonth && { color: '#9CA3AF' }, // Tailwind gray-400
  ]}
>
  {day.date()}
</Text>

        ))}
      </View>
    </TouchableOpacity>
  ))}
</View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 6,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    color: '#111827',
  },
   calendar: {
    gap: 4,
    padding:4,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4B5563',
  },
  weekContainer: {
    borderWidth: 2,
    borderColor: '#4B5563', // Gray border
    borderRadius: 10,
    marginBottom: 2,
    overflow: 'hidden',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  dayHeader: {
    width: '13%',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
  dayCell: {
    width: '13%',
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
  },

});

export default CalendarWeekSelector;