import { ethers } from 'ethers';

const HarvestSystemABI = [
    {
        "type": "function",
        "name": "executeTyped",
        "inputs": [
            {
                "name": "kamiID",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "nodeID",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bytes",
                "internalType": "bytes"
            }
        ],
        "stateMutability": "nonpayable"
    }
];

export const startHarvesting = async (
    kamiID: string,
    nodeID: number,
    signer: ethers.Signer,
    harvestAddr: string
): Promise<ethers.ContractReceipt> => {
    const harvestContract = new ethers.Contract(harvestAddr, HarvestSystemABI, signer);
    const tx = await harvestContract.executeTyped(kamiID, nodeID);
    return await tx.wait();
}; 