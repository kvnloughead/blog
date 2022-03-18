module.exports = function (eleventyConfig) {
  // Copy `src/style.css` to `_site/style.css`
  eleventyConfig.addPassthroughCopy('src/style.css');

  // Set custom directories for input, output, includes, and data
  return {
    dir: {
      input: 'src',
      includes: '_includes',
      data: '_data',
      output: '_site',
    },
  };
};
