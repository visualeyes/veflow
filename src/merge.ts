import { execSync, exec } from 'child_process';
import { isEmptyOrSpaces } from './helpers';

export let merge = (from: string, to: string) => {
    if (isEmptyOrSpaces(from) || isEmptyOrSpaces(to)) {
        throw new Error('No branch specified, assuming current branch.');
    }
    console.log(`Merging branch ${from} into ${to}`);
    execSync(`hg up ${to}`);
    execSync(`hg merge ${from}`);
    execSync(`hg com -m \"(veflow) Merged '${from}' into '${to}'`);
};
