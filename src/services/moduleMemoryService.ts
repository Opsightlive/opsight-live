
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ModuleState {
  id?: string;
  user_id?: string;
  module_name: string;
  module_version: string;
  configuration: Record<string, any>;
  feature_flags: Record<string, boolean>;
  data_schema: Record<string, any>;
  ui_layout: Record<string, any>;
  business_logic: Record<string, any>;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FeatureHistory {
  id?: string;
  user_id?: string;
  module_name: string;
  feature_name: string;
  change_type: 'created' | 'updated' | 'disabled' | 'enabled' | 'deleted';
  previous_state?: Record<string, any>;
  new_state: Record<string, any>;
  change_description?: string;
  created_at?: string;
  created_by?: string;
}

export interface ConsistencyRule {
  id?: string;
  user_id?: string;
  rule_name: string;
  rule_type: 'layout' | 'navigation' | 'data_flow' | 'business_logic' | 'ui_pattern';
  rule_definition: Record<string, any>;
  affected_modules: string[];
  is_enforced: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ModuleDependency {
  id?: string;
  user_id?: string;
  source_module: string;
  target_module: string;
  dependency_type: 'data' | 'ui' | 'navigation' | 'business_logic';
  dependency_details: Record<string, any>;
  is_critical: boolean;
  created_at?: string;
}

// Helper function to safely convert Json to Record<string, any>
const safeJsonToRecord = (json: any): Record<string, any> => {
  if (typeof json === 'object' && json !== null) {
    return json as Record<string, any>;
  }
  return {};
};

class ModuleMemoryService {
  // Module States Management
  async getModuleState(userId: string, moduleName: string): Promise<ModuleState | null> {
    try {
      const { data, error } = await supabase
        .from('module_states')
        .select('*')
        .eq('user_id', userId)
        .eq('module_name', moduleName)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching module state:', error);
        return null;
      }

      if (!data) return null;

      return {
        ...data,
        configuration: safeJsonToRecord(data.configuration),
        feature_flags: safeJsonToRecord(data.feature_flags),
        data_schema: safeJsonToRecord(data.data_schema),
        ui_layout: safeJsonToRecord(data.ui_layout),
        business_logic: safeJsonToRecord(data.business_logic),
      };
    } catch (error) {
      console.error('Error fetching module state:', error);
      return null;
    }
  }

  async saveModuleState(userId: string, moduleState: Omit<ModuleState, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('module_states')
        .upsert({
          user_id: userId,
          ...moduleState
        }, {
          onConflict: 'user_id,module_name'
        });

      if (error) {
        console.error('Error saving module state:', error);
        toast.error('Failed to save module state');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving module state:', error);
      toast.error('Failed to save module state');
      return false;
    }
  }

  async getAllModuleStates(userId: string): Promise<ModuleState[]> {
    try {
      const { data, error } = await supabase
        .from('module_states')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching module states:', error);
        return [];
      }

      return (data || []).map(item => ({
        ...item,
        configuration: safeJsonToRecord(item.configuration),
        feature_flags: safeJsonToRecord(item.feature_flags),
        data_schema: safeJsonToRecord(item.data_schema),
        ui_layout: safeJsonToRecord(item.ui_layout),
        business_logic: safeJsonToRecord(item.business_logic),
      }));
    } catch (error) {
      console.error('Error fetching module states:', error);
      return [];
    }
  }

  // Feature History Management
  async getFeatureHistory(userId: string, moduleName?: string, limit: number = 50): Promise<FeatureHistory[]> {
    try {
      let query = supabase
        .from('feature_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (moduleName) {
        query = query.eq('module_name', moduleName);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching feature history:', error);
        return [];
      }

      return (data || []).map(item => ({
        ...item,
        change_type: item.change_type as FeatureHistory['change_type'],
        previous_state: item.previous_state ? safeJsonToRecord(item.previous_state) : undefined,
        new_state: safeJsonToRecord(item.new_state),
      }));
    } catch (error) {
      console.error('Error fetching feature history:', error);
      return [];
    }
  }

  async recordFeatureChange(
    userId: string,
    change: Omit<FeatureHistory, 'id' | 'user_id' | 'created_at' | 'created_by'>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('feature_history')
        .insert({
          user_id: userId,
          created_by: userId,
          ...change
        });

      if (error) {
        console.error('Error recording feature change:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error recording feature change:', error);
      return false;
    }
  }

  // Consistency Rules Management
  async getConsistencyRules(userId: string, ruleType?: ConsistencyRule['rule_type']): Promise<ConsistencyRule[]> {
    try {
      let query = supabase
        .from('consistency_rules')
        .select('*')
        .eq('user_id', userId)
        .eq('is_enforced', true)
        .order('created_at', { ascending: false });

      if (ruleType) {
        query = query.eq('rule_type', ruleType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching consistency rules:', error);
        return [];
      }

      return (data || []).map(item => ({
        ...item,
        rule_type: item.rule_type as ConsistencyRule['rule_type'],
        rule_definition: safeJsonToRecord(item.rule_definition),
      }));
    } catch (error) {
      console.error('Error fetching consistency rules:', error);
      return [];
    }
  }

  async saveConsistencyRule(userId: string, rule: Omit<ConsistencyRule, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('consistency_rules')
        .upsert({
          user_id: userId,
          ...rule
        }, {
          onConflict: 'user_id,rule_name'
        });

      if (error) {
        console.error('Error saving consistency rule:', error);
        toast.error('Failed to save consistency rule');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving consistency rule:', error);
      toast.error('Failed to save consistency rule');
      return false;
    }
  }

  // Module Dependencies Management
  async getModuleDependencies(userId: string, sourceModule?: string): Promise<ModuleDependency[]> {
    try {
      let query = supabase
        .from('module_dependencies')
        .select('*')
        .eq('user_id', userId)
        .order('source_module');

      if (sourceModule) {
        query = query.eq('source_module', sourceModule);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching module dependencies:', error);
        return [];
      }

      return (data || []).map(item => ({
        ...item,
        dependency_type: item.dependency_type as ModuleDependency['dependency_type'],
        dependency_details: safeJsonToRecord(item.dependency_details),
      }));
    } catch (error) {
      console.error('Error fetching module dependencies:', error);
      return [];
    }
  }

  async saveModuleDependency(userId: string, dependency: Omit<ModuleDependency, 'id' | 'user_id' | 'created_at'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('module_dependencies')
        .upsert({
          user_id: userId,
          ...dependency
        }, {
          onConflict: 'user_id,source_module,target_module,dependency_type'
        });

      if (error) {
        console.error('Error saving module dependency:', error);
        toast.error('Failed to save module dependency');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving module dependency:', error);
      toast.error('Failed to save module dependency');
      return false;
    }
  }

  // Validation and Consistency Checks
  async validateModuleConsistency(userId: string, moduleName: string): Promise<{ isValid: boolean; violations: string[] }> {
    try {
      const rules = await this.getConsistencyRules(userId);
      const moduleState = await this.getModuleState(userId, moduleName);
      const violations: string[] = [];

      if (!moduleState) {
        violations.push(`Module state not found for ${moduleName}`);
        return { isValid: false, violations };
      }

      // Check rules that affect this module
      const applicableRules = rules.filter(rule => 
        rule.affected_modules.includes(moduleName) || rule.affected_modules.includes('*')
      );

      for (const rule of applicableRules) {
        // Validate based on rule type and definition
        const isRuleValid = this.validateRule(rule, moduleState);
        if (!isRuleValid) {
          violations.push(`Consistency rule violated: ${rule.rule_name}`);
        }
      }

      return { isValid: violations.length === 0, violations };
    } catch (error) {
      console.error('Error validating module consistency:', error);
      return { isValid: false, violations: ['Error during validation'] };
    }
  }

  private validateRule(rule: ConsistencyRule, moduleState: ModuleState): boolean {
    // Basic validation logic - can be extended based on rule definitions
    try {
      const { rule_definition } = rule;
      
      // Example validations based on rule type
      switch (rule.rule_type) {
        case 'ui_pattern':
          return this.validateUIPattern(rule_definition, moduleState.ui_layout);
        case 'data_flow':
          return this.validateDataFlow(rule_definition, moduleState.data_schema);
        case 'business_logic':
          return this.validateBusinessLogic(rule_definition, moduleState.business_logic);
        default:
          return true; // Unknown rule types pass by default
      }
    } catch (error) {
      console.error('Error validating individual rule:', error);
      return false;
    }
  }

  private validateUIPattern(ruleDefinition: Record<string, any>, uiLayout: Record<string, any>): boolean {
    // Implement UI pattern validation logic
    return true;
  }

  private validateDataFlow(ruleDefinition: Record<string, any>, dataSchema: Record<string, any>): boolean {
    // Implement data flow validation logic
    return true;
  }

  private validateBusinessLogic(ruleDefinition: Record<string, any>, businessLogic: Record<string, any>): boolean {
    // Implement business logic validation logic
    return true;
  }
}

export const moduleMemoryService = new ModuleMemoryService();
