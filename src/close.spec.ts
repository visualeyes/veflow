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
            { from: hotfix, to: 'release-123' },
            { from: 'release-123', to: 'release/1' },
            { from: 'release/1', to: 'release/2' },
            { from: 'release/2', to: 'develop' }
        ]);
    });
    it('should handle first tier releases', () => {
        const release = 'release/1/2.12';
        const list = buildMergeList(config, release);
        expect(list).toEqual([
            { from: release, to: 'release/1' },
            { from: 'release/1', to: 'release/2' },
            { from: 'release/2', to: 'develop' }
        ]);
    });
    it('should handle later tier releases', () => {
        const release = 'release/2/2.12';
        const list = buildMergeList(config, release);
        expect(list).toEqual([
            { from: release, to: 'release/2' },
            { from: 'release/2', to: 'develop' }
        ]);
    });
    it('should handle feature branches', () => {
        const feature = 'feature/1234';
        const list = buildMergeList(config, feature);
        expect(list).toEqual([
            { from: feature, to: 'develop' }
        ]);
    });
    it('should handle feature subbranches', () => {
        const subfeature = 'feature/1234/4321';
        const list = buildMergeList(config, subfeature);
        expect(list).toEqual([
            { from: subfeature, to: 'feature/1234' },
            { from: 'feature/1234', to: 'develop'}
        ]);
    });
    it('should handle release subbranches', () => {
        const subrelease = 'release/1/4321';
        const list = buildMergeList(config, subrelease);
        expect(list).toEqual([
            { from: subrelease, to: 'release/1' },
            { from: 'release/1', to: 'release/2' },
            { from: 'release/2', to: 'develop' }
        ]);
    });
    it('should handle release subbranches', () => {
        const subrelease = 'release/2/4321';
        const list = buildMergeList(config, subrelease);
        expect(list).toEqual([
            { from: subrelease, to: 'release/2' },
            { from: 'release/2', to: 'develop' }
        ]);
    });
    it('should handle hotfix subbranches', () => {
        const subhotfix = 'hotfix/1234/4321';
        const list = buildMergeList(config, subhotfix);
        expect(list).toEqual([
            { from: subhotfix, to: 'hotfix/1234' },
            { from: 'hotfix/1234', to: 'release-123' },
            { from: 'release-123', to: 'release/1' },
            { from: 'release/1', to: 'release/2' },
            { from: 'release/2', to: 'develop' }
        ]);
    });

    it('should handle hotfix subsubbranches', () => {
        const subsubhotfix = 'hotfix/1234/4321/x';
        const list = buildMergeList(config, subsubhotfix);
        expect(list).toEqual([
            { from: subsubhotfix, to: 'hotfix/1234/4321' },
            { from: 'hotfix/1234/4321', to: 'hotfix/1234' },
            { from: 'hotfix/1234', to: 'release-123' },
            { from: 'release-123', to: 'release/1' },
            { from: 'release/1', to: 'release/2' },
            { from: 'release/2', to: 'develop' }
        ]);
    });
});
