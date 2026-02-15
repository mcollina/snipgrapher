export function printError(error: unknown): void {
  if (error instanceof Error) {
    console.error(`Error: ${error.message}`);
    return;
  }

  console.error('Error:', error);
}
