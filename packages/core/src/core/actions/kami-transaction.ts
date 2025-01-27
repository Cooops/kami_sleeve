import type { ActionHandler } from "../../types";
import { executeContractCall } from '../providers';
import { ethers } from 'ethers';

// Pre-defined ABIs for Kami actions
const KAMI_ABIS = {
  FEED: [
    {
      "type": "function",
      "name": "executeTyped",
      "inputs": [
        { "name": "kamiID", "type": "uint256" },
        { "name": "itemIndex", "type": "uint32" }
      ],
      "outputs": [{ "name": "", "type": "bytes" }],
      "stateMutability": "nonpayable"
    }
  ],
  HARVEST: [
    {
      "type": "function",
      "name": "executeTyped",
      "inputs": [
        { "name": "kamiID", "type": "uint256" },
        { "name": "nodeID", "type": "uint256" }
      ],
      "outputs": [{ "name": "", "type": "bytes" }],
      "stateMutability": "nonpayable"
    }
  ]
} as const;

export const kamiTransactionAction: ActionHandler = async (action, _chain) => {
  console.log('\n🎬 Executing Kami action:', {
    type: action.type,
    action: action.payload.action,
    args: action.payload.args
  });

  try {
    const result = await executeContractCall(
      action.payload.contractAddress,
      KAMI_ABIS[action.payload.action as keyof typeof KAMI_ABIS],
      'executeTyped',
      action.payload.args,
      false
    );

    const receipt = await result.wait();
    console.log('✅ Transaction confirmed:', receipt.transactionHash);
    return `Kami transaction executed successfully: ${JSON.stringify({
      hash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
      action: action.payload.action
    })}`;
    
  } catch (error) {
    console.error('❌ Kami action failed:', {
      type: action.type,
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
}; 