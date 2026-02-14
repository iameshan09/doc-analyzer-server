/**
 * Returns a random subset of elements from an array.
 * * @param array - The source array to pick from
 * @param count - The number of elements to return
 * @returns A new array with randomly selected elements
 */
function getRandomElements<T>(array: T[], count: number): T[] {
  // Requirement: If count >= array size, return the original array
  if (count >= array.length) {
    return [...array];
  }

  // Create a shallow copy to avoid mutating the original input
  const result = [...array];

  // Fisher-Yates shuffle (shuffles only the necessary number of elements)
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * (result.length - i)) + i;

    // Swap elements
    [result[i], result[randomIndex]] = [result[randomIndex], result[i]];
  }

  // Return only the requested number of elements
  return result.slice(0, count);
}

export { getRandomElements };
