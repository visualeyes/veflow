#!/usr/bin/env node
import { close } from './close';

const args = process.argv.slice(2);

switch (args[0]) {
 case 'close':
    close(args[1]);
    break;
 default:
    if (args[0]) {
        console.error(`Option ${args[0]} is not supported`);
    } else {
        console.error('No arguments were provided');
    }
    break;
}
