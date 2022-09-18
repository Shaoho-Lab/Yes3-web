import { providerURL, privateKey, address, abi } from './constants'
import ethers from 'ethers'
import { TupleType } from 'typescript'

const provider = new ethers.providers.JsonRpcProvider(providerURL)

const signer = new ethers.Wallet(privateKey, provider)
const myContract_write = new ethers.Contract(address, abi, signer) // Write only
const myContract_read = new ethers.Contract(address, abi, provider) // Read only

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

function balanceOf(addr: string) {
  return myContract_read.balanceOf(addr)
}

function ownerOf(promptId: TupleType) {
  return myContract_read.ownerOf(promptId)
}

function tokenURI(promptId: TupleType) {
  return myContract_read.tokenURI(promptId)
}

function totalSupply(templateId: TupleType) {
  return myContract_read.totalSupply(templateId)
}

function supportsInterface(interfaceId: bigint) {
  return myContract_read.supportsInterface(interfaceId)
}

function queryAllPromptByAddr(addr: string) {
  return myContract_read.queryAllPromptByAddr(addr)
}

function queryAllRepliesByAddr(addr: string) {
  return myContract_read.queryAllRepliesByAddr(addr)
}

function queryAllRepliesByPrompt(promptId: TupleType) {
  return myContract_read.queryAllRepliesByPrompt(promptId)
}

function mint(templateId: number, question: string, context: string, to: string) {
  return myContract_write._mint(templateId, question, context, to)
}

function replyPrompt(
  promptId: TupleType,
  replierAddr: string,
  replierName: string,
  replyDetail: string,
  comment: string,
  signature: number,
) {
  return myContract_write._replyPrompt(
    promptId,
    replierAddr,
    replierName,
    replyDetail,
    comment,
    signature,
  )
}

function burnReplies(promptId: TupleType, replier: string) {
  return myContract_write._burnReplies(promptId, replier)
}

function burnPrompt(promptId: TupleType) {
  return myContract_write._burnPrompt(promptId)
}
