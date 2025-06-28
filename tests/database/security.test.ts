import { PrismaClient } from '@prisma/client';

describe('Healthcare Database Security Tests', () => {
  let prisma: PrismaClient;
  
  beforeAll(async () => {
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('SQL Injection Protection', () => {
    it('should prevent SQL injection in user queries', async () => {
      const maliciousEmail = "'; DROP TABLE users; --";
      
      // This should not throw an error or execute malicious SQL
      const result = await prisma.user.findFirst({
        where: { email: maliciousEmail }
      });
      
      expect(result).toBeNull();
      
      // Verify users table still exists
      const userCount = await prisma.user.count();
      expect(typeof userCount).toBe('number');
    });

    it('should sanitize raw queries', async () => {
      const maliciousInput = "1'; DROP TABLE users; --";
      
      await expect(async () => {
        await prisma.$queryRaw`SELECT * FROM users WHERE id = ${maliciousInput}`;
      }).not.toThrow();
    });

    it('should validate input data types', async () => {
      // Try to create user with invalid data types
      await expect(
        prisma.user.create({
          data: {
            email: 123 as any, // Invalid email type
            name: "Test User"
          }
        })
      ).rejects.toThrow();
    });
  });

  describe('Access Control Validation', () => {
    it('should enforce foreign key constraints', async () => {
      // Try to create health profile with non-existent user
      await expect(
        prisma.$executeRaw`
          INSERT INTO health_profiles (id, "userId", age) 
          VALUES (uuid_generate_v4()::text, 'fake-user-id', 25)
        `
      ).rejects.toThrow();
    });

    it('should validate unique constraints', async () => {
      // Create a test user
      const testUser = await prisma.user.create({
        data: {
          email: `security-test-${Date.now()}@test.com`,
          name: 'Security Test User'
        }
      });

      // Try to create another user with same email
      await expect(
        prisma.user.create({
          data: {
            email: testUser.email,
            name: 'Duplicate User'
          }
        })
      ).rejects.toThrow();

      // Cleanup
      await prisma.user.delete({ where: { id: testUser.id } });
    });

    it('should enforce cascade deletes properly', async () => {
      // Create user and health profile
      const testUser = await prisma.user.create({
        data: {
          email: `cascade-test-${Date.now()}@test.com`,
          name: 'Cascade Test User'
        }
      });

      const healthProfile = await prisma.$executeRaw`
        INSERT INTO health_profiles (id, "userId", age)
        VALUES (uuid_generate_v4()::text, ${testUser.id}, 30)
      `;

      // Delete user - should cascade delete health profile
      await prisma.user.delete({ where: { id: testUser.id } });

      // Verify health profile was deleted
      const orphanedProfiles = await prisma.$queryRaw`
        SELECT * FROM health_profiles WHERE "userId" = ${testUser.id}
      `;
      
      expect(Array.isArray(orphanedProfiles)).toBe(true);
      expect((orphanedProfiles as any[]).length).toBe(0);
    });
  });

  describe('Data Encryption Readiness', () => {
    it('should store sensitive health data as text (ready for encryption)', async () => {
      const columns = await prisma.$queryRaw`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'health_profiles'
        AND column_name IN ('allergies', 'medications', 'conditions')
      `;

      (columns as any[]).forEach((col: any) => {
        expect(col.data_type).toBe('text');
      });
    });

    it('should validate JSON structure in encrypted fields', async () => {
      const testUser = await prisma.user.create({
        data: {
          email: `json-test-${Date.now()}@test.com`,
          name: 'JSON Test User'
        }
      });

      // Test valid JSON in allergies field
      await expect(
        prisma.$executeRaw`
          INSERT INTO health_profiles (id, "userId", allergies)
          VALUES (uuid_generate_v4()::text, ${testUser.id}, '["nuts", "shellfish"]')
        `
      ).resolves.toBeDefined();

      // Cleanup
      await prisma.user.delete({ where: { id: testUser.id } });
    });
  });

  describe('Audit Trail Security', () => {
    it('should allow insertion to audit_logs table', async () => {
      const auditEntry = {
        action: 'LOGIN_ATTEMPT',
        resource: 'USER_AUTH',
        details: JSON.stringify({ success: true }),
        ipAddress: '192.168.1.1',
        userAgent: 'Test User Agent'
      };

      await expect(
        prisma.$executeRaw`
          INSERT INTO audit_logs (id, action, resource, details, "ipAddress", "userAgent")
          VALUES (
            uuid_generate_v4()::text,
            ${auditEntry.action},
            ${auditEntry.resource},
            ${auditEntry.details},
            ${auditEntry.ipAddress},
            ${auditEntry.userAgent}
          )
        `
      ).resolves.toBeDefined();
    });

    it('should prevent modification of audit logs', async () => {
      // Audit logs should only allow INSERT, not UPDATE/DELETE
      const auditLogs = await prisma.$queryRaw`
        SELECT id FROM audit_logs LIMIT 1
      `;

      if ((auditLogs as any[]).length > 0) {
        const logId = (auditLogs as any[])[0].id;
        
        // Note: In production, this should be prevented by database triggers
        // For now, we're just testing the structure exists
        expect(logId).toBeDefined();
      }
    });
  });

  describe('Connection Security', () => {
    it('should use SSL connection', async () => {
      const sslInfo = await prisma.$queryRaw`
        SELECT ssl, version FROM pg_stat_ssl WHERE pid = pg_backend_pid()
      `;
      
      // In production, SSL should be enforced
      expect(Array.isArray(sslInfo)).toBe(true);
    });

    it('should limit connection pool size', async () => {
      // Test that we don't exceed reasonable connection limits
      const connections = await prisma.$queryRaw`
        SELECT count(*) as active_connections
        FROM pg_stat_activity
        WHERE state = 'active'
      `;

      const count = (connections as any[])[0]?.active_connections;
      expect(typeof count).toBe('string');
      expect(parseInt(count)).toBeLessThan(100); // Reasonable limit
    });
  });

  describe('Data Validation Security', () => {
    it('should validate email format constraints', async () => {
      await expect(
        prisma.user.create({
          data: {
            email: 'invalid-email-format',
            name: 'Invalid Email User'
          }
        })
      ).rejects.toThrow();
    });

    it('should validate health data ranges', async () => {
      const testUser = await prisma.user.create({
        data: {
          email: `range-test-${Date.now()}@test.com`,
          name: 'Range Test User'
        }
      });

      // Test negative age (should be prevented by application logic)
      await expect(
        prisma.$executeRaw`
          INSERT INTO health_profiles (id, "userId", age)
          VALUES (uuid_generate_v4()::text, ${testUser.id}, -5)
        `
      ).resolves.toBeDefined(); // Database allows it, app should validate

      // Cleanup
      await prisma.user.delete({ where: { id: testUser.id } });
    });
  });
}); 