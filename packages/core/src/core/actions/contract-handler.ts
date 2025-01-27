import type { ActionHandler } from "../../types";
import { ethers } from 'ethers';
import { executeContractCall } from '../providers';
import { getABI, type KamiMethod } from '../abis/kami-abis';
import { env } from '../env';

interface ContractCall {
  contractAddress: string;
  abi?: ethers.ContractInterface;
  method: KamiMethod;  // Now method must be a valid KamiMethod
  args: any[];
  isView?: boolean;
}

export const contractCallAction: ActionHandler = async (action, _chain) => {
  console.log('\n🎬 Executing contract action:', {
    type: action.type,
    contractAddress: action.payload.contractAddress,
    method: action.payload.method,
    isView: action.payload.isView
  });

  const payload = action.payload as ContractCall;
  
  console.log('Payload:', payload);
  console.log('ABI lookup result:', getABI(payload.method));
  
  // If no ABI provided, try to get from Kami ABIs
  if (!payload.abi) {
    payload.abi = getABI(payload.method);
  }
  
  try {
    // Let executeContractCall handle the provider/signer internally
    const result = await executeContractCall(
      payload.contractAddress,
      payload.abi,
      payload.method,
      payload.args,
      payload.isView || false
    );

    if (!payload.isView && result.wait) {
      const receipt = await result.wait();
      console.log('✅ Transaction confirmed:', receipt.transactionHash);
      return `Transaction executed successfully: ${JSON.stringify({
        hash: receipt.transactionHash,
        blockNumber: receipt.blockNumber
      })}`;
    }
    
    return `Contract call executed successfully: ${JSON.stringify(result)}`;
    
  } catch (error) {
    console.error('❌ Contract action failed:', {
      type: action.type,
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
};