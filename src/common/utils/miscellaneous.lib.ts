const srcBuilder = (path: string, distribution: string) => {
  const sanitizedDistribution = distribution.endsWith('/')
    ? distribution.slice(0, -1)
    : distribution;
  const sanitizedPath = path.startsWith('/') ? path.slice(0, 0) : path;
  return `${sanitizedDistribution}/${sanitizedPath}`;
};

export { srcBuilder };
