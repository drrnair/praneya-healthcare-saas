'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVisualization, MedicationAdherence, colorPalettes } from '../VisualizationProvider';

interface MedicationAdherenceTrackerProps {
  medications: MedicationAdherence[];
  selectedMedicationId?: string;
  showStreaks?: boolean;
  showRecoveryTips?: boolean;
  className?: string;
}

interface CalendarDay {
  date: Date;
  taken: boolean;
  missed: boolean;
  scheduled: boolean;
  isToday: boolean;
  isFuture: boolean;
}

export function MedicationAdherenceTracker({
  medications = [],
  selectedMedicationId,
  showStreaks = true,
  showRecoveryTips = true,
  className = ''
}: MedicationAdherenceTrackerProps) {
  const { 
    isReducedMotion, 
    colorTheme, 
    timeRange,
    announceDataChange 
  } = useVisualization();
  
  const [selectedMedication, setSelectedMedication] = useState<MedicationAdherence | null>(
    medications.find(m => m.medicationId === selectedMedicationId) || medications[0] || null
  );
  const [hoveredDay, setHoveredDay] = useState<CalendarDay | null>(null);
  const [showMissedDoseModal, setShowMissedDoseModal] = useState(false);
  
  const colors = colorPalettes[colorTheme];
  
  // Generate calendar data for the selected medication
  const generateCalendarData = (medication: MedicationAdherence): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const today = new Date();
    const startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    const endDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days ahead
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const currentDate = new Date(date);
      const isToday = currentDate.toDateString() === today.toDateString();
      const isFuture = currentDate > today;
      const isMissed = medication.missedDoses.some(missedDate => 
        missedDate.toDateString() === currentDate.toDateString()
      );
      
      // Simulate medication schedule (every day for demo)
      const scheduled = !isFuture;
      const taken = scheduled && !isMissed && Math.random() > 0.1; // 90% adherence simulation
      
      days.push({
        date: currentDate,
        taken,
        missed: isMissed,
        scheduled,
        isToday,
        isFuture
      });
    }
    
    return days;
  };
  
  const calendarData = selectedMedication ? generateCalendarData(selectedMedication) : [];
  
  // Calculate streak information
  const calculateStreaks = (days: CalendarDay[]) => {
    const scheduledDays = days.filter(d => d.scheduled && !d.isFuture);
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    // Calculate current streak (from most recent)
    for (let i = scheduledDays.length - 1; i >= 0; i--) {
      if (scheduledDays[i].taken) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    // Calculate longest streak
    scheduledDays.forEach(day => {
      if (day.taken) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    });
    
    return { currentStreak, longestStreak };
  };
  
  const streaks = selectedMedication ? calculateStreaks(calendarData) : { currentStreak: 0, longestStreak: 0 };
  
  // Handle medication selection
  const handleMedicationSelect = (medication: MedicationAdherence) => {
    setSelectedMedication(medication);
    announceDataChange(`Selected ${medication.medicationName} adherence tracker`);
  };
  
  // Handle day hover
  const handleDayHover = (day: CalendarDay | null) => {
    setHoveredDay(day);
    
    if (day && selectedMedication) {
      const status = day.isFuture ? 'scheduled' : 
                    day.taken ? 'taken' : 
                    day.missed ? 'missed' : 'not scheduled';
      announceDataChange(`${day.date.toLocaleDateString()}: ${selectedMedication.medicationName} ${status}`);
    }
  };
  
  // Get day color based on status
  const getDayColor = (day: CalendarDay): string => {
    if (day.isFuture) return colors.neutral + '40';
    if (day.taken) return colors.zones.optimal;
    if (day.missed) return colors.zones.warning;
    if (day.scheduled) return colors.zones.caution;
    return colors.neutral + '20';
  };
  
  // Recovery tips for missed doses
  const getRecoveryTips = (medication: MedicationAdherence): string[] => {
    const tips = [
      `Set reminders for ${medication.medicationName} at consistent times`,
      'Use a pill organizer to prepare doses weekly',
      'Keep medication visible as a visual reminder',
      'Ask family members to help remind you',
      'Consider using a medication app with notifications'
    ];
    
    return tips.slice(0, 3);
  };
  
  if (!selectedMedication) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <span className="text-4xl mb-2 block">💊</span>
          <p>No medications to track</p>
          <p className="text-sm">Add medications to monitor adherence</p>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div
      className={`bg-white rounded-lg shadow-lg p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: isReducedMotion ? 0.1 : 0.5 }}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Medication Adherence</h3>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              selectedMedication.adherenceRate >= 90 ? 'bg-green-100 text-green-800' :
              selectedMedication.adherenceRate >= 70 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {selectedMedication.adherenceRate}% adherence
            </span>
          </div>
        </div>
        
        {/* Medication selector */}
        <div className="flex flex-wrap gap-2 mb-4">
          {medications.map((medication) => (
            <motion.button
              key={medication.medicationId}
              onClick={() => handleMedicationSelect(medication)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedMedication.medicationId === medication.medicationId
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              whileHover={isReducedMotion ? {} : { scale: 1.02 }}
              whileTap={isReducedMotion ? {} : { scale: 0.98 }}
            >
              {medication.medicationName}
            </motion.button>
          ))}
        </div>
        
        {/* Medication info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{selectedMedication.dosage}</div>
            <div className="text-sm text-gray-500">Dosage</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{selectedMedication.frequency}</div>
            <div className="text-sm text-gray-500">Frequency</div>
          </div>
          {showStreaks && (
            <>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{streaks.currentStreak}</div>
                <div className="text-sm text-gray-500">Current Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{streaks.longestStreak}</div>
                <div className="text-sm text-gray-500">Best Streak</div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Calendar heatmap */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Adherence Calendar</h4>
        
        <div className="grid grid-cols-7 gap-1 mb-4">
          {/* Week headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-xs text-gray-500 text-center p-1 font-medium">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarData.map((day, index) => (
            <motion.div
              key={index}
              className="aspect-square flex items-center justify-center rounded cursor-pointer relative"
              style={{ backgroundColor: getDayColor(day) }}
              onMouseEnter={() => handleDayHover(day)}
              onMouseLeave={() => handleDayHover(null)}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: isReducedMotion ? 0.1 : 0.2, 
                delay: isReducedMotion ? 0 : index * 0.01 
              }}
              whileHover={isReducedMotion ? {} : { scale: 1.1 }}
            >
              <span className="text-xs text-gray-700 font-medium">
                {day.date.getDate()}
              </span>
              
              {/* Status indicators */}
              {day.taken && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-green-600 rounded-full transform translate-x-1 -translate-y-1" />
              )}
              {day.missed && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full transform translate-x-1 -translate-y-1" />
              )}
              {day.isToday && (
                <div className="absolute inset-0 border-2 border-blue-600 rounded" />
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: colors.zones.optimal }} />
            <span>Taken</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: colors.zones.warning }} />
            <span>Missed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: colors.neutral + '40' }} />
            <span>Future</span>
          </div>
        </div>
      </div>
      
      {/* Next dose reminder */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-blue-800">Next Dose</h4>
            <p className="text-blue-700">
              {selectedMedication.medicationName} - {selectedMedication.dosage}
            </p>
            <p className="text-sm text-blue-600">
              Due: {selectedMedication.nextDue.toLocaleString()}
            </p>
          </div>
          <motion.button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            whileHover={isReducedMotion ? {} : { scale: 1.02 }}
            whileTap={isReducedMotion ? {} : { scale: 0.98 }}
            onClick={() => announceDataChange('Medication taken')}
          >
            Mark as Taken
          </motion.button>
        </div>
      </div>
      
      {/* Drug interactions warning */}
      {selectedMedication.interactions.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center mb-2">
            <span className="text-yellow-600 mr-2">⚠️</span>
            <h4 className="font-semibold text-yellow-800">Drug Interactions</h4>
          </div>
          <ul className="text-sm text-yellow-700 space-y-1">
            {selectedMedication.interactions.map((interaction, index) => (
              <li key={index}>• {interaction}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Recovery tips for missed doses */}
      {showRecoveryTips && selectedMedication.adherenceRate < 90 && (
        <motion.div
          className="p-4 bg-green-50 border border-green-200 rounded-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center mb-2">
            <span className="text-green-600 mr-2">💡</span>
            <h4 className="font-semibold text-green-800">Adherence Tips</h4>
          </div>
          <ul className="text-sm text-green-700 space-y-1">
            {getRecoveryTips(selectedMedication).map((tip, index) => (
              <li key={index}>• {tip}</li>
            ))}
          </ul>
        </motion.div>
      )}
      
      {/* Hover tooltip */}
      <AnimatePresence>
        {hoveredDay && (
          <motion.div
            className="fixed bg-gray-800 text-white p-3 rounded-lg shadow-lg pointer-events-none z-10"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-center">
              <div className="font-semibold">{hoveredDay.date.toLocaleDateString()}</div>
              <div className="text-sm">
                {hoveredDay.isFuture ? 'Scheduled' :
                 hoveredDay.taken ? 'Taken ✓' :
                 hoveredDay.missed ? 'Missed ✗' :
                 'Not scheduled'}
              </div>
              {hoveredDay.taken && (
                <div className="text-xs text-green-400 mt-1">Great job!</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 