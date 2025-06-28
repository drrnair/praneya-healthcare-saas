import { PrismaClient } from '@prisma/client';

describe('Healthcare Database Connection Tests', () => {
  let prisma: PrismaClient;
  
  beforeAll(async () => {
    prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Basic Connectivity', () => {
    it('should connect to the database successfully', async () => {
      expect(async () => {
        await prisma.$connect();
      }).not.toThrow();
    });

    it('should execute a simple query', async () => {
      const result = await prisma.$queryRaw`SELECT 1 as test`;
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should validate database schema exists', async () => {
      const tables = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      `;
      
      const tableNames = (tables as any[]).map((t: any) => t.table_name);
      
      // Check for all healthcare tables
      expect(tableNames).toContain('users');
      expect(tableNames).toContain('health_profiles');
      expect(tableNames).toContain('family_accounts');
      expect(tableNames).toContain('family_members');
      expect(tableNames).toContain('recipes');
      expect(tableNames).toContain('meal_plans');
      expect(tableNames).toContain('audit_logs');
      expect(tableNames).toContain('user_preferences');
    });
  });

  describe('Healthcare Schema Validation', () => {
    it('should validate users table structure', async () => {
      const columns = await prisma.$queryRaw`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'users'
        ORDER BY ordinal_position
      `;

      const columnNames = (columns as any[]).map((c: any) => c.column_name);
      expect(columnNames).toContain('id');
      expect(columnNames).toContain('email');
      expect(columnNames).toContain('name');
      expect(columnNames).toContain('createdAt');
      expect(columnNames).toContain('updatedAt');
    });

    it('should validate health_profiles table structure', async () => {
      const columns = await prisma.$queryRaw`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'health_profiles'
      `;

      const columnNames = (columns as any[]).map((c: any) => c.column_name);
      expect(columnNames).toContain('userId');
      expect(columnNames).toContain('age');
      expect(columnNames).toContain('gender');
      expect(columnNames).toContain('height');
      expect(columnNames).toContain('weight');
      expect(columnNames).toContain('allergies');
      expect(columnNames).toContain('medications');
      expect(columnNames).toContain('conditions');
    });

    it('should validate foreign key relationships', async () => {
      const foreignKeys = await prisma.$queryRaw`
        SELECT 
          tc.table_name, 
          kcu.column_name, 
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name 
        FROM 
          information_schema.table_constraints AS tc 
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
          JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
        WHERE constraint_type = 'FOREIGN KEY'
      `;

      expect(Array.isArray(foreignKeys)).toBe(true);
      expect((foreignKeys as any[]).length).toBeGreaterThan(0);
    });
  });

  describe('Performance Tests', () => {
    it('should connect within acceptable time limit', async () => {
      const startTime = Date.now();
      await prisma.$connect();
      const connectionTime = Date.now() - startTime;
      
      // Should connect within 5 seconds
      expect(connectionTime).toBeLessThan(5000);
    });

    it('should execute queries within performance thresholds', async () => {
      const startTime = Date.now();
      await prisma.user.findMany({
        take: 10
      });
      const queryTime = Date.now() - startTime;
      
      // Should execute simple queries within 1 second
      expect(queryTime).toBeLessThan(1000);
    });

    it('should handle concurrent connections', async () => {
      const promises = Array.from({ length: 5 }, () => 
        prisma.user.count()
      );
      
      const results = await Promise.all(promises);
      expect(results).toHaveLength(5);
      results.forEach(result => {
        expect(typeof result).toBe('number');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid queries gracefully', async () => {
      await expect(
        prisma.$queryRaw`SELECT * FROM non_existent_table`
      ).rejects.toThrow();
    });

    it('should validate data integrity constraints', async () => {
      // Try to create a health profile without a valid user
      await expect(
        prisma.healthProfile.create({
          data: {
            userId: 'non-existent-user',
            age: 25
          }
        })
      ).rejects.toThrow();
    });
  });

  describe('Healthcare Data Validation', () => {
    it('should validate enum types exist', async () => {
      const enums = await prisma.$queryRaw`
        SELECT enumlabel as value
        FROM pg_enum pe
        JOIN pg_type pt ON pe.enumtypid = pt.oid
        WHERE pt.typname = 'FamilyRole'
      `;

      const roleValues = (enums as any[]).map((e: any) => e.value);
      expect(roleValues).toContain('ADMIN');
      expect(roleValues).toContain('PARENT');
      expect(roleValues).toContain('MEMBER');
      expect(roleValues).toContain('CHILD');
    });

    it('should validate indexes for performance', async () => {
      const indexes = await prisma.$queryRaw`
        SELECT indexname, tablename
        FROM pg_indexes
        WHERE schemaname = 'public'
      `;

      const indexNames = (indexes as any[]).map((i: any) => i.indexname);
      expect(indexNames.some(name => name.includes('email'))).toBe(true);
    });
  });
}); 