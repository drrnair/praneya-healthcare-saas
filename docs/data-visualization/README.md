# Praneya Data Visualization Suite

A comprehensive, healthcare-focused data visualization library that transforms complex health data into intuitive, actionable insights while maintaining emotional engagement and clinical trust.

## 🎯 Overview

The Praneya Data Visualization Suite consists of six main component categories designed specifically for healthcare applications:

1. **Health Trend Dashboard** - Biometric trend tracking with interactive timelines
2. **Nutrition Balance Wheel** - Macronutrient visualization with goal tracking  
3. **Family Health Overview** - Multi-member dashboards with privacy controls
4. **Medication Adherence Tracker** - Calendar heatmaps with streak tracking
5. **AI Recipe & Nutrition Analysis** - Interactive recipe breakdowns with substitutions
6. **Clinical Data Integration** - Lab values and clinical correlation displays

## 🚀 Quick Start

### Installation

The visualization components are included as part of the Praneya platform. No additional installation required.

### Basic Usage

```tsx
import { 
  VisualizationProvider,
  HealthTrendChart,
  createHealthMetric 
} from '@/lib/data-visualization';

// Create sample data
const bloodPressure = createHealthMetric(
  'Blood Pressure (Systolic)', 
  128, 
  'mmHg'
);

function HealthDashboard() {
  return (
    <VisualizationProvider>
      <HealthTrendChart 
        metrics={[bloodPressure]}
        showGoals={true}
        enableInteraction={true}
      />
    </VisualizationProvider>
  );
}
```

## 📊 Component Reference

### VisualizationProvider

The core provider that manages visualization state, accessibility, and healthcare-specific configurations.

```tsx
interface VisualizationProviderProps {
  children: React.ReactNode;
  initialTheme?: 'healthcare' | 'accessible' | 'high-contrast';
}

<VisualizationProvider initialTheme="healthcare">
  {/* Your visualization components */}
</VisualizationProvider>
```

**Features:**
- Real-time data updates via WebSocket
- Accessibility announcements for screen readers
- HIPAA-compliant data handling
- Gamification system integration
- Family privacy controls

### HealthTrendChart

Interactive line charts for biometric trends with color-coded health zones.

```tsx
interface HealthTrendChartProps {
  metrics: HealthMetric[];
  selectedMetricId?: string;
  height?: number;
  showGoals?: boolean;
  enableInteraction?: boolean;
  className?: string;
}

<HealthTrendChart
  metrics={healthMetrics}
  height={400}
  showGoals={true}
  enableInteraction={true}
/>
```

**Features:**
- Animated trend lines with smooth transitions
- Health zone background indicators (optimal, caution, warning)
- Interactive data point hover effects
- Time range selection (day/week/month/year)
- Milestone markers with achievement indicators

### NutritionBalanceWheel

Interactive donut charts for macronutrient balance with real-time updates.

```tsx
interface NutritionBalanceWheelProps {
  data: NutritionData;
  showGoals?: boolean;
  enableInteraction?: boolean;
  size?: number;
  className?: string;
}

<NutritionBalanceWheel
  data={nutritionData}
  showGoals={true}
  enableInteraction={true}
  size={350}
/>
```

**Features:**
- Color-coded macronutrient segments
- Smooth morphing animations between views
- Interactive hover tooltips
- Progress indicators for goal achievement
- Deficiency alerts with gentle guidance

### FamilyHealthOverview

Multi-member health dashboard with privacy controls and collaborative features.

```tsx
interface FamilyHealthOverviewProps {
  members: FamilyMember[];
  currentUserId: string;
  showPrivacyControls?: boolean;
  enableChallenges?: boolean;
  className?: string;
}

<FamilyHealthOverview
  members={familyMembers}
  currentUserId="user1"
  showPrivacyControls={true}
  enableChallenges={true}
/>
```

**Features:**
- Granular privacy level controls
- Family challenge leaderboards
- Achievement sharing system
- Emergency health status indicators
- Age-appropriate content filtering

### MedicationAdherenceTracker

Calendar heatmap visualization for medication consistency with streak tracking.

```tsx
interface MedicationAdherenceTrackerProps {
  medications: MedicationAdherence[];
  selectedMedicationId?: string;
  showStreaks?: boolean;
  showRecoveryTips?: boolean;
  className?: string;
}

<MedicationAdherenceTracker
  medications={medicationData}
  showStreaks={true}
  showRecoveryTips={true}
/>
```

**Features:**
- Color-coded adherence heatmap
- Interactive day-by-day tracking
- Streak visualization and celebration
- Missed dose recovery suggestions
- Drug interaction warnings

### AIRecipeAnalysis

Interactive nutritional breakdown with ingredient substitutions and allergen highlighting.

