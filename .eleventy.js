const parseFootnotes = require('./src/scripts/footnotes');
const { maxProjects } = require('./src/scripts/constants');

const siteLevelTags = ['post', 'project'];
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('./favicon.ico');
  eleventyConfig.addPassthroughCopy({ 'src/images': 'images' });
  eleventyConfig.addPassthroughCopy('./src/css/');
  eleventyConfig.addPassthroughCopy('./src/vendor/');
  eleventyConfig.addPassthroughCopy('./src/scripts/');

  eleventyConfig.addWatchTarget('./src/css/');
  eleventyConfig.addWatchTarget('./src/scripts/');

  eleventyConfig.addPlugin(syntaxHighlight);

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
    const text = content
      .replace(/<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+(?<!\/=\s*)>/gi, '')
      .replace(/\[\^[0-9]+\]/); // remove footnotes
    return text.slice(0, text.lastIndexOf(' ', 300)) + '...';
  });

  eleventyConfig.addFilter('parseFootnotes', parseFootnotes);

  eleventyConfig.addFilter('tagToSlug', function (tag) {
    // Converts tag into a kebab-case path slug
    return tag.toLowerCase().replace(' ', '-');
  });

  eleventyConfig.addFilter('filterByTag', function (posts, tag) {
    // Filters posts by tag. If tag is an empty string, then
    // all posts are returned
    if (tag === '') return posts;
    return posts.filter((post) => {
      return post.data.tags
        .map((tag) => tag.toLowerCase())
        .includes(tag.toLowerCase());
    });
  });

  eleventyConfig.addFilter('sortProjects', function (projects) {
    // Sorts projects based on their [optional] `order` property. Does not
    // require you to give `order` to all projects. Works as follows:
    //    First, projects with `order` < maxProjects are sorted, ascending
    //    Next, projects without an `order` are placed arbitrarily
    //    Last, projects with an `order` >= maxProjects are sorted, ascending
    const sorted = projects.sort((p1, p2) => {
      const [a, b] = [p1.data.order, p2.data.order];
      if (a && b) {
        return a - b;
      } else if ((a && a !== maxProjects) || b == maxProjects) {
        return -1;
      } else {
        return 1;
      }
    });
    return sorted;
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
