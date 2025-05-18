# @process.co/element-types 

[<img src="https://img.shields.io/npm/v/%40process.co%2Felement-types" />](https://www.npmjs.com/package/@process.co/element-types) 
[<img src="https://img.shields.io/github/v/release/process-co/npm-element-types" />](https://github.com/process-co/npm-element-types/releases/latest) 
[<img alt="GitHub package.json version (branch)" src="https://img.shields.io/github/package-json/v/process-co/npm-element-types/main?color=%23AA00AA" />
](https://github.com/process-co/npm-element-types#main)


TypeScript types and utilities for defining Process.co Elements.

## Installation

```bash
npm install @process.co/element-types
```

### Pinned Version
```bash
npm install git+https://github.com/process-co/npm-element-types.git#v0.0.1
```

### Latest Development Version
```bash
npm install git+https://github.com/process-co/npm-element-types.git#main
```

## Usage

```typescript
import { defineApp } from '@process.co/element-types';

// Define the app
const exampleApp = defineApp({
  type: "app",
  app: "example_app",
  props: {
    someProp: {
      label: "Some Prop",
      description: "This is some prop",
      type: "string",
    },
  } as const,
  methods: {
    async doSomthing(this: DeriveAppInstance<ExampleApp>, $: any, switchExpression: string, cases: Record<string, unknown>) {
      // Implementation
      return {};
    },
    // ... other methods
  },
});

// Derive types from the implementation
export type ExampleApp = typeof exampleApp;
export type ExampleAppInstance = DeriveAppInstance<ExampleApp>;

export default processInternalApp;

```

## License

MIT 
