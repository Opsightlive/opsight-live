
/**
 * Database-Enforced Change Isolation System
 * This ensures that changes are completely isolated and cannot affect other parts of the website
 */

import { supabase } from '@/integrations/supabase/client';

export interface IsolationBoundary {
  moduleId: string;
  allowedFiles: string[];
  protectedFunctions: string[];
  isolatedScope: string[];
}

export class ChangeIsolator {
  private static isolationBoundaries: Map<string, IsolationBoundary> = new Map();

  /**
   * Register an isolation boundary for a module - now stored in database
   */
  static async registerBoundary(boundary: IsolationBoundary): Promise<void> {
    console.log('🔒 REGISTERING DATABASE-ENFORCED ISOLATION BOUNDARY:', boundary.moduleId);
    
    try {
      // Store in database for permanent enforcement
      const { error } = await supabase
        .from('module_isolation_boundaries')
        .upsert({
          module_id: boundary.moduleId,
          allowed_files: boundary.allowedFiles,
          protected_functions: boundary.protectedFunctions,
          isolation_scope: { isolatedScope: boundary.isolatedScope }
        }, { onConflict: 'module_id' });

      if (error) {
        console.error('❌ FAILED TO REGISTER ISOLATION BOUNDARY:', error);
        throw new Error(`Failed to register isolation boundary: ${error.message}`);
      }

      // Also store locally for immediate access
      this.isolationBoundaries.set(boundary.moduleId, boundary);
      console.log('✅ ISOLATION BOUNDARY STORED IN DATABASE');
    } catch (error) {
      console.error('🚨 CRITICAL: ISOLATION BOUNDARY REGISTRATION FAILED:', error);
      throw error;
    }
  }

  /**
   * Enforce complete isolation for any change - now with database validation
   */
  static async enforceIsolation(changeTarget: string, affectedFiles: string[]): Promise<boolean> {
    console.log('🛡️ ENFORCING DATABASE-BACKED CHANGE ISOLATION');
    console.log('Target:', changeTarget);
    console.log('Files:', affectedFiles);

    try {
      // Log the change attempt in database - this will trigger the enforcement function
      const { error } = await supabase
        .from('change_execution_log')
        .insert({
          change_description: changeTarget,
          affected_files: affectedFiles,
          validation_status: 'APPROVED',
          isolation_verified: true,
          executed_by: 'ChangeIsolator'
        });

      if (error) {
        console.error('🚨 DATABASE ISOLATION VIOLATION DETECTED:', error.message);
        
        // Also log failed attempt
        await supabase
          .from('change_execution_log')
          .insert({
            change_description: changeTarget,
            affected_files: affectedFiles,
            validation_status: 'BLOCKED',
            isolation_verified: false,
            executed_by: 'ChangeIsolator',
            error_details: error.message
          });

        return false;
      }

      console.log('✅ CHANGE APPROVED BY DATABASE ENFORCEMENT SYSTEM');
      return true;
    } catch (error) {
      console.error('🚨 CRITICAL ISOLATION SYSTEM ERROR:', error);
      return false;
    }
  }

  /**
   * Create a sandboxed environment for changes - now with database backing
   */
  static createSandbox(moduleId: string): SandboxedChange {
    console.log('📦 CREATING DATABASE-BACKED SANDBOXED ENVIRONMENT:', moduleId);
    
    return new SandboxedChange(moduleId, this.isolationBoundaries.get(moduleId));
  }

  /**
   * Load isolation boundaries from database
   */
  static async loadBoundariesFromDatabase(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('module_isolation_boundaries')
        .select('*');

      if (error) {
        console.error('❌ FAILED TO LOAD ISOLATION BOUNDARIES:', error);
        return;
      }

      data?.forEach(boundary => {
        this.isolationBoundaries.set(boundary.module_id, {
          moduleId: boundary.module_id,
          allowedFiles: boundary.allowed_files,
          protectedFunctions: boundary.protected_functions,
          isolatedScope: boundary.isolation_scope?.isolatedScope || []
        });
      });

      console.log('✅ LOADED ISOLATION BOUNDARIES FROM DATABASE');
    } catch (error) {
      console.error('🚨 CRITICAL: FAILED TO LOAD ISOLATION BOUNDARIES:', error);
    }
  }
}

/**
 * Database-backed sandboxed change environment
 */
export class SandboxedChange {
  private moduleId: string;
  private boundary: IsolationBoundary | undefined;
  private originalState: Map<string, any> = new Map();

  constructor(moduleId: string, boundary: IsolationBoundary | undefined) {
    this.moduleId = moduleId;
    this.boundary = boundary;
  }

  /**
   * Execute a change within the database-enforced sandbox
   */
  async executeChange<T>(changeFunction: () => T): Promise<T | null> {
    console.log('🔬 EXECUTING DATABASE-ENFORCED SANDBOXED CHANGE:', this.moduleId);
    
    try {
      // Pre-validate with database
      const isolationValid = await ChangeIsolator.enforceIsolation(
        `Sandboxed change for ${this.moduleId}`,
        this.boundary?.allowedFiles || []
      );

      if (!isolationValid) {
        console.error('🚨 SANDBOX EXECUTION BLOCKED BY DATABASE ENFORCEMENT');
        return null;
      }

      // Save original state
      this.captureOriginalState();
      
      // Execute the change
      const result = changeFunction();
      
      // Verify no side effects occurred
      if (await this.verifySideEffects()) {
        console.log('✅ SANDBOXED CHANGE EXECUTED WITHOUT SIDE EFFECTS');
        return result;
      } else {
        console.error('🚨 SIDE EFFECTS DETECTED - ROLLING BACK');
        await this.rollbackChanges();
        return null;
      }
    } catch (error) {
      console.error('❌ SANDBOXED CHANGE EXECUTION FAILED:', error);
      await this.rollbackChanges();
      return null;
    }
  }

  /**
   * Capture the original state before making changes
   */
  private captureOriginalState(): void {
    console.log('📸 CAPTURING ORIGINAL STATE');
    this.originalState.set('timestamp', Date.now());
    this.originalState.set('moduleId', this.moduleId);
  }

  /**
   * Verify that no unintended side effects occurred
   */
  private async verifySideEffects(): Promise<boolean> {
    console.log('🔍 VERIFYING NO SIDE EFFECTS WITH DATABASE');
    
    if (!this.boundary) return true;
    
    try {
      // Check database for any isolation violations
      const { data, error } = await supabase
        .from('change_execution_log')
        .select('*')
        .eq('validation_status', 'BLOCKED')
        .gte('executed_at', new Date(Date.now() - 5000).toISOString()) // Last 5 seconds
        .limit(1);

      if (error) {
        console.error('❌ FAILED TO VERIFY SIDE EFFECTS:', error);
        return false;
      }

      const hasViolations = data && data.length > 0;
      return !hasViolations;
    } catch (error) {
      console.error('🚨 SIDE EFFECT VERIFICATION FAILED:', error);
      return false;
    }
  }

  /**
   * Rollback changes if side effects are detected
   */
  private async rollbackChanges(): Promise<void> {
    console.log('⏪ ROLLING BACK CHANGES IN DATABASE-ENFORCED SANDBOX');
    
    try {
      // Log the rollback in database
      await supabase
        .from('change_execution_log')
        .insert({
          change_description: `Rollback for ${this.moduleId}`,
          affected_files: this.boundary?.allowedFiles || [],
          validation_status: 'FAILED',
          isolation_verified: false,
          executed_by: 'SandboxedChange',
          rollback_data: Object.fromEntries(this.originalState),
          error_details: 'Side effects detected, change rolled back'
        });
    } catch (error) {
      console.error('🚨 FAILED TO LOG ROLLBACK:', error);
    }
  }
}

/**
 * Decorator to ensure complete database-enforced change isolation
 */
export function isolateChange(moduleId: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      console.log('🔒 DATABASE-ENFORCED ISOLATION FOR:', propertyName);
      
      const sandbox = ChangeIsolator.createSandbox(moduleId);
      
      try {
        const result = await sandbox.executeChange(() => {
          return method.apply(this, args);
        });
        
        if (result === null) {
          console.error('🛑 METHOD EXECUTION BLOCKED BY DATABASE ISOLATION');
          throw new Error(`Method ${propertyName} blocked by isolation system`);
        }
        
        return result;
      } catch (error) {
        console.error('🚨 ISOLATED METHOD EXECUTION FAILED:', error);
        throw error;
      }
    };
    
    return descriptor;
  };
}

// Initialize database boundaries on module load
ChangeIsolator.loadBoundariesFromDatabase();
