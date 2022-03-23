module.exports = function (eleventyConfig) {
  // Pass through src/css/* to output
  eleventyConfig.addPassthroughCopy('./favicon.ico');
  eleventyConfig.addPassthroughCopy({ 'src/images': 'images' });
  eleventyConfig.addPassthroughCopy('./src/css/');
  eleventyConfig.addPassthroughCopy('./src/vendor/');
  eleventyConfig.addWatchTarget('./src/css/');

  // Set custom directories for input, output, includes, and data
  return {
    dir: {
      input: 'src',
      output: 'public',
      includes: 'includes',
      data: 'data',
      layouts: 'layouts',
      passthroughFileCopy: true,
      templateFormats: ['html', 'njk', 'md'],
      htmlTemplateEngine: 'njk',
      markdownTemplateEngine: 'njk',
    },
  };
};
