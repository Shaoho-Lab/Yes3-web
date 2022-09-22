import { NFTStorage, File } from 'nft.storage'
const client = new NFTStorage({
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEI5QTUwQjZGN0Y0YTkwODExNDQzNDU1ZTBGODQ1OTk0QTc4OTQ4MjciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MzgxMzI2MjY4OCwibmFtZSI6IlllczMifQ.CFX9BRbLs1ohAslhXC3T-4CWyPZexG1CLWjicH7akRU',
})

async function main() {
  const metadata = await client.store({
    name: 'Yes3',
    description:
      'Mint your social interactions on-chain! Powered by Lyon with <3',
    image: new File([test.png], 'test.png', { type: 'image/png' }),
  })
  console.log(metadata.url)
}

main()
