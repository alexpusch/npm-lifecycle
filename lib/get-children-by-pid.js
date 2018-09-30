module.exports = getChildrenByPid

const _spawnSync = require('child_process').spawnSync

function getChildrenByPid (parentPid) {
  if (process.platform === 'win32') {
    return []
  }

  const result = _spawnSync('ps', ['-Ao', 'pid,ppid'])
  const output = result.output
    .filter(o => o)
    .map(o => o.toString())
    .join('\n')

  const childPids = output
    .split('\n')
    .map(row => {
      const match = row.match(/(\d+)\s+(\d+)/)

      return match
        ? [parseInt(match[1], 10), parseInt(match[2], 10)]
        : [-1, -1]
    })
    .filter(([pid, ppid]) => ppid === parentPid)
    .map(([pid, ppid]) => pid)

  return childPids
}
