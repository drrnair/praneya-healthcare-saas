'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Wifi, 
  Battery, 
  Signal,
  Download,
  Share,
  Heart,
  Star,
  MessageCircle,
  Camera,
  Mic,
  MapPin,
  Bell,
  Settings,
  Zap,
  Activity,
  Plus
} from 'lucide-react';
import { 
  TouchButton, 
  SwipeableCard, 
  PullToRefresh, 
  FloatingActionButton,
  TouchRipple,
  GestureIndicator
} from '@/components/mobile/TouchOptimizedComponents';
import { 
  ResponsiveContainer, 
  ResponsiveGrid, 
  MobileStack, 
  LazyImage,
  useBreakpoints,
  usePerformanceMonitor
} from '@/components/mobile/ResponsiveLayout';

export default function MobileDemoPage() {
  const [activeDemo, setActiveDemo] = useState('overview');
  const [refreshCount, setRefreshCount] = useState(0);
  const [showGesture, setShowGesture] = useState(false);
  const [likedCards, setLikedCards] = useState<number[]>([]);
  
  const breakpoints = useBreakpoints();
  const performance = usePerformanceMonitor();

  const demoSections = [
    { id: 'overview', title: 'Overview', icon: Smartphone },
    { id: 'touch', title: 'Touch UI', icon: Heart },
    { id: 'gestures', title: 'Gestures', icon: Zap },
    { id: 'responsive', title: 'Responsive', icon: Monitor },
    { id: 'pwa', title: 'PWA Features', icon: Download },
    { id: 'performance', title: 'Performance', icon: Activity }
  ];

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshCount(prev => prev + 1);
  };

  const handleCardSwipe = (direction: 'left' | 'right', cardId: number) => {
    if (direction === 'right') {
      setLikedCards(prev => [...prev, cardId]);
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6"
        >
          <Smartphone size={32} className="text-primary-600" />
        </motion.div>
        
        <h1 className="text-3xl font-bold text-neutral-800 mb-4">
          Mobile-First Healthcare Experience
        </h1>
        
        <p className="text-lg text-neutral-600 mb-8">
          Optimized for 2025 mobile design principles with touch-friendly interfaces, 
          gesture navigation, and PWA capabilities.
        </p>
      </div>

      {/* Device Status Bar */}
      <div className="bg-neutral-900 text-white p-4 rounded-2xl">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Signal size={16} />
            <Wifi size={16} />
            <span className="font-mono">9:41 AM</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>100%</span>
            <Battery size={16} />
          </div>
        </div>
      </div>

      {/* Key Features Grid */}
      <ResponsiveGrid cols={{ base: 1, sm: 2, md: 3 }} gap="md">
        {[
          {
            icon: Heart,
            title: 'Touch-Optimized',
            description: '44px+ touch targets, haptic feedback, gesture support',
            color: 'text-red-500 bg-red-50'
          },
          {
            icon: Zap,
            title: 'High Performance',
            description: 'Lazy loading, virtual scrolling, optimized animations',
            color: 'text-yellow-500 bg-yellow-50'
          },
          {
            icon: Download,
            title: 'PWA Ready',
            description: 'Offline support, push notifications, app-like experience',
            color: 'text-blue-500 bg-blue-50'
          },
          {
            icon: Monitor,
            title: 'Responsive',
            description: 'Mobile-first design, breakpoint optimization',
            color: 'text-green-500 bg-green-50'
          },
          {
            icon: Activity,
            title: 'Accessible',
            description: 'Screen reader support, focus management, high contrast',
            color: 'text-purple-500 bg-purple-50'
          },
          {
            icon: Settings,
            title: 'Configurable',
            description: 'Dark mode, reduced motion, text scaling',
            color: 'text-gray-500 bg-gray-50'
          }
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-neutral-200"
          >
            <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
              <feature.icon size={24} />
            </div>
            <h3 className="font-semibold text-neutral-800 mb-2">{feature.title}</h3>
            <p className="text-sm text-neutral-600">{feature.description}</p>
          </motion.div>
        ))}
      </ResponsiveGrid>

      {/* Performance Metrics */}
      <div className="bg-neutral-50 rounded-xl p-6">
        <h3 className="font-semibold text-neutral-800 mb-4">Real-time Performance</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary-600">{performance.fps}</div>
            <div className="text-xs text-neutral-500">FPS</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-success-600">{performance.memory || 0}</div>
            <div className="text-xs text-neutral-500">MB Memory</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-warning-600">{performance.loadTime}</div>
            <div className="text-xs text-neutral-500">MS Load</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTouchUI = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-neutral-800 mb-4">Touch-Optimized Interface</h2>
        <p className="text-neutral-600 mb-8">
          All interactive elements meet minimum 44px touch targets with haptic feedback
        </p>
      </div>

      {/* Button Variants */}
      <div className="space-y-4">
        <h3 className="font-semibold text-neutral-800">Button Variants</h3>
        <MobileStack direction="vertical" spacing="md">
          <TouchButton size="lg" className="w-full">
            Primary Action Button
          </TouchButton>
          <TouchButton variant="secondary" size="lg" className="w-full">
            Secondary Action Button
          </TouchButton>
          <TouchButton variant="outline" size="lg" className="w-full">
            Outline Button
          </TouchButton>
          <TouchButton variant="ghost" size="lg" className="w-full">
            Ghost Button
          </TouchButton>
        </MobileStack>
      </div>

      {/* Touch Ripple Demo */}
      <div className="space-y-4">
        <h3 className="font-semibold text-neutral-800">Touch Ripple Effects</h3>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((id) => (
            <TouchRipple key={id} className="bg-primary-100 rounded-xl p-6 text-center">
              <div className="text-primary-600 font-semibold">Tap Me #{id}</div>
            </TouchRipple>
          ))}
        </div>
      </div>

      {/* Size Indicators */}
      <div className="bg-neutral-50 rounded-xl p-6">
        <h3 className="font-semibold text-neutral-800 mb-4">Touch Target Sizes</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-11 h-11 bg-success-200 rounded-lg flex items-center justify-center">
              <span className="text-xs font-bold">44px</span>
            </div>
            <div>
              <div className="font-medium">Minimum Touch Target</div>
              <div className="text-sm text-neutral-600">WCAG 2.1 AA compliant</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-200 rounded-lg flex items-center justify-center">
              <span className="text-xs font-bold">48px</span>
            </div>
            <div>
              <div className="font-medium">Comfortable Touch Target</div>
              <div className="text-sm text-neutral-600">Recommended for primary actions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGestures = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-neutral-800 mb-4">Gesture-Based Interactions</h2>
        <p className="text-neutral-600 mb-8">
          Swipe, pull-to-refresh, and long-press interactions
        </p>
      </div>

      {/* Pull to Refresh Demo */}
      <div>
        <h3 className="font-semibold text-neutral-800 mb-4">Pull to Refresh</h3>
        <PullToRefresh onRefresh={handleRefresh} className="h-64 bg-neutral-50 rounded-xl">
          <div className="p-6 text-center">
            <div className="text-neutral-600 mb-4">Pull down to refresh</div>
            <div className="text-2xl font-bold text-primary-600">Refreshed {refreshCount} times</div>
          </div>
        </PullToRefresh>
      </div>

      {/* Swipeable Cards */}
      <div>
        <h3 className="font-semibold text-neutral-800 mb-4">Swipeable Cards</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((cardId) => (
            <SwipeableCard
              key={cardId}
              onSwipeRight={() => handleCardSwipe('right', cardId)}
              onSwipeLeft={() => handleCardSwipe('left', cardId)}
              className="p-6"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Heart size={20} className={`${likedCards.includes(cardId) ? 'text-red-500' : 'text-primary-600'}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-neutral-800">Health Goal #{cardId}</h4>
                  <p className="text-sm text-neutral-600">
                    Swipe right to like, left to dismiss
                  </p>
                </div>
              </div>
            </SwipeableCard>
          ))}
        </div>
      </div>

      {/* Gesture Indicator Demo */}
      <div className="relative">
        <TouchButton 
          onClick={() => setShowGesture(!showGesture)}
          className="w-full"
        >
          Toggle Gesture Indicator
        </TouchButton>
        <GestureIndicator 
          direction="right" 
          visible={showGesture}
        />
      </div>
    </div>
  );

  const renderResponsive = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-neutral-800 mb-4">Responsive Design</h2>
        <p className="text-neutral-600 mb-8">
          Adaptive layouts for all device sizes
        </p>
      </div>

      {/* Current Breakpoint */}
      <div className="bg-neutral-50 rounded-xl p-6">
        <h3 className="font-semibold text-neutral-800 mb-4">Current Breakpoint</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {Object.entries(breakpoints).map(([breakpoint, active]) => (
            <div key={breakpoint} className={`p-2 rounded ${active ? 'bg-primary-100 text-primary-600' : 'text-neutral-500'}`}>
              {breakpoint}: {active ? 'Active' : 'Inactive'}
            </div>
          ))}
        </div>
      </div>

      {/* Responsive Grid Demo */}
      <div>
        <h3 className="font-semibold text-neutral-800 mb-4">Responsive Grid</h3>
        <ResponsiveGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} gap="md">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="bg-primary-100 rounded-lg p-4 text-center">
              <div className="font-semibold text-primary-600">Item {i + 1}</div>
            </div>
          ))}
        </ResponsiveGrid>
      </div>

      {/* Lazy Loading Images */}
      <div>
        <h3 className="font-semibold text-neutral-800 mb-4">Lazy Loading Images</h3>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <LazyImage
              key={i}
              src={`https://picsum.photos/300/200?random=${i}`}
              alt={`Demo image ${i + 1}`}
              width={300}
              height={200}
              className="rounded-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderPWA = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-neutral-800 mb-4">PWA Features</h2>
        <p className="text-neutral-600 mb-8">
          Progressive Web App capabilities for app-like experience
        </p>
      </div>

      {/* Installation Prompt */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Download size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Install Praneya Healthcare</h3>
            <p className="text-primary-100 text-sm mb-4">
              Get the full app experience with offline access and push notifications
            </p>
            <TouchButton variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
              Install App
            </TouchButton>
          </div>
        </div>
      </div>

      {/* PWA Features */}
      <ResponsiveGrid cols={{ base: 1, sm: 2 }} gap="md">
        {[
          {
            icon: Wifi,
            title: 'Offline Support',
            description: 'Access your health data even without internet connection',
            status: 'Active'
          },
          {
            icon: Bell,
            title: 'Push Notifications',
            description: 'Receive health reminders and important updates',
            status: 'Enabled'
          },
          {
            icon: Share,
            title: 'Native Sharing',
            description: 'Share health insights using device native sharing',
            status: 'Available'
          },
          {
            icon: Camera,
            title: 'Device Access',
            description: 'Camera access for food recognition and health logging',
            status: 'Permitted'
          }
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-neutral-200"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <feature.icon size={20} className="text-primary-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-neutral-800 mb-1">{feature.title}</h4>
                <p className="text-sm text-neutral-600 mb-2">{feature.description}</p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-600">
                  {feature.status}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </ResponsiveGrid>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-neutral-800 mb-4">Performance Optimization</h2>
        <p className="text-neutral-600 mb-8">
          Real-time performance monitoring and optimization features
        </p>
      </div>

      {/* Live Performance Metrics */}
      <div className="bg-neutral-900 text-white rounded-xl p-6">
        <h3 className="font-semibold mb-6">Live Performance Metrics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">{performance.fps}</div>
            <div className="text-neutral-300 text-sm">Frames Per Second</div>
            <div className="w-full bg-neutral-700 rounded-full h-2 mt-2">
              <div 
                className="bg-green-400 h-2 rounded-full" 
                style={{ width: `${Math.min(performance.fps / 60 * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">{performance.memory || 0}</div>
            <div className="text-neutral-300 text-sm">Memory Usage (MB)</div>
            <div className="w-full bg-neutral-700 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-400 h-2 rounded-full" 
                style={{ width: `${Math.min((performance.memory || 0) / 100 * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">{performance.loadTime}</div>
            <div className="text-neutral-300 text-sm">Load Time (ms)</div>
            <div className="w-full bg-neutral-700 rounded-full h-2 mt-2">
              <div 
                className="bg-yellow-400 h-2 rounded-full" 
                style={{ width: `${Math.max(100 - (performance.loadTime / 1000 * 100), 10)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Optimization Features */}
      <ResponsiveGrid cols={{ base: 1, sm: 2 }} gap="md">
        {[
          'Lazy loading images and components',
          'Virtual scrolling for large lists',
          'Code splitting and dynamic imports',
          'Service worker caching',
          'GPU-accelerated animations',
          'Debounced user interactions',
          'Optimized bundle sizes',
          'Critical CSS inlining'
        ].map((feature, index) => (
          <motion.div
            key={feature}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center space-x-3 bg-white rounded-lg p-4 shadow border border-neutral-200"
          >
            <div className="w-2 h-2 bg-success-500 rounded-full flex-shrink-0"></div>
            <span className="text-neutral-700">{feature}</span>
          </motion.div>
        ))}
      </ResponsiveGrid>
    </div>
  );

  const renderContent = () => {
    switch (activeDemo) {
      case 'overview': return renderOverview();
      case 'touch': return renderTouchUI();
      case 'gestures': return renderGestures();
      case 'responsive': return renderResponsive();
      case 'pwa': return renderPWA();
      case 'performance': return renderPerformance();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 pb-24">
      <ResponsiveContainer maxWidth="lg" padding="md" className="py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex overflow-x-auto space-x-2 pb-4">
            {demoSections.map((section) => (
              <TouchButton
                key={section.id}
                onClick={() => setActiveDemo(section.id)}
                variant={activeDemo === section.id ? 'primary' : 'outline'}
                size="sm"
                className="flex-shrink-0"
              >
                <section.icon size={16} className="mr-2" />
                {section.title}
              </TouchButton>
            ))}
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeDemo}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </ResponsiveContainer>

      {/* Floating Action Button */}
      <FloatingActionButton
        icon={<Plus size={24} />}
        onClick={() => alert('FAB clicked!')}
        position="bottom-right"
      />
    </div>
  );
} 