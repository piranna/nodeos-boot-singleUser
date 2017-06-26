const symlink = require('fs').symlink

const eachOf = require('async/eachOf')
const mkdirp = require('mkdirp')


function basicEnvironment(callback)
{
  // Change umask system wide so new files are accesible ONLY by its owner
  process.umask(0066)

  // Symlinks for config data optained from `procfs`
  mkdirp('/etc', '0100', function(error)
  {
    if(error && error.code !== 'EEXIST') return callback(error)

    const symlinks =
    {
      '/proc/mounts': '/etc/mtab',  // TODO Maybe hardcode this on filesystem?
      '/proc/net/pnp': '/etc/resolv.conf'
    }

    eachOf(symlinks, function(dest, src, callback)
    {
      symlink(src, dest, function(error)
      {
        if(error && error.code !== 'EEXIST') return callback(error)

        callback()
      })
    },
    function(error)
    {
      if(error && error.code !== 'EROFS') return callback(error)

      // Update environment variables
      var env = process.env
      delete env['vga']
      env['NODE_PATH'] = '/lib/node_modules'

      callback()
    })
  })
}


module.exports = basicEnvironment
