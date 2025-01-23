import { ethers } from 'ethers';

const HarvestStopSystemABI = [
    {
        "type": "function",
        "name": "executeTyped",
        "inputs": [
            {
                "name": "harvestID",
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

export const stopHarvesting = async (
    kamiID: string,
    signer: ethers.Signer,
    harvestAddr: string
): Promise<ethers.ContractReceipt> => {
    const harvestContract = new ethers.Contract(harvestAddr, HarvestStopSystemABI, signer);
    
    // Convert hex string to BigNumber
    const kamiBN = ethers.BigNumber.from(kamiID);
    
    const tx = await harvestContract.executeTyped(kamiBN);
    console.log('tx hash', tx.hash);
    return await tx.wait();
}; 