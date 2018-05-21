import { execSync, exec } from 'child_process';
import { isEmptyOrSpaces } from './helpers';
import { merge } from './merge';
import { getConfig, Config } from './config';

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


    buildMergeList(config, branch).forEach(mergeInstruction => {
        merge(mergeInstruction[0], mergeInstruction[1]);
    });
};


export let buildMergeList = (config: Config, branch: string): [string, string][] => {
    const mergeList: [string, string][] = [];
    let lastBranch = branch;
    if (branch.startsWith('hotfix')) {
        mergeList.push([branch, config.releasedBookmark]);
        lastBranch = config.releasedBookmark;
    }
    if (branch.startsWith('release') || branch.startsWith('hotfix')) {
        let startPoint: string = null;
        config.unreleasedOrderedBranches.forEach(releaseBranch => {
            if (branch.startsWith(releaseBranch)) {
                startPoint = releaseBranch;
            }
        });
        let branchList = config.unreleasedOrderedBranches;
        if (startPoint !== null) {
            branchList = branchList.slice(branchList.indexOf(startPoint), branchList.length);
        }

        branchList.forEach(releaseBranch => {
            mergeList.push([lastBranch, releaseBranch]);
            lastBranch = releaseBranch;
        });
    }

    mergeList.push([lastBranch, 'develop']);

    return mergeList;
};

