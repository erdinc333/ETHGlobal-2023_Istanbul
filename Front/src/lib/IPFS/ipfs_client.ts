/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Client from '@web3-storage/w3up-client'
import * as Signer from '@ucanto/principal/ed25519'
import { CarReader } from '@ipld/car'
import { importDAG } from '@ucanto/core/delegation'


const proof_key = import.meta.env.VITE_IPFS_PROOF.replaceAll('\\n', '\n')

export async function buildClient () {
  // Load client with specific private key
  const principal = Signer.parse(import.meta.env.VITE_IPFS_KEY)
  const client = await Client.create({ principal })
  // Add proof that this agent has been delegated capabilities on the space
  console.log("🚀 ~ file: ipfs_client.ts:8 ~ proof_key:", proof_key)

  const proof = await parseProof(proof_key)
  const space = await client.addSpace(proof)
  await client.setCurrentSpace(space.did())
  
  console.log('IPFS READY:')
  return client
  // READY to go!
}
 
/** @param {string} data Base64 encoded CAR file \*/
async function parseProof (data: any) {
  const blocks = []
  const reader = await CarReader.fromBytes(Buffer.from(data, 'base64'))
  for await (const block of reader.blocks()) {
    blocks.push(block)
  }
  return importDAG(blocks as any)
}

export function makeFileObjects (obj: object, filename: string) {
  // You can create File objects from a Blob of binary data
  // see: https://developer.mozilla.org/en-US/docs/Web/API/Blob
  // Here we're just storing a JSON object, but you can store images,
  // audio, or whatever you want!
  const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' })
 
  return new File([blob], filename)
}


export async function uploadFile (client: Client.Client, obj: object): Promise<string> {
  const file = makeFileObjects(obj, 'data.json')

  const cid = (await client.uploadFile(file)).toString()
  return cid
}

export async function uploadTest()
{
  const client = await buildClient()
  const cid = await uploadFile(client, { test_oui: 'jeTestOui' })


  console.log('Uploaded file to', cid)
  return cid
}