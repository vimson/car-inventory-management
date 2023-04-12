import { parseJson } from '../../utils/generic.utils';

describe('Testing generic utility functions', () => {
  it('Corrupted JSON string', () => {
    const parsedObject = parseJson('[');
    expect(parsedObject).toEqual({});
  });

  it('Proper JSON string passing', () => {
    const parsedObject = parseJson('{"status":"published"}');
    expect(parsedObject).toEqual({ status: 'published' });
  });
});
