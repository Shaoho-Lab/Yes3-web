import {providerURL, privateKey, address, abi} from './constants'

const ethers = require('ethers')

const provider = new ethers.providers.JsonRpcProvider(providerURL)

var signer = new ethers.Wallet(privateKey, provider)
myContract_write = new ethers.Contract(address, abi, signer) // Write only
myContract_read = new ethers.Contract(address, abi, provider) // Read only

// myContract_write
//   ._mint(
//     2,
//     'Can I drink a lot?',
//     'https://mumbai.polygonscan.com/address/0xd66dC2FfE2521f54236d16Dd7E8e168eBb42C76B#writeContract',
//     '0x3dfca99946026acbb3b9cae7ba3f442148ba4398',
//   )
//   .then(result => {
//     console.log(result)
//   })

// myContract_read
//   .queryAllPromptByAddr('0x3dfca99946026acbb3b9cae7ba3f442148ba4398')
//   .then(result => {
//     console.log(result)
//   })

function name() {
  return myContract_read.name()
}

function symbol() {
  return myContract_read.symbol()
}

function balanceOf(addr) {
  return myContract_read.balanceOf(addr)
}

function ownerOf(promptId) {
  return myContract_read.ownerOf(promptId)
}

function tokenURI(promptId) {
  return myContract_read.tokenURI(promptId)
}

function totalSupply(templateId) {
  return myContract_read.totalSupply(templateId)
}

function supportsInterface(interfaceId) {
  return myContract_read.supportsInterface(interfaceId)
}

function queryAllPromptByAddr(addr) {
  return myContract_read.queryAllPromptByAddr(addr)
}

function queryAllRepliesByAddr(addr) {
  return myContract_read.queryAllRepliesByAddr(addr)
}

function queryAllRepliesByPrompt(promptId) {
  return myContract_read.queryAllRepliesByPrompt(promptId)
}

function mint(templateId, question, context, to) {
  return myContract_write._mint(templateId, question, context, to)
}

function replyPrompt(promptId, replierAddr, replierName, replyDetail, comment, signature) {
  return myContract_write._replyPrompt(promptId, replierAddr, replierName, replyDetail, comment, signature)
}

function burnReplies(promptId, replier) {
  return myContract_write._burnReplies(promptId, replier)
}

function burnPrompt(promptId) {
  return myContract_write._burnPrompt(promptId)
}