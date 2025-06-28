-- Simplified Healthcare Schema for Praneya SaaS
-- Direct SQL deployment to Supabase

-- Drop existing tables if they exist (for clean deployment)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS meal_plans_recipes CASCADE;
DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS meal_plans CASCADE;
DROP TABLE IF EXISTS family_members CASCADE;
DROP TABLE IF EXISTS family_accounts CASCADE;
DROP TABLE IF EXISTS health_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS "FamilyRole" CASCADE;
DROP TYPE IF EXISTS "MealType" CASCADE;

-- Create custom types
CREATE TYPE "FamilyRole" AS ENUM ('ADMIN', 'PARENT', 'MEMBER', 'CHILD');
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK');

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Core User Management
CREATE TABLE users (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Health Profiles
CREATE TABLE health_profiles (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "userId" TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    age INTEGER,
    gender TEXT,
    height DOUBLE PRECISION, -- cm
    weight DOUBLE PRECISION, -- kg
    "activityLevel" TEXT, -- sedentary, lightly_active, moderately_active, very_active
    "weightGoal" DOUBLE PRECISION,
    "calorieGoal" INTEGER,
    allergies TEXT, -- JSON string
    medications TEXT, -- JSON string
    conditions TEXT, -- JSON string
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Family Management
CREATE TABLE family_accounts (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name TEXT NOT NULL,
    description TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE family_members (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "familyAccountId" TEXT NOT NULL REFERENCES family_accounts(id) ON DELETE CASCADE,
    "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role "FamilyRole" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("familyAccountId", "userId")
);

-- Recipes
CREATE TABLE recipes (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name TEXT NOT NULL,
    description TEXT,
    servings INTEGER NOT NULL DEFAULT 1,
    calories INTEGER,
    protein DOUBLE PRECISION,
    carbs DOUBLE PRECISION,
    fat DOUBLE PRECISION,
    ingredients TEXT NOT NULL, -- JSON string
    instructions TEXT NOT NULL, -- JSON string
    "prepTime" INTEGER, -- minutes
    "cookTime" INTEGER, -- minutes
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Meal Planning
CREATE TABLE meal_plans (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    date TIMESTAMP(3) NOT NULL,
    "mealType" "MealType" NOT NULL,
    calories INTEGER,
    protein DOUBLE PRECISION,
    carbs DOUBLE PRECISION,
    fat DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Many-to-many relationship between meal plans and recipes
CREATE TABLE meal_plans_recipes (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "mealPlanId" TEXT NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
    "recipeId" TEXT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("mealPlanId", "recipeId")
);

-- Audit Logging
CREATE TABLE audit_logs (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "userId" TEXT,
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    details TEXT, -- JSON string
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- User Preferences
CREATE TABLE user_preferences (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "userId" TEXT UNIQUE NOT NULL,
    "dietaryRestrictions" TEXT, -- JSON array
    "cuisinePreferences" TEXT, -- JSON array
    units TEXT NOT NULL DEFAULT 'metric', -- metric or imperial
    language TEXT NOT NULL DEFAULT 'en',
    notifications BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_health_profiles_user_id ON health_profiles("userId");
CREATE INDEX idx_family_members_family_id ON family_members("familyAccountId");
CREATE INDEX idx_family_members_user_id ON family_members("userId");
CREATE INDEX idx_meal_plans_user_id ON meal_plans("userId");
CREATE INDEX idx_meal_plans_date ON meal_plans(date);
CREATE INDEX idx_audit_logs_user_id ON audit_logs("userId");
CREATE INDEX idx_audit_logs_created_at ON audit_logs("createdAt");

-- Create updated_at triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_profiles_updated_at BEFORE UPDATE ON health_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_family_accounts_updated_at BEFORE UPDATE ON family_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_family_members_updated_at BEFORE UPDATE ON family_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meal_plans_updated_at BEFORE UPDATE ON meal_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO users (id, email, name) VALUES 
('user1', 'test@praneya.com', 'Test User'),
('user2', 'family@praneya.com', 'Family Admin');

INSERT INTO health_profiles ("userId", age, gender, height, weight, "activityLevel") VALUES 
('user1', 30, 'male', 175.0, 70.0, 'moderately_active');

INSERT INTO recipes (name, description, ingredients, instructions, calories, protein, carbs, fat) VALUES 
('Healthy Salad', 'A nutritious green salad', '["lettuce", "tomatoes", "cucumber", "olive oil"]', '["Mix all ingredients", "Serve fresh"]', 150, 5.0, 10.0, 12.0);

COMMIT; 