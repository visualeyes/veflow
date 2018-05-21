import { readFileSync } from 'fs';

export interface Config {
    masterRepo: string;
    releasedBookmark: string;
    unreleasedOrderedBranches: string[];
}

const configFileName = '.veflow.json';

export let getConfig = () => {
    let config: Config;
    try {
        config = JSON.parse(readFileSync(configFileName).toString()) as Config;
    } catch (error) {
        throw new Error('Couldn\'t read configuration file: ' + error);
    }
    return config;
};
