/*! bundles-banner.js | @author brikcss <https://github.com/brikcss> | @reference https://github.com/brikcss/bundles-banner */

import path from 'path'

export default (bundle = {}, bundler = {}) => {
  // Set default options.
  bundler.options = Object.assign({
    include: ['.js', '.css'],
    prefix: '/*! ',
    suffix: ' */',
    joinWith: ' | ',
    metadata: ['author', 'reference']
  }, bundler.options)
  // Iterate through each output file.
  bundle.output.forEach((file, i) => {
    // Only add banner if file extension matches `include`.
    if (
      (typeof bundler.options.include === 'function' && !bundler.options.include(file, bundle)) ||
      !bundler.options.include.includes(path.extname(file.source.path))
    ) { return }
    // Convert `metadata` to Array of Strings.
    const banner = bundler.options.metadata.map(item => {
      if (item instanceof Array) {
        item = item.join(' ')
      } else if (typeof item === 'string') {
        if (!file.data[item]) return
        item = '@' + item + ' ' + file.data[item]
      }
      return item
    })
    // Add file name.
    banner.unshift(path.basename(file.source.path))
    // Prepend banner to content.
    file.content = bundler.options.prefix + banner.join(bundler.options.joinWith) + bundler.options.suffix + '\n\n' + file.content
  })
  // Once all promises resolve, return the bundle.
  return bundle
}
