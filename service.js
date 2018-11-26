'use strict'

const TurtleService = require('./')
const util = require('util')

var wallet = new TurtleService({
  containerFile: './container.walletd',
  rpcPassword: 'changeme'
})

function log (message) {
  console.log(util.format('%s: %s', (new Date()).toUTCString(), message))
}

wallet.on('start', (args) => {
  log(util.format('turtle-service has started... %s', args))
})

wallet.on('error', (err) => {
  log(util.format('[ERROR]: %s', err))
})

wallet.on('info', (info) => {
  log(util.format('[INFO]: %s', info))
})

wallet.on('warning', (warn) => {
  log(util.format('[WARNING]: %s', warn))
})

wallet.on('status', (status) => {
  log(util.format('[STATUS] Synced %s out of %s blocks (%s%)', status.blockCount, status.knownBlockCount, Math.round((status.blockCount / status.knownBlockCount) * 100, 1)))
})

wallet.on('synced', () => {
  log('[WALLET] Wallet is synchronized')
})

wallet.on('save', () => {
  log('[WALLET] Wallet saved')
})

wallet.on('down', () => {
  log('[ERROR] turtle-service is not responding... stopping process...')
  wallet.stop()
})

wallet.on('scan', (fromBlock, toBlock) => {
  log(util.format('[WALLET] Scanning block %s to %s', fromBlock, toBlock))
})

wallet.on('transaction', (transaction) => {
  log(util.format('[WALLET] %s transaction %s %s in the amount of %s', (transaction.inbound) ? 'incoming' : 'outgoing', (transaction.inbound) ? 'to' : 'from', transaction.address, transaction.amount))
})

wallet.on('data', (data) => {

})

wallet.on('close', (exitcode) => {
  log(util.format('[WARNING] turtle-service has closed (exitcode: %s)... restarting process...', exitcode))
  wallet.start()
})

wallet.start()
