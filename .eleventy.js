const siteLevelTags = ['post', 'project'];
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('./favicon.ico');
  eleventyConfig.addPassthroughCopy({ 'src/images': 'images' });
  eleventyConfig.addPassthroughCopy('./src/css/');
  eleventyConfig.addPassthroughCopy('./src/vendor/');
  eleventyConfig.addPassthroughCopy('./src/scripts/');

  eleventyConfig.addWatchTarget('./src/css/');

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

  eleventyConfig.addFilter('parseFootnotes', function (htmlString) {
    // Converts GitHub markdown footnotes into HTML footnotes
    const footnoteRegex = /\[\^([0-9])\]/g;
    const footnotes = new Set();
    const { fileSlug } = this.ctx.page;
    htmlString = htmlString.replace(footnoteRegex, (match, $1) => {
      if (!footnotes.has($1)) {
        footnotes.add($1);
        return `<a class="footnote" id="${fileSlug}-backlink-${$1}" href="#${fileSlug}-footnote-${$1}"><sup>(${$1})</sup></a>`;
      }
      return `<a a class="footnote" id="${fileSlug}-footnote-${$1}" href="#${fileSlug}-backlink-${$1}">(${$1})</a>`;
    });
    return htmlString;
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
