import { buildMergeList } from './close';
import { Config } from './config';

describe('buildMergeList', () => {
    const config: Config = {
        masterRepo: 'master',
        releasedBookmark: 'release-123',
        unreleasedOrderedBranches: [
            'release/1',
            'release/2'
        ]
    };
    it('should handle hotfixes', () => {
        const hotfix = 'hotfix/1234';
        const list = buildMergeList(config, hotfix);
        expect(list).toEqual([
            [hotfix, config.releasedBookmark],
            [config.releasedBookmark, config.unreleasedOrderedBranches[0]],
            [config.unreleasedOrderedBranches[0], config.unreleasedOrderedBranches[1]],
            [config.unreleasedOrderedBranches[1], 'develop']
        ]);
    });
    it('should handle first tier releases', () => {
        const release = 'release/1/2.12';
        const list = buildMergeList(config, release);
        expect(list).toEqual([
            [release, config.unreleasedOrderedBranches[0]],
            [config.unreleasedOrderedBranches[0], config.unreleasedOrderedBranches[1]],
            [config.unreleasedOrderedBranches[1], 'develop']
        ]);
    });
    it('should handle later tier releases', () => {
        const release = 'release/2/2.12';
        const list = buildMergeList(config, release);
        expect(list).toEqual([
            [release, config.unreleasedOrderedBranches[1]],
            [config.unreleasedOrderedBranches[1], 'develop']
        ]);
    });
    it('should handle feature branches', () => {
        const feature = 'feature/1234';
        const list = buildMergeList(config, feature);
        expect(list).toEqual([
            [feature, 'develop']
        ]);
    });
});
