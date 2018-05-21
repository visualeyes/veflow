import { writeFileSync } from 'fs';

writeFileSync('bin/index', '#!/usr/bin/env node\nrequire(\'./index.js\')');
