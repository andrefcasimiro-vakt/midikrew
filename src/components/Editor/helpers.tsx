/**
 * > | Simple way to generate an array of steps in order to map the instrument's grid in the JSX
 */
export const generateSteps = (numberOfSteps: number = 16): number[] => {
  const generator: number[] = [];

  for (let i = 0; i < numberOfSteps; i++) {
    generator.push(i)
  }

  return generator;
}
