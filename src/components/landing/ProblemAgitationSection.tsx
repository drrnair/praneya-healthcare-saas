/**
 * Problem Agitation Section - "The Daily Nutrition Struggle is Real"
 * Deep pain point exploration for three target audiences
 */

'use client';

import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ProblemColumn } from './ProblemColumn';
import { MicroSurvey } from './MicroSurvey';
import { CostOfConfusion } from './CostOfConfusion';
import { 
  Clock, 
  TrendingDown, 
  AlertTriangle,
  Users,
  DollarSign,
  Brain,
  ChevronDown
} from 'lucide-react';

interface ProblemAgitationSectionProps {
  onAudienceSelect?: (audience: string) => void;
}

const ProblemAgitationSection: React.FC<ProblemAgitationSectionProps> = ({
  onAudienceSelect
}) => {
  const [selectedAudience, setSelectedAudience] = useState<string | null>(null);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  // Problem definitions for each audience
  const problemData = {
    fitness: {
      headline: "Your Progress is Stalling",
      icon: <TrendingDown className="w-8 h-8" />,
      painPoints: [
        "You spend hours calculating macros, only to realize you're missing key nutrients for recovery",
        "Generic fitness apps don't account for your training schedule or body composition goals", 
        "You're constantly second-guessing if your nutrition strategy aligns with your training",
        "Meal prep takes forever because you're manually calculating every ingredient",
        "You know nutrition timing matters, but you're flying blind on when to eat what"
      ],
      emotionalHook: "You're dedicated to your training, but inconsistent nutrition is holding you back from the results you've been working toward.",
      bgColor: "from-red-50 to-orange-50",
      borderColor: "border-red-200",
      iconColor: "text-red-600 bg-red-100"
    },
    family: {
      headline: "Dinnertime Chaos is Exhausting Your Family",
      icon: <Clock className="w-8 h-8" />,
      painPoints: [
        "It's 5 PM and you still don't know what's for dinner - again",
        "Your kids have different preferences, your spouse has dietary goals, and you're just trying to survive",
        "You spend more time in grocery store aisles confused than actually cooking",
        "Takeout is becoming your default, but you know it's not sustainable for your budget or health",
        "Meal planning apps don't understand that your 8-year-old won't eat quinoa and your teenager is suddenly vegetarian",
        "You want to teach your kids healthy eating, but you're too overwhelmed to model it"
      ],
      emotionalHook: "You love your family, but the daily nutrition decisions are exhausting you and compromising everyone's wellbeing.",
      bgColor: "from-amber-50 to-yellow-50",
      borderColor: "border-amber-200", 
      iconColor: "text-amber-600 bg-amber-100"
    },
    health: {
      headline: "Your Dietary Requirements Feel Overwhelming",
      icon: <AlertTriangle className="w-8 h-8" />,
      painPoints: [
        "Every meal feels like a puzzle you're not equipped to solve",
        "You want to eat better but don't know how food choices affect your specific needs",
        "Conflicting nutrition advice online leaves you paralyzed with indecision",
        "You're afraid of making dietary mistakes that could impact your wellness goals",
        "You want to be proactive about your nutrition, but the complexity feels overwhelming",
        "Your family doesn't understand your dietary requirements, making meals stressful"
      ],
      emotionalHook: "You want to take control of your nutrition, but the complexity of evidence-based eating feels overwhelming.",
      bgColor: "from-purple-50 to-indigo-50",
      borderColor: "border-purple-200",
      iconColor: "text-purple-600 bg-purple-100"
    }
  };

  const costConsequences = [
    {
      icon: <Clock className="w-6 h-6" />,
      text: "Wasted time researching conflicting nutrition advice",
      stat: "3+ hours/week"
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      text: "Money spent on foods that don't align with your goals",
      stat: "$200+ monthly"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      text: "Stress and guilt around every food decision",
      stat: "Daily burden"
    },
    {
      icon: <TrendingDown className="w-6 h-6" />,
      text: "Wellness goals that remain frustratingly out of reach",
      stat: "Year after year"
    },
    {
      icon: <Users className="w-6 h-6" />,
      text: "Family tensions around meal times and food choices",
      stat: "Every dinner"
    }
  ];

  const handleSurveyResponse = (audience: string) => {
    setSelectedAudience(audience);
    setSurveyCompleted(true);
    onAudienceSelect?.(audience);
  };

  return (
    <section 
      ref={ref}
      className="relative py-20 bg-gradient-to-b from-gray-50 to-gray-100"
      aria-label="Nutrition Struggle Problem Identification"
    >
      {/* Background Pattern for Complexity */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, #6B7280 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, #6B7280 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }}
        />
        
        {/* Subtle animated confusion elements */}
        <motion.div
          className="absolute top-20 left-10 w-2 h-2 bg-gray-400/20 rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0 }}
        />
        <motion.div
          className="absolute top-40 right-20 w-3 h-3 bg-gray-400/20 rounded-full"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute bottom-32 left-1/4 w-2 h-2 bg-gray-400/20 rounded-full"
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, delay: 2 }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            The Daily Nutrition Struggle is{' '}
            <span className="text-red-600 relative">
              Real
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-red-600/30"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </span>
          </h2>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Every day, millions of people face the same overwhelming question:{' '}
            <span className="font-semibold text-gray-900">
              "What should I eat to reach my goals?"
            </span>{' '}
            The answer isn't simple when you're juggling fitness targets, family needs, and dietary requirements.
          </motion.p>

          {/* Visual separator */}
          <motion.div
            className="flex items-center justify-center mt-8 mb-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" />
              <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
            </div>
          </motion.div>
        </motion.div>

        {/* Three Problem Columns */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <ProblemColumn 
            {...problemData.fitness}
            audience="fitness"
            delay={0.1}
            isSelected={selectedAudience === 'fitness'}
          />
          <ProblemColumn 
            {...problemData.family}
            audience="family"
            delay={0.2}
            isSelected={selectedAudience === 'family'}
          />
          <ProblemColumn 
            {...problemData.health}
            audience="health"
            delay={0.3}
            isSelected={selectedAudience === 'health'}
          />
        </motion.div>

        {/* Micro Survey */}
        {!surveyCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <MicroSurvey 
              onResponse={handleSurveyResponse}
              problemData={problemData}
            />
          </motion.div>
        )}

        {/* Cost of Confusion Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <CostOfConfusion consequences={costConsequences} />
        </motion.div>

        {/* Transition to Solution */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-8 border border-teal-200/50 shadow-lg">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              What if there was a better way?
            </h3>
            <p className="text-lg text-gray-700 mb-6">
              What if AI could understand your unique situation and guide you with confidence?
            </p>
            
            <motion.div
              className="flex justify-center"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="w-8 h-8 text-teal-600" />
            </motion.div>
          </div>
        </motion.div>

        {/* Social Proof Element */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200/50">
            <Users className="w-5 h-5 text-teal-600" />
            <span className="text-sm font-medium text-gray-700">
              Join <span className="font-bold text-teal-600">50,000+</span> people who've solved this problem
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export { ProblemAgitationSection }; 