import { ethers } from 'ethers';
import { executeContractCall } from './providers';

export class IOHandler {
    private provider: ethers.providers.JsonRpcProvider;

    constructor() {
        const rpcUrl = process.env.ETHEREUM_RPC_URL;
        if (!rpcUrl) {
            throw new Error("ETHEREUM_RPC_URL is not defined in the environment variables.");
        }
        this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    }

    async readData(contractAddress: string, abi: any, method: string, args: any[]): Promise<any> {
        return await executeContractCall(contractAddress, abi, method, args, this.provider, true);
    }

    async writeData(contractAddress: string, abi: any, method: string, args: any[], signer: ethers.Signer): Promise<any> {
        return await executeContractCall(contractAddress, abi, method, args, signer, false);
    }
}