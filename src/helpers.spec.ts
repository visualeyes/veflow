import { isEmptyOrSpaces } from './helpers';

describe('isEmptyOrSpaces', () => {
    it('should handle nulls', () => {
        expect(isEmptyOrSpaces(null)).toBeTruthy();
    });
    it('should handle empty strings', () => {
        expect(isEmptyOrSpaces('')).toBeTruthy();
    });
    it('should handle spaces', () => {
        expect(isEmptyOrSpaces(' ')).toBeTruthy();
    });
    it('should handle new lines', () => {
        expect(isEmptyOrSpaces('\r\n')).toBeTruthy();
    });
    it('should handle characters', () => {
        expect(isEmptyOrSpaces('b')).toBeFalsy();
    });
    it('should handle words', () => {
        expect(isEmptyOrSpaces('banana')).toBeFalsy();
    });
});
