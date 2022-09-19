import { providerURL, privateKey, address, abi } from './constants'
import ethers from 'ethers'
import {
  auth,
  arrayUnion,
  firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  firestoreQuery,
  orderBy,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "../firebase";

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
  myContract_read.name().then((result: string) => {
    return result
  })
}

function symbol() {
  myContract_read.symbol().then((result: string) => {
    return result
  })
}

function balanceOf(addr: string) {
  myContract_read.balanceOf(addr).then((result: number) => {
    return result
  })
}

function ownerOf(promptId: [number, number]) {
  myContract_read.ownerOf(promptId).then((result: string) => {
    return result
  })
}

function tokenURI(promptId: [number, number]) {
  myContract_read.tokenURI(promptId).then((result: string) => {
    return result
  })
}

function totalSupply(templateId: [number, number]) {
  myContract_read.totalSupply(templateId).then((result: number) => {
    return result
  })
}

function supportsInterface(interfaceId: bigint) {
  myContract_read.supportsInterface(interfaceId).then((result: boolean) => {
    return result
  })
}

function queryAllPromptByAddr(addr: string) {
  myContract_read.queryAllPromptByAddr(addr).then((result: [number, number][]) => {
    return result
  })
}

function queryAllRepliesByAddr(addr: string) {
  myContract_read.queryAllRepliesByAddr(addr).then((result: [number, number][]) => {
    return result
  })
}

function queryAllRepliesByPrompt(promptId: [number, number]) {
  myContract_read.queryAllRepliesByPrompt(promptId).then((result: [string, string, string, string, number][]) => {
    return result
  })
}

function mint(templateId: number, question: string, context: string, to: string) {
  myContract_write._mint(templateId, question, context, to).then((result: [number, number]) => {
    return result
  })
}

function replyPrompt(
  promptId: [number, number],
  replierAddr: string,
  replierName: string,
  replyDetail: string,
  comment: string,
  signature: number,
  requester: string,
  requesterAddr: string,
) {
  let message = "Hello World";

  // TODO 
  // Sign the string message
  let flatSig = signer.signMessage(message).then((result: string) => {
    return result
    });

  // // For Solidity, we need the expanded-format of a signature
  // let sig = ethers.utils.splitSignature(flatSig);

  // // Call the verifyString function
  // let recovered = await contract.verifyString(message, sig.v, sig.r, sig.s);
  const templateRef = doc(firestore, 'template-graph', promptId[0].toString())
  getDoc(templateRef).then(snapshot => {
    console.log(snapshot.data());
    if (snapshot.data() !== undefined) {
      updateDoc(templateRef, {
        connections: arrayUnion({
          replierName,
          endorserAddr: replierAddr,
          requester: requester,
          requesterAddr: requesterAddr
        })
      });
    }
    else {
      setDoc(templateRef, {
        connections: arrayUnion({
          replierName,
          endorserAddr: replierAddr,
          requester: requester,
          requesterAddr: requesterAddr
        })
      });
    }
  });
}
// myContract_write._replyPrompt(
//   promptId,
//   replierAddr,
//   replierName,
//   replyDetail,
//   comment,
//   signature,
// )

function burnReplies(promptId: [number, number], replier: string) {
  myContract_write._burnReplies(promptId, replier)
}

function burnPrompt(promptId: [number, number]) {
  myContract_write._burnPrompt(promptId)
}
