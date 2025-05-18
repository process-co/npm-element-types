# Process.co Element Types

This repository contains the bundled version of the Process.co Element Types.

## Installation

```bash
# Install
npm install @process.co/element-types
```

## Usage

### Command Line Interface

```bash
process-element ./path/to/element
```

### Programmatic Usage (CommonJS)

```javascript
const { loadElement } = require('@process.co/element-types');

// Use the library
loadElement('./path/to/element').then(result => {
  console.log(result);
});
```

### Programmatic Usage (ESM)

```javascript    
import { loadElement } from '@process.co/element-types';

// Use the library
const result = await loadElement('./path/to/element');
console.log(result);
```