```tsx
interface AIRecipeAnalysisProps {
  recipe: Recipe;
  userAllergens?: string[];
  userDietaryRestrictions?: string[];
  showSubstitutions?: boolean;
  enableRating?: boolean;
  className?: string;
}

<AIRecipeAnalysis
  recipe={recipeData}
  userAllergens={['sesame', 'nuts']}
  showSubstitutions={true}
  enableRating={true}
/>
```

**Features:**
- Real-time allergen detection and warnings
- Intelligent ingredient substitution suggestions
- Health goal alignment scoring
- Interactive nutritional breakdown
- Recipe rating and feedback system

## 🎨 Theming & Customization

### Color Themes

The visualization suite supports three built-in themes:

```tsx
// Healthcare theme (default)
const healthcareTheme = {
  primary: '#0891B2',
  secondary: '#10B981',
  zones: {
    optimal: '#22C55E',
    caution: '#F59E0B',
    warning: '#EF4444',
    critical: '#DC2626'
  }
};

// Accessible theme
const accessibleTheme = {
  primary: '#1F2937',
  secondary: '#374151',
  zones: {
    optimal: '#059669',
    caution: '#D97706',
    warning: '#DC2626',
    critical: '#991B1B'
  }
};

// High contrast theme
const highContrastTheme = {
  primary: '#000000',
  secondary: '#FFFFFF',
  zones: {
    optimal: '#00FF00',
    caution: '#FFFF00',
    warning: '#FF0000',
    critical: '#FF0000'
  }
};
```

### Custom Theme Configuration

```tsx
const customTheme = {
  primary: '#your-primary-color',
  secondary: '#your-secondary-color',
  zones: {
    optimal: '#your-optimal-color',
    caution: '#your-caution-color',
    warning: '#your-warning-color',
    critical: '#your-critical-color'
  }
};

<VisualizationProvider customTheme={customTheme}>
  {/* Your components */}
</VisualizationProvider>
```

## ♿ Accessibility

### WCAG 2.2 AA Compliance

All visualization components are designed to meet WCAG 2.2 AA standards:

- **Screen Reader Support**: Comprehensive ARIA labels and descriptions
- **Keyboard Navigation**: Full keyboard accessibility for all interactive elements
- **High Contrast**: Support for high contrast mode and custom color schemes
- **Reduced Motion**: Respects user's reduced motion preferences
- **Alternative Text**: Detailed alternative text for all visualizations

### Accessibility Features

```tsx
// Screen reader announcements
const { announceDataChange } = useVisualization();
announceDataChange('Blood pressure updated to 128/82 mmHg');

// Alternative text generation
const { getAlternativeText } = useVisualization();
const altText = getAlternativeText('health-trend', {
  metrics: healthMetrics,
  summary: 'Blood pressure trending downward over past week'
});

// Reduced motion detection
const { isReducedMotion } = useVisualization();
```

## 🔧 Configuration Options

### Real-Time Updates

```tsx
// Enable WebSocket connections for real-time data
const { subscribeToUpdates } = useVisualization();

useEffect(() => {
  const unsubscribe = subscribeToUpdates((update) => {
    console.log('Real-time update:', update);
    // Handle data updates
  });
  
  return unsubscribe;
}, []);
```

### Gamification Integration

```tsx
// Trigger achievements and celebrations
const { triggerAchievement, celebrateProgress } = useVisualization();

// Unlock achievement
triggerAchievement({
  id: 'week-streak',
  title: 'Week Streak',
  description: 'Logged data for 7 consecutive days',
  icon: '🔥',
  category: 'consistency',
  rarity: 'common'
});

// Celebrate progress
celebrateProgress('weight-loss', 5.2); // 5.2% improvement
```

### Data Operations

```tsx
// Update health metrics
const { updateHealthMetric } = useVisualization();

updateHealthMetric({
  id: 'blood_pressure',
  name: 'Blood Pressure',
  value: 125,
  unit: 'mmHg',
  timestamp: new Date(),
  trend: 'improving',
  source: 'device'
});

// Add nutrition data
const { addNutritionEntry } = useVisualization();

addNutritionEntry({
  calories: 1850,
  protein: 125,
  carbs: 220,
  fat: 65,
  timestamp: new Date()
});
```

## 🏥 Healthcare-Specific Features

### HIPAA Compliance

- **Data Encryption**: All visualization data is encrypted in transit and at rest
- **Access Logging**: Comprehensive audit trails for all data access
- **Privacy Controls**: Granular privacy settings for family members
- **Consent Management**: Integrated consent workflows for data sharing

### Clinical Safety

- **Accuracy Indicators**: Clear attribution of data sources
- **Medical Disclaimers**: Integrated disclaimers for clinical interpretations  
- **Emergency Protocols**: Automatic escalation for critical values
- **Provider Integration**: Secure sharing with healthcare providers

### Emergency Handling

```tsx
// Emergency value detection
const isEmergencyValue = (value: number, metric: HealthMetric) => {
  return value > metric.range.warning.max || value < metric.range.warning.min;
};

// Emergency notification
if (isEmergencyValue(bloodPressureValue, bloodPressureMetric)) {
  triggerEmergencyAlert({
    metric: 'Blood Pressure',
    value: bloodPressureValue,
    severity: 'critical',
    recommendedAction: 'Contact healthcare provider immediately'
  });
}
```

## 📱 Mobile Optimization

### Responsive Design

All visualization components are optimized for mobile devices:

- **Touch-Friendly**: Large touch targets and gesture support
- **Adaptive Sizing**: Charts resize appropriately for screen size
- **Performance**: Optimized rendering for mobile devices
- **Offline Support**: PWA features for offline data viewing

### Mobile-Specific Features

```tsx
// Touch gesture support
const handleSwipe = (direction: 'left' | 'right') => {
  if (direction === 'left') {
    setTimeRange('week');
  } else {
    setTimeRange('day');
  }
};

// Haptic feedback (iOS/Android)
const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy') => {
  if ('vibrate' in navigator) {
    navigator.vibrate(type === 'light' ? 50 : type === 'medium' ? 100 : 200);
  }
};
```

## 🧪 Testing

### Component Testing

```tsx
import { render, screen } from '@testing-library/react';
import { VisualizationProvider, HealthTrendChart } from '@/lib/data-visualization';

test('renders health trend chart with metrics', () => {
  const metrics = [createHealthMetric('Test Metric', 100, 'units')];
  
  render(
    <VisualizationProvider>
      <HealthTrendChart metrics={metrics} />
    </VisualizationProvider>
  );
  
  expect(screen.getByText('Test Metric')).toBeInTheDocument();
});
```

### Accessibility Testing

```tsx
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('health trend chart has no accessibility violations', async () => {
  const { container } = render(
    <VisualizationProvider>
      <HealthTrendChart metrics={testMetrics} />
    </VisualizationProvider>
  );
  
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## 🚀 Performance Optimization

### Rendering Performance

- **GPU Acceleration**: Utilizes CSS transforms and GPU acceleration
- **Virtual Scrolling**: For large datasets in family dashboards
- **Lazy Loading**: Charts load only when visible
- **Memoization**: React.memo and useMemo for expensive calculations

### Data Processing

```tsx
// Efficient data processing with useMemo
const processedData = useMemo(() => {
  return healthMetrics.map(metric => ({
    ...metric,
    trend: calculateTrend(metric.historicalData),
    healthScore: calculateHealthScore(metric)
  }));
}, [healthMetrics]);

// Debounced updates for real-time data
const debouncedUpdate = useMemo(
  () => debounce(updateHealthMetric, 300),
  [updateHealthMetric]
);
```

## 🔮 Future Enhancements

### Planned Features

- **3D Visualizations**: Advanced 3D charts for complex medical data
- **AR Integration**: Augmented reality overlays for device data
- **Voice Interaction**: Voice commands for data entry and navigation
- **Predictive Analytics**: ML-powered health trend predictions
- **Wearable Integration**: Direct integration with health devices

### Roadmap

- **Q1 2024**: Advanced AI insights and predictive modeling
- **Q2 2024**: Wearable device integration and real-time sync
- **Q3 2024**: Voice interaction and accessibility enhancements
- **Q4 2024**: AR/VR visualization capabilities

## 💡 Best Practices

### Data Visualization Guidelines

1. **Progressive Disclosure**: Start with summary, allow drill-down
2. **Color Coding**: Use consistent health zone colors throughout
3. **Animation Timing**: Respect reduced motion preferences
4. **Error States**: Provide clear guidance for data issues
5. **Loading States**: Maintain engagement during data processing

### Healthcare UX Principles

1. **Trust Building**: Use clinical color schemes and professional styling
2. **Non-Judgmental**: Present data without blame or shame
3. **Actionable Insights**: Always provide next steps or recommendations
4. **Emergency Clarity**: Make critical values immediately obvious
5. **Family Safety**: Ensure age-appropriate content and privacy

## 📞 Support

For questions, issues, or feature requests related to the data visualization suite:

- **Documentation**: [/docs/data-visualization](./README.md)
- **Issues**: [GitHub Issues](https://github.com/your-org/praneya-saas/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/praneya-saas/discussions)
- **Email**: visualization-support@praneya.health

---

**Built with ❤️ for Healthcare by the Praneya Team** 