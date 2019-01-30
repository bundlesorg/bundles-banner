/*! .lintstagedrc.js | @author brikcss <https://github.com/brikcss> | @reference <https://github.com/okonet/lint-staged> */

module.exports = {
  linters: {
    'lib/bundles-banner.js': ['npx node-minify --compressor uglify-es --input lib/bundles-banner.js --output lib/bundles-banner.min.js', 'git add lib/bundles-banner.min.js'],
    '*.js': ['standard --fix', 'git add'],
    '*.css': ['prettier --parser css --write', 'stylelint', 'git add'],
    '*.json': ['prettier --parser json --write', 'git add'],
    '*.md': ['prettier --parser markdown --write', 'git add']
  },
  concurrent: true,
  globOptions: {
    matchBase: true,
    dot: true
  },
  ignore: ['*.min.{js,css}']
}
