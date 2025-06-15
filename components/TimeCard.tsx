import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface TimeRecord {
  id: string;
  type: 'clock_in' | 'clock_out';
  timestamp: string;
  date: string;
}

interface TimeCardProps {
  record: TimeRecord;
}

const TimeCard: React.FC<TimeCardProps> = ({ record }) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View style={[
            styles.typeIndicator,
            record.type === 'clock_in' ? styles.clockInIndicator : styles.clockOutIndicator
          ]} />
          <View>
            <Text style={styles.typeText}>
              {record.type === 'clock_in' ? 'Clock In' : 'Clock Out'}
            </Text>
            <Text style={styles.dateText}>{formatDate(record.timestamp)}</Text>
          </View>
        </View>
        <Text style={styles.timeText}>{formatTime(record.timestamp)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  clockInIndicator: {
    backgroundColor: '#4CAF50',
  },
  clockOutIndicator: {
    backgroundColor: '#f44336',
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});

export default TimeCard;