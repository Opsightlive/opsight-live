
# 🧩 Modular Build Logic Prompt (for All Future Features)

## Core Principle
Build every new feature using modular logic so it plugs in cleanly without breaking anything else.

## Requirements Checklist

### ✅ Module Isolation
- Each module must be isolated, swappable, and updatable on its own
- No tight coupling between modules
- Each module should have its own folder structure
- Clear separation of concerns

### ✅ Consistent Structure
- All modules must follow the same folder + route naming structure
- Standard naming conventions across all modules
- Consistent file organization patterns
- Uniform component architecture

### ✅ Shared Library
- Shared elements go in a central library (e.g. buttons, loaders, modals)
- Reusable components in `/src/components/ui/`
- Common utilities in `/src/lib/`
- Shared hooks in `/src/hooks/`

### ✅ Quality Assurance
- Any new module must be tested for:
  - Layout responsiveness
  - Performance and speed
  - Error handling
  - Scaling capabilities
- No breaking changes to existing functionality

## Module Structure Template

```
src/
├── pages/
│   └── [ModuleName]/
│       ├── index.tsx
│       ├── components/
│       ├── hooks/
│       └── utils/
├── components/
│   ├── ui/ (shared)
│   └── [module-specific]/
├── hooks/
│   └── use[ModuleName].ts
└── lib/
    └── [module-utils].ts
```

## Implementation Guidelines

1. **Start Small**: Build minimum viable features first
2. **Test Early**: Verify functionality before expanding
3. **Document Changes**: Update this file when adding new patterns
4. **Review Impact**: Check that changes don't break existing modules
5. **Maintain Consistency**: Follow established patterns and conventions

## Before Adding Any New Feature

1. Review existing similar modules for patterns
2. Identify reusable components that can be shared
3. Plan the module structure following the template
4. Consider error boundaries and loading states
5. Test integration with existing system

This document should be referenced for every new feature development to ensure consistency and maintainability across the entire application.
