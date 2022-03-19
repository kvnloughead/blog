module.exports = function (eleventyConfig) {
  // Pass through src/css/* to output
  eleventyConfig.addPassthroughCopy('./src/css/');
  eleventyConfig.addWatchTarget('./src/css/');

  // Set custom directories for input, output, includes, and data
  return {
    dir: {
      input: 'src',
      includes: '_includes',
      data: '_data',
      output: 'public',
    },
  };
};
