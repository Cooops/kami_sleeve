import type { ActionHandler } from "../../types";
import { ethers } from 'ethers';
import { executeContractCall } from '../providers';

interface GenericContractCall {
  contractAddress: string;
  abi: any[];
  method: string;
  args: any[];
  signer: ethers.Signer;
  isView?: boolean;
}

export const contractCallAction: ActionHandler = async (action, chain) => {
  const payload = action.payload as GenericContractCall;
  
  try {
    const result = await executeContractCall(
      payload.contractAddress,
      payload.abi,
      payload.method,
      payload.args,
      payload.signer,
      payload.isView || false
    );

    console.log("Contract call result:", result);

    if (!payload.isView && result.wait) {
      const receipt = await result.wait();
      return `Transaction executed successfully: ${JSON.stringify({
        hash: receipt.transactionHash,
        receipt
      }, null, 2)}`;
    }
    
    return `Contract call executed successfully: ${JSON.stringify(result, null, 2)}`;
    
  } catch (error) {
    console.error(`Contract call failed for method ${payload.method}:`, error);
    throw error;
  }
};