const ethers = require('ethers')

// for provider
const provider = new ethers.providers.JsonRpcProvider(
  'https://rpc-mumbai.maticvigil.com/v1/59e3a028aa7f390b9b604fae35aab48985ebb2f0',
)

// for signer
var privateKey =
  '9d8e2393a57d5055799585f7d21af5bbe13a970d3a35b1be7b6bc8714fc866d4'
var signer = new ethers.Wallet(privateKey, provider)

var address = '0xd66dC2FfE2521f54236d16Dd7E8e168eBb42C76B'
var abi = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'templateId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'question',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'context',
        type: 'string',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: '_mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'ApprovalCallerNotOwnerNorApproved',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ApprovalQueryForNonexistentToken',
    type: 'error',
  },
  {
    inputs: [],
    name: 'BalanceQueryForZeroAddress',
    type: 'error',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'templateId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
        ],
        internalType: 'struct ILyonPrompt.Prompt',
        name: 'promptId',
        type: 'tuple',
      },
    ],
    name: 'burnPrompt',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'templateId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
        ],
        internalType: 'struct ILyonPrompt.Prompt',
        name: 'promptId',
        type: 'tuple',
      },
      {
        internalType: 'address',
        name: 'replier',
        type: 'address',
      },
    ],
    name: 'burnReplies',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MintERC2309QuantityExceedsLimit',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MintToZeroAddress',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MintZeroQuantity',
    type: 'error',
  },
  {
    inputs: [],
    name: 'OwnerQueryForNonexistentToken',
    type: 'error',
  },
  {
    inputs: [],
    name: 'OwnershipNotInitializedForExtraData',
    type: 'error',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'templateId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
        ],
        internalType: 'struct ILyonPrompt.Prompt',
        name: 'promptId',
        type: 'tuple',
      },
      {
        internalType: 'address',
        name: 'replierAddr',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'replierName',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'replyDetail',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'comment',
        type: 'string',
      },
      {
        internalType: 'bytes32',
        name: 'signature',
        type: 'bytes32',
      },
    ],
    name: 'replyPrompt',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'URIQueryForNonexistentToken',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'approved',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'templateId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'PromptMinted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'templateId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'promptOwner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'question',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'replierName',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'replyDetail',
        type: 'string',
      },
    ],
    name: 'RepliedToPrompt',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: 'balance',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'templateId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
        ],
        internalType: 'struct ILyonPrompt.Prompt',
        name: 'promptId',
        type: 'tuple',
      },
    ],
    name: 'ownerOf',
    outputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'queryAllPromptByAddr',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'templateId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
        ],
        internalType: 'struct ILyonPrompt.Prompt[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'queryAllRepliesByAddr',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'templateId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
        ],
        internalType: 'struct ILyonPrompt.Prompt[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'templateId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
        ],
        internalType: 'struct ILyonPrompt.Prompt',
        name: 'promptId',
        type: 'tuple',
      },
    ],
    name: 'queryAllRepliesByPrompt',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'replierName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'replyDetail',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'comment',
            type: 'string',
          },
          {
            internalType: 'bytes32',
            name: 'signature',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'createTime',
            type: 'uint256',
          },
        ],
        internalType: 'struct ILyonPrompt.ReplyInfo[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'templateId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
        ],
        internalType: 'struct ILyonPrompt.Prompt',
        name: 'promptId',
        type: 'tuple',
      },
    ],
    name: 'tokenURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'templateId',
        type: 'uint256',
      },
    ],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

myContract_write = new ethers.Contract(address, abi, signer) // Write only
myContract_read = new ethers.Contract(address, abi, provider) // Read only

myContract_write
  ._mint(
    2,
    'Can I drink a lot?',
    'https://mumbai.polygonscan.com/address/0xd66dC2FfE2521f54236d16Dd7E8e168eBb42C76B#writeContract',
    '0x3dfca99946026acbb3b9cae7ba3f442148ba4398',
  )
  .then(result => {
    console.log(result)
  })

myContract_read
  .queryAllPromptByAddr('0x3dfca99946026acbb3b9cae7ba3f442148ba4398')
  .then(result => {
    console.log(result)
  })
