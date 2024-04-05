const { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } = require('@jest/globals');

let myArray;
let myString;

beforeAll(() => {
  // This setup runs once before any tests in this test suite
  myArray = [1, 2, 3, 4];
  myString = 'Hello, world!';
});

afterAll(() => {
  // This cleanup runs once after all tests in this test suite have completed
  // You can perform cleanup or close resources here
});

beforeEach(() => {
  // This setup runs before each individual test case
  // You can initialize variables or reset data before each test
});

afterEach(() => {
  // This cleanup runs after each individual test case
  // You can perform cleanup or reset data after each test
});

describe('Jest Keywords Example', () => {
  it('should check for strict equality in arrays', () => {
    expect(myArray).toContain(3);
  });

  it('should check for a substring in a string', () => {
    expect(myString).toContain('world');
  });

  it('should check for deep equality in arrays', () => {
    expect(myArray).toEqual([1, 2, 3, 4]);
  });

  it('should check for deep equality in objects', () => {
    const myObject = { id: 1, name: 'Alice' };
    expect(myObject).toEqual({ id: 1, name: 'Alice' });
  });

  it('should check for a regular expression match', () => {
    expect(myString).toMatch(/world/);
  });

  it('should check for a function to throw an error', () => {
    function throwError() {
      throw new Error('This is an error');
    }
    expect(throwError).toThrow('This is an error');
  });
});
