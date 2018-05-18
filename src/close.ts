import { execSync, exec } from 'child_process';
import { isEmptyOrSpaces } from './helpers';
import { merge } from './merge';
import { getConfig } from './config';

const branchBlacklist = [
    'develop',
    'default'
];

export let close = (branch: string) => {
    const config = getConfig();
    if (branchBlacklist.includes(branch)) {
        throw new Error(`Branch ${branch} is blacklisted, cannot close.`);
    }
    console.log(`Pulling from ${config.masterRepo}`);
    execSync(`hg pull -b develop -B ${config.releasedBookmark} ${config.masterRepo}`);

    if (isEmptyOrSpaces(branch)) {
        console.error('No branch specified, assuming current branch.');
        branch = execSync('hg branch').toString().replace(/(\r\n\t|\n|\r\t)/gm, ''); // No line breaks
    }
    console.log('Updating to', branch);
    execSync(`hg up ${branch}`);
    console.log('Closing', branch);
    execSync(`hg com -m \"(veflow) Closed branch: '${branch}'\" --close-branch`);


    merge(branch, config.releasedBookmark);
    let lastBranch = config.releasedBookmark;

    config.unreleasedOrderedBranches.forEach(updateBranch => {
        merge(lastBranch, updateBranch);
        lastBranch = updateBranch;
    });

    merge(lastBranch, 'develop');
};
