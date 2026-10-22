const largeCaseNumbers = Array.from({ length: 1001 }, (_value, index) => index + 1);

export const problemTestCases = Object.freeze({
  "two-sum": Object.freeze({
    timeLimitSeconds: 2,
    memoryLimitKb: 128000,
    cases: Object.freeze([
      { hidden: false, input: "4\n2 7 11 18\n9\n", expectedOutput: "0 1\n" },
      { hidden: true, input: "4\n3 2 4 8\n6\n", expectedOutput: "1 2\n" },
      { hidden: true, input: "4\n3 3 9 12\n6\n", expectedOutput: "0 1\n" },
      { hidden: true, input: "5\n-8 0 1 2 10\n2\n", expectedOutput: "1 3\n" },
      { hidden: true, input: "6\n4 -2 9 1 -8 5\n-10\n", expectedOutput: "1 4\n" },
      {
        hidden: true,
        input: `${largeCaseNumbers.length}\n${largeCaseNumbers.join(" ")}\n2000\n`,
        expectedOutput: "998 1000\n",
      },
    ]),
  }),
});

export function parseTwoSumInput(input) {
  const values = input.trim().split(/\s+/).map(Number);
  const count = values[0];
  if (!Number.isInteger(count) || count < 2 || values.length !== count + 2) return null;
  const numbers = values.slice(1, count + 1);
  const target = values[count + 1];
  if (!numbers.every(Number.isSafeInteger) || !Number.isSafeInteger(target)) return null;
  return { numbers, target };
}

export function isValidTwoSumOutput(input, output) {
  const parsedInput = parseTwoSumInput(input);
  const match = output.trim().match(/^\[?\s*(-?\d+)\s*(?:,|\s)\s*(-?\d+)\s*\]?$/);
  if (!parsedInput || !match) return false;
  const first = Number(match[1]);
  const second = Number(match[2]);
  return Number.isSafeInteger(first)
    && Number.isSafeInteger(second)
    && first >= 0
    && second >= 0
    && first < parsedInput.numbers.length
    && second < parsedInput.numbers.length
    && first !== second
    && parsedInput.numbers[first] + parsedInput.numbers[second] === parsedInput.target;
}
