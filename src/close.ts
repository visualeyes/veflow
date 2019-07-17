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
        merge(mergeInstruction.from, mergeInstruction.to);
    });
};


export let buildMergeList = (config: Config, branch: string): { from: string, to: string }[] => {
    const mergeList: { from: string, to: string }[] = [];
    const sections = branch.match(/(.[^\/]+)/g) || [];
    let last = branch;
    sections.forEach((_section, index, _array) => {
        const next = branch.substr(0, branch.lastIndexOf('/'));
        if (index < sections.length - 2) {
            mergeList.push({
                from: branch,
                to: next
            });
            branch = next;
            last = next;
        }
    });

    if (branch.startsWith('hotfix')) {
        mergeList.push({
            from: branch,
            to: config.releasedBookmark
        });
        last = config.releasedBookmark;
    }

    config.unreleasedOrderedBranches.forEach((releaseBranch, index) => {
        if ((branch.startsWith('release') && index > config.unreleasedOrderedBranches.indexOf(branch)) || branch.startsWith('hotfix')) {
            mergeList.push({
                from: last,
                to: releaseBranch
            });
            last = releaseBranch;
        }
    });

    mergeList.push({
        from: last,
        to: 'develop'
    });

    return mergeList;
};

