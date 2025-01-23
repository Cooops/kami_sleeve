import { ethers } from 'ethers';

const HarvestLiquidateSystemABI = [
    {
        "type": "function",
        "name": "executeTyped",
        "inputs": [
            {
                "name": "harvestID",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "kamiID",
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

export const liquidateHarvest = async (
    harvestID: string,
    kamiID: string,
    signer: ethers.Signer,
    liquidateAddr: string
): Promise<ethers.ContractReceipt> => {
    const liquidateContract = new ethers.Contract(liquidateAddr, HarvestLiquidateSystemABI, signer);
    
    // Add 0x prefix if not present
    const formattedHarvestID = harvestID.startsWith('0x') ? harvestID : `0x${harvestID}`;
    const formattedKamiID = kamiID.startsWith('0x') ? kamiID : `0x${kamiID}`;
    
    const tx = await liquidateContract.executeTyped(formattedHarvestID, formattedKamiID);
    console.log('liquidate tx hash', tx.hash);
    return await tx.wait();
}; 