import { NextRequest, NextResponse } from 'next/server';

// Mock user preferences data
const mockPreferences = {
  'demo-user': {
    dietaryRestrictions: ['vegetarian'],
    allergies: ['nuts', 'shellfish'],
    healthGoals: ['weight_loss', 'muscle_gain'],
    activityLevel: 'moderate',
    preferredCuisines: ['italian', 'mediterranean', 'asian'],
    mealPlanType: 'family',
    caloryTarget: 2000,
    waterIntake: 8,
    sleepGoals: 8,
    exerciseFrequency: 4,
    notifications: {
      mealReminders: true,
      workoutReminders: true,
      healthTips: true,
      weekly_reports: true
    },
    privacy: {
      shareWithFamily: true,
      shareWithProviders: false,
      anonymousData: true
    },
    theme: 'light',
    language: 'en',
    timezone: 'America/New_York'
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Check if user exists in our mock data
    const userPreferences = mockPreferences[userId as keyof typeof mockPreferences];
    
    if (!userPreferences) {
      return NextResponse.json(
        { 
          error: 'User not found',
          message: `Preferences for user ${userId} not found` 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      userId,
      preferences: userPreferences,
      lastUpdated: new Date().toISOString(),
      success: true
    });
    
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to fetch user preferences' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const body = await request.json();
    
    // Validate the request body
    if (!body.preferences) {
      return NextResponse.json(
        { 
          error: 'Invalid request',
          message: 'Preferences data is required' 
        },
        { status: 400 }
      );
    }
    
    // In a real app, you would update the database here
    // For now, we'll just return success
    
    return NextResponse.json({
      userId,
      preferences: body.preferences,
      lastUpdated: new Date().toISOString(),
      success: true,
      message: 'Preferences updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to update user preferences' 
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const body = await request.json();
    
    // Create default preferences for new user
    const defaultPreferences = {
      dietaryRestrictions: [],
      allergies: [],
      healthGoals: [],
      activityLevel: 'moderate',
      preferredCuisines: [],
      mealPlanType: 'individual',
      caloryTarget: 2000,
      waterIntake: 8,
      sleepGoals: 8,
      exerciseFrequency: 3,
      notifications: {
        mealReminders: true,
        workoutReminders: true,
        healthTips: true,
        weekly_reports: true
      },
      privacy: {
        shareWithFamily: false,
        shareWithProviders: false,
        anonymousData: true
      },
      theme: 'light',
      language: 'en',
      timezone: 'America/New_York',
      ...body.preferences
    };
    
    return NextResponse.json({
      userId,
      preferences: defaultPreferences,
      lastUpdated: new Date().toISOString(),
      created: true,
      success: true,
      message: 'User preferences created successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating user preferences:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to create user preferences' 
      },
      { status: 500 }
    );
  }
} 