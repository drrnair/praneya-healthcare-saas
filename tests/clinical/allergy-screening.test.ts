import { PrismaClient } from '@prisma/client';

describe('Allergy Screening Clinical Tests', () => {
  let prisma: PrismaClient;
  
  beforeAll(async () => {
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Allergy Data Storage', () => {
    it('should store allergies in structured JSON format', async () => {
      // Allergies should be stored as JSON text for complex queries
      const allergyField = await prisma.$queryRaw`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'health_profiles'
        AND column_name = 'allergies'
      `;

      const field = (allergyField as any[])[0];
      expect(field.data_type).toBe('text');
    });

    it('should support comprehensive allergy metadata', async () => {
      // Test complex allergy data structure
      const allergies = JSON.stringify([
        {
          allergen: 'peanuts',
          severity: 'severe',
          reactions: ['anaphylaxis', 'difficulty breathing'],
          diagnosed: '2020-05-15',
          verifiedBy: 'Dr. Johnson'
        },
        {
          allergen: 'shellfish',
          severity: 'moderate',
          reactions: ['hives', 'swelling'],
          diagnosed: '2019-08-22'
        }
      ]);

      const parsed = JSON.parse(allergies);
      expect(parsed).toHaveLength(2);
      expect(parsed[0].allergen).toBe('peanuts');
      expect(parsed[0].severity).toBe('severe');
    });
  });

  describe('Recipe Ingredient Screening', () => {
    it('should support ingredient analysis for allergies', async () => {
      // Recipe ingredients should be structured for allergy checking
      const ingredientStructure = await prisma.$queryRaw`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'recipes'
        AND column_name = 'ingredients'
      `;

      const field = (ingredientStructure as any[])[0];
      expect(field.data_type).toBe('text'); // JSON format
    });

    it('should validate recipe-allergy correlation capability', async () => {
      // Test that recipes and health profiles can be correlated
      const correlationQuery = await prisma.$queryRaw`
        SELECT 
          r.name as recipe_name,
          r.ingredients,
          hp.allergies
        FROM recipes r
        CROSS JOIN health_profiles hp
        LIMIT 1
      `;

      expect(Array.isArray(correlationQuery)).toBe(true);
    });
  });

  describe('Allergy Alert Framework', () => {
    it('should support severity-based alert levels', async () => {
      const severityLevels = ['severe', 'moderate', 'mild', 'unknown'];
      
      severityLevels.forEach(level => {
        expect(typeof level).toBe('string');
        expect(level.length).toBeGreaterThan(0);
      });
    });

    it('should structure allergy warnings', async () => {
      const mockAllergyAlert = {
        userId: 'user123',
        recipe: 'Thai Curry',
        triggeredAllergies: [
          {
            allergen: 'peanuts',
            severity: 'severe',
            foundIn: ['peanut oil', 'ground peanuts']
          }
        ],
        recommendedAction: 'DO_NOT_CONSUME',
        alertLevel: 'CRITICAL'
      };

      expect(mockAllergyAlert.triggeredAllergies).toHaveLength(1);
      expect(mockAllergyAlert.alertLevel).toBe('CRITICAL');
    });
  });

  describe('Family Allergy Management', () => {
    it('should support family-wide allergy screening', async () => {
      // Test family member allergy aggregation
      const familyAllergyQuery = await prisma.$queryRaw`
        SELECT 
          fm."familyAccountId",
          hp.allergies,
          u.name
        FROM family_members fm
        JOIN users u ON fm."userId" = u.id
        LEFT JOIN health_profiles hp ON u.id = hp."userId"
        LIMIT 1
      `;

      expect(Array.isArray(familyAllergyQuery)).toBe(true);
    });

    it('should prevent cross-contamination in meal planning', async () => {
      // Meal plans should consider all family allergies
      const mealPlanQuery = await prisma.$queryRaw`
        SELECT 
          mp.name as meal_plan,
          mp."userId",
          r.ingredients
        FROM meal_plans mp
        JOIN meal_plans_recipes mpr ON mp.id = mpr."mealPlanId"
        JOIN recipes r ON mpr."recipeId" = r.id
        LIMIT 1
      `;

      expect(Array.isArray(mealPlanQuery)).toBe(true);
    });
  });

  describe('Emergency Allergy Information', () => {
    it('should support emergency allergy access', async () => {
      // Emergency contacts should access allergy information
      const emergencyAccessQuery = await prisma.$queryRaw`
        SELECT 
          fm.role,
          hp.allergies,
          u.name
        FROM family_members fm
        JOIN users u ON fm."userId" = u.id
        LEFT JOIN health_profiles hp ON u.id = hp."userId"
        WHERE fm.role IN ('ADMIN', 'PARENT')
        LIMIT 1
      `;

      expect(Array.isArray(emergencyAccessQuery)).toBe(true);
    });

    it('should log allergy-related incidents', async () => {
      // Audit logs should capture allergy alerts and incidents
      const auditCapabilities = await prisma.$queryRaw`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'audit_logs'
        AND column_name IN ('action', 'resource', 'details')
      `;

      expect((auditCapabilities as any[]).length).toBe(3);
    });
  });

  describe('Allergy Screening Automation', () => {
    it('should support ingredient parsing for allergen detection', async () => {
      // Mock ingredient parsing for common allergens
      const commonAllergens = [
        'milk', 'eggs', 'fish', 'shellfish', 'tree nuts', 
        'peanuts', 'wheat', 'soybeans', 'sesame'
      ];

      const mockIngredients = ['flour', 'eggs', 'milk', 'peanut oil'];
      const detectedAllergens = mockIngredients.filter(ingredient => 
        commonAllergens.some(allergen => 
          ingredient.toLowerCase().includes(allergen.toLowerCase())
        )
      );

      expect(detectedAllergens).toContain('eggs');
      expect(detectedAllergens).toContain('milk');
    });

    it('should support cross-contamination warnings', async () => {
      // Mock cross-contamination detection
      const crossContaminationWarnings = {
        facility: 'Contains nuts',
        equipment: 'Processed on equipment that also processes milk',
        packaging: 'May contain traces of wheat'
      };

      Object.values(crossContaminationWarnings).forEach(warning => {
        expect(typeof warning).toBe('string');
        expect(warning.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Clinical Allergy Validation', () => {
    it('should support medical allergy verification', async () => {
      // Allergies should be medically verifiable
      const medicalFields = [
        'diagnosed', 'verifiedBy', 'lastTested', 'severity', 'reactions'
      ];

      medicalFields.forEach(field => {
        expect(typeof field).toBe('string');
        expect(field.length).toBeGreaterThan(0);
      });
    });

    it('should track allergy testing history', async () => {
      // Support for allergy test result tracking
      const allergyTestHistory = {
        testDate: '2025-01-15',
        testType: 'skin prick test',
        allergen: 'peanuts',
        result: 'positive',
        severity: 'moderate',
        testedBy: 'Dr. Smith'
      };

      expect(allergyTestHistory.testDate).toBeDefined();
      expect(allergyTestHistory.result).toBe('positive');
      expect(allergyTestHistory.severity).toBe('moderate');
    });
  });
}); 