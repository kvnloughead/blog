const siteLevelTags = ['post', 'project'];

module.exports = function (eleventyConfig) {
  // Pass through src/css/* to output
  eleventyConfig.addPassthroughCopy('./favicon.ico');
  eleventyConfig.addPassthroughCopy({ 'src/images': 'images' });
  eleventyConfig.addPassthroughCopy('./src/css/');
  eleventyConfig.addPassthroughCopy('./src/vendor/');
  eleventyConfig.addPassthroughCopy('./src/scripts/');

  eleventyConfig.addWatchTarget('./src/css/');

  eleventyConfig.addCollection('postTags', function (collection) {
    // Returns array of all post/project level tags, filtering out
    // "site level" tags such as `post` and `project`
    let postTagSet = new Set();
    collection.getAll().forEach((item) => {
      if ('tags' in item.data && item.data.tags.includes('post')) {
        let tags = item.data.tags;
        // Filters out "site level" tags from `postTagSet`
        tags
          .filter((tag) => !siteLevelTags.includes(tag))
          .forEach((tag) => postTagSet.add(tag));
      }
    });
    return [...postTagSet];
  });

  eleventyConfig.addFilter('removeSiteLevelTags', (tags) => {
    // Removes "site level" tags such as "post" and "project" from an item's
    // list of tags.
    return tags.filter((tag) => !siteLevelTags.includes(tag));
  });

  eleventyConfig.addFilter('readableDate', function (dateObj) {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return dateObj.toLocaleDateString('en-us', options);
  });

  eleventyConfig.addFilter('excerpt', function (content) {
    // Tries to remove all HTML tags and returns text content. Probably won't
    // work to well unless there are around 200 characters of plain text at
    // the start of the post.
    const text = content.replace(
      /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+(?<!\/=\s*)>/gi,
      '',
    );
    return text.slice(0, text.lastIndexOf(' ', 200)) + '...';
  });

  eleventyConfig.addFilter('log', function (item) {
    console.log(item);
  });

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
