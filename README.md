# @process.co/element-types ![NPM Version](https://img.shields.io/npm/v/%40process.co%2Felement-types?link=https:%2F%2Fwww.npmjs.com%2Fpackage%2F@process.co%2Felement-types) ![GitHub Release](https://img.shields.io/github/v/release/process-co/npm-element-types?link=https:%2F%2Fgithub.com%2Fprocess-co%2Fnpm-element-types%2Freleases%2Flatest) ![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/process-co/npm-element-types/main?color=%23AA00AA&link=https%3A%2F%2Fgithub.com%2Fprocess-co%2Fnpm-element-types)


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

> [!IMPORTANT] 
> CHANGES HERE WILL GET OVERWRITTEN<br/>
> 
> The JS code in this repo is published from an internal mono repo. The publish process bundles the specific parts of our select internal libararies that may be needed at build time. This repo only represents the public parts of the code that are published to NPM.