#!/usr/bin/env node

const repl = require('repl')

const run = require('jocker').run

const basicEnvironment = require('.')


const MOUNTPOINT = '/tmp'


/**
 * This error handler traces the error and starts a Node.js REPL
 *
 * @param {Error} error The error that gets traced
 */
function onerror(error)
{
  console.trace(error)

  repl.start('NodeOS-boot-singleUser> ').on('exit', function()
  {
    console.log('Got "exit" event from repl')
    process.exit(2)
  })
}


basicEnvironment(function(error)
{
  if(error) return onerror(error)

  run(MOUNTPOINT, '/init', {PATH: '/bin'}, function(error)
  {
    if(error) return onerror(error)

    // KTHXBYE >^.^<
  })
})
