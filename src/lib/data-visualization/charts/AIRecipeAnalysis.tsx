'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVisualization, colorPalettes } from '../VisualizationProvider';

interface Recipe {
  id: string;
  name: string;
  description: string;
  servings: number;
  prepTime: number;
  cookTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: Ingredient[];
  instructions: string[];
  nutrition: RecipeNutrition;
  allergens: string[];
  dietaryTags: string[];
  healthScore: number;
  aiGenerated: boolean;
}

interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: 'protein' | 'carbs' | 'vegetables' | 'fats' | 'dairy' | 'spices' | 'other';
  allergens: string[];
  substitutions: string[];
  nutritionPer100g: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface RecipeNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  servingSize: string;
}

interface AIRecipeAnalysisProps {
  recipe: Recipe;
  userAllergens?: string[];
  userDietaryRestrictions?: string[];
  showSubstitutions?: boolean;
  enableRating?: boolean;
  className?: string;
}

export function AIRecipeAnalysis({
  recipe,
  userAllergens = [],
  userDietaryRestrictions = [],
  showSubstitutions = true,
  enableRating = true,
  className = ''
}: AIRecipeAnalysisProps) {
  const { 
    isReducedMotion, 
    colorTheme, 
    announceDataChange 
  } = useVisualization();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'ingredients' | 'nutrition' | 'instructions'>('overview');
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [showAllergenWarning, setShowAllergenWarning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const colors = colorPalettes[colorTheme];
  
  // Check for allergen conflicts
  useEffect(() => {
    const hasAllergenConflict = recipe.allergens.some(allergen => 
      userAllergens.includes(allergen.toLowerCase())
    );
    setShowAllergenWarning(hasAllergenConflict);
  }, [recipe.allergens, userAllergens]);
  
  // Sample recipe data for demo
  const sampleRecipe: Recipe = {
    id: 'ai-recipe-1',
    name: 'Mediterranean Quinoa Bowl',
    description: 'A nutritious bowl with quinoa, grilled vegetables, and tahini dressing',
    servings: 4,
    prepTime: 15,
    cookTime: 25,
    difficulty: 'Easy',
    ingredients: [
      {
        id: 'quinoa',
        name: 'Quinoa',
        amount: 1,
        unit: 'cup',
        category: 'carbs',
        allergens: [],
        substitutions: ['brown rice', 'bulgur wheat', 'cauliflower rice'],
        nutritionPer100g: { calories: 368, protein: 14, carbs: 64, fat: 6 }
      },
      {
        id: 'chicken',
        name: 'Chicken breast',
        amount: 300,
        unit: 'g',
        category: 'protein',
        allergens: [],
        substitutions: ['tofu', 'tempeh', 'chickpeas'],
        nutritionPer100g: { calories: 165, protein: 31, carbs: 0, fat: 3.6 }
      },
      {
        id: 'tahini',
        name: 'Tahini',
        amount: 3,
        unit: 'tbsp',
        category: 'fats',
        allergens: ['sesame'],
        substitutions: ['almond butter', 'sunflower seed butter'],
        nutritionPer100g: { calories: 595, protein: 17, carbs: 21, fat: 54 }
      }
    ],
    instructions: [
      'Rinse quinoa and cook according to package directions',
      'Season chicken with salt, pepper, and herbs',
      'Grill chicken until cooked through, about 6-8 minutes per side',
      'Prepare vegetables by cutting and roasting at 400°F for 20 minutes',
      'Whisk tahini with lemon juice, water, and garlic for dressing',
      'Assemble bowls with quinoa, chicken, vegetables, and dressing'
    ],
    nutrition: {
      calories: 485,
      protein: 35,
      carbs: 42,
      fat: 18,
      fiber: 8,
      sugar: 6,
      sodium: 320,
      servingSize: '1 bowl'
    },
    allergens: ['sesame'],
    dietaryTags: ['high-protein', 'gluten-free', 'mediterranean'],
    healthScore: 92,
    aiGenerated: true
  };
  
  const currentRecipe = recipe || sampleRecipe;
  
  // Handle ingredient selection
  const handleIngredientSelect = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    announceDataChange(`Selected ${ingredient.name} for substitution options`);
  };
  
  // Handle recipe rating
  const handleRating = (rating: number) => {
    setUserRating(rating);
    announceDataChange(`Rated recipe ${rating} out of 5 stars`);
  };
  
  // Simulate AI analysis
  const simulateAIAnalysis = () => {
    setIsAnalyzing(true);
    announceDataChange('Analyzing recipe with AI...');
    
    setTimeout(() => {
      setIsAnalyzing(false);
      announceDataChange('AI analysis complete');
    }, 2000);
  };
  
  // Get health score color
  const getHealthScoreColor = (score: number): string => {
    if (score >= 80) return colors.zones.optimal;
    if (score >= 60) return colors.zones.caution;
    return colors.zones.warning;
  };
  
  // Get category color
  const getCategoryColor = (category: string): string => {
    const categoryColors = {
      protein: '#EF4444',
      carbs: '#3B82F6',
      vegetables: '#10B981',
      fats: '#F59E0B',
      dairy: '#8B5CF6',
      spices: '#EC4899',
      other: '#6B7280'
    };
    return categoryColors[category as keyof typeof categoryColors] || categoryColors.other;
  };
  
  return (
    <motion.div
      className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: isReducedMotion ? 0.1 : 0.5 }}
    >
      {/* Allergen warning */}
      <AnimatePresence>
        {showAllergenWarning && (
          <motion.div
            className="bg-red-50 border-l-4 border-red-400 p-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <span className="text-red-600 text-lg mr-3">⚠️</span>
              <div>
                <h4 className="text-red-800 font-semibold">Allergen Alert</h4>
                <p className="text-red-700 text-sm">
                  This recipe contains allergens you've indicated: {
                    currentRecipe.allergens.filter(a => userAllergens.includes(a.toLowerCase())).join(', ')
                  }
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentRecipe.name}</h2>
            <p className="text-gray-600 mb-3">{currentRecipe.description}</p>
            
            {/* Recipe metadata */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>🍽️ {currentRecipe.servings} servings</span>
              <span>⏱️ {currentRecipe.prepTime + currentRecipe.cookTime} min</span>
              <span>📊 {currentRecipe.difficulty}</span>
              {currentRecipe.aiGenerated && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">🤖 AI Generated</span>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold mb-1" style={{ color: getHealthScoreColor(currentRecipe.healthScore) }}>
              {currentRecipe.healthScore}
            </div>
            <div className="text-sm text-gray-500">Health Score</div>
          </div>
        </div>
        
        {/* Rating */}
        {enableRating && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rate this recipe:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                onClick={() => handleRating(star)}
                className={`text-xl ${star <= userRating ? 'text-yellow-400' : 'text-gray-300'}`}
                whileHover={isReducedMotion ? {} : { scale: 1.1 }}
                whileTap={isReducedMotion ? {} : { scale: 0.9 }}
              >
                ⭐
              </motion.button>
            ))}
          </div>
        )}
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {[
            { id: 'overview', label: 'Overview', icon: '📋' },
            { id: 'ingredients', label: 'Ingredients', icon: '🥗' },
            { id: 'nutrition', label: 'Nutrition', icon: '📊' },
            { id: 'instructions', label: 'Instructions', icon: '👨‍🍳' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              whileHover={isReducedMotion ? {} : { backgroundColor: '#F3F4F6' }}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          className="p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: isReducedMotion ? 0.1 : 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Dietary tags */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Dietary Information</h3>
                <div className="flex flex-wrap gap-2">
                  {currentRecipe.dietaryTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                  {currentRecipe.allergens.map((allergen) => (
                    <span
                      key={allergen}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                    >
                      Contains {allergen}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* AI Analysis */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">AI Analysis</h3>
                  <motion.button
                    onClick={simulateAIAnalysis}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    whileHover={isReducedMotion ? {} : { scale: 1.02 }}
                    whileTap={isReducedMotion ? {} : { scale: 0.98 }}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? '🔄 Analyzing...' : '🤖 Analyze Recipe'}
                  </motion.button>
                </div>
                
                {isAnalyzing ? (
                  <div className="text-center py-8">
                    <motion.div
                      className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <p className="text-gray-600">AI is analyzing nutritional content and health benefits...</p>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 mb-2">
                      This recipe provides excellent protein balance and incorporates heart-healthy fats. 
                      The quinoa offers complete amino acids while the Mediterranean ingredients provide 
                      anti-inflammatory benefits.
                    </p>
                    <div className="text-sm text-gray-600">
                      <strong>Recommendations:</strong> Perfect for post-workout meals or as a balanced dinner option.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'ingredients' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Ingredients</h3>
                {showSubstitutions && (
                  <span className="text-sm text-gray-500">Click ingredients for substitutions</span>
                )}
              </div>
              
              <div className="grid gap-3">
                {currentRecipe.ingredients.map((ingredient) => (
                  <motion.div
                    key={ingredient.id}
                    onClick={() => showSubstitutions && handleIngredientSelect(ingredient)}
                    className={`p-3 rounded-lg border transition-colors ${
                      showSubstitutions ? 'cursor-pointer hover:bg-gray-50' : ''
                    } ${selectedIngredient?.id === ingredient.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    whileHover={isReducedMotion ? {} : { scale: 1.01 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: getCategoryColor(ingredient.category) }}
                        />
                        <div>
                          <span className="font-medium text-gray-800">
                            {ingredient.amount} {ingredient.unit} {ingredient.name}
                          </span>
                          {ingredient.allergens.length > 0 && (
                            <div className="text-xs text-red-600 mt-1">
                              ⚠️ Contains: {ingredient.allergens.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right text-sm text-gray-500">
                        <div>{ingredient.nutritionPer100g.calories} cal/100g</div>
                        <div className="text-xs">{ingredient.category}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Substitution panel */}
              <AnimatePresence>
                {selectedIngredient && (
                  <motion.div
                    className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h4 className="font-semibold text-blue-800 mb-2">
                      Substitutions for {selectedIngredient.name}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {selectedIngredient.substitutions.map((sub) => (
                        <div
                          key={sub}
                          className="p-2 bg-white rounded border border-blue-200 text-sm text-blue-700"
                        >
                          {sub}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          
          {activeTab === 'nutrition' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Nutritional Information</h3>
              
              {/* Macronutrients */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Calories', value: currentRecipe.nutrition.calories, unit: 'kcal', color: colors.primary },
                  { name: 'Protein', value: currentRecipe.nutrition.protein, unit: 'g', color: '#EF4444' },
                  { name: 'Carbs', value: currentRecipe.nutrition.carbs, unit: 'g', color: '#3B82F6' },
                  { name: 'Fat', value: currentRecipe.nutrition.fat, unit: 'g', color: '#F59E0B' }
                ].map((macro) => (
                  <div key={macro.name} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold mb-1" style={{ color: macro.color }}>
                      {macro.value}
                    </div>
                    <div className="text-sm text-gray-600">{macro.name}</div>
                    <div className="text-xs text-gray-500">{macro.unit}</div>
                  </div>
                ))}
              </div>
              
              {/* Additional nutrients */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Fiber', value: currentRecipe.nutrition.fiber, unit: 'g' },
                  { name: 'Sugar', value: currentRecipe.nutrition.sugar, unit: 'g' },
                  { name: 'Sodium', value: currentRecipe.nutrition.sodium, unit: 'mg' }
                ].map((nutrient) => (
                  <div key={nutrient.name} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">{nutrient.name}</span>
                      <span className="font-medium">{nutrient.value}{nutrient.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-sm text-gray-500">
                Per serving ({currentRecipe.nutrition.servingSize})
              </div>
            </div>
          )}
          
          {activeTab === 'instructions' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Instructions</h3>
              
              <div className="space-y-3">
                {currentRecipe.instructions.map((instruction, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start p-3 bg-gray-50 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: isReducedMotion ? 0.1 : 0.3, 
                      delay: isReducedMotion ? 0 : index * 0.1 
                    }}
                  >
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{instruction}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
} 