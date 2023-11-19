export const fetchFileCID = async (CID: string) => {
    const response = await fetch(`https://${CID}.ipfs.w3s.link`)
    const data = await response.json()
    return data
  }
  