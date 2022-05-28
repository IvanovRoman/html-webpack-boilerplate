const fs = require('fs');
const path = require('path');

const insertIncludes = function (self, content, regex) {
  const includes = content.match(regex);
  let newContent = content;
  if (includes) {
    includes.forEach((includeFilename) => {
      if (includeFilename.substr(0, 1) == '_') {
        const includePath = path.resolve(`./src/html/${includeFilename}`);
        let includeContent = fs.readFileSync(includePath, 'utf8');
        includeContent = insertIncludes(self, includeContent, regex);
        newContent = newContent.replace(`<include>${includeFilename}</include>`, includeContent);
        self.addDependency(includePath);
      }
    });
  }
  return newContent;
};

const loader = function (source) {
  const options = this.getOptions();
  const regex = new RegExp(`${options.html.join('|')}`, 'ig');
  const newSource = insertIncludes(this, source, regex);

  return `export default ${JSON.stringify(newSource)}`;
};

module.exports = loader;
