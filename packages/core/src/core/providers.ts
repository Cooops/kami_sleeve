import { Account, type Call, CallData, RpcProvider } from "starknet";
import { env } from "./env";
import { ethers } from "ethers";

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: string[];
  }>;
}

async function queryGraphQL<T>(
  endpoint: string,
  query: string,
  variables?: Record<string, unknown>
): Promise<T | Error> {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const result = (await response.json()) as GraphQLResponse<T>;

    if (result.errors) {
      return new Error(result.errors[0].message);
    }

    if (!result.data) {
      return new Error("No data returned from GraphQL query");
    }

    return result.data;
  } catch (error) {
    return error instanceof Error ? error : new Error("Unknown error occurred");
  }
}

export const fetchData = async (
  query: string,
  variables: Record<string, unknown>
) => {
  return await queryGraphQL<string>(env.GRAPHQL_URL + "/graphql", query, {
    variables,
  });
};

export const getStarknetProvider = () => {
  return new RpcProvider({
    nodeUrl: env.STARKNET_RPC_URL,
  });
};

export const getStarknetAccount = () => {
  return new Account(
    getStarknetProvider(),
    env.STARKNET_ADDRESS,
    env.STARKNET_PRIVATE_KEY
  );
};

export const executeStarknetRead = async (call: Call): Promise<any> => {
  try {
    call.calldata = CallData.compile(call.calldata || []);
    return await getStarknetProvider().callContract(call);
  } catch (error) {
    return error instanceof Error ? error : new Error("Unknown error occurred");
  }
};

export const executeStarknetTransaction = async (call: Call): Promise<any> => {
  try {
    call.calldata = CallData.compile(call.calldata || []);

    const { transaction_hash } = await getStarknetAccount().execute(call);

    return await getStarknetAccount().waitForTransaction(transaction_hash, {
      retryInterval: 1000,
    });
  } catch (error) {
    return error instanceof Error ? error : new Error("Unknown error occurred");
  }
};

export const getYominetProvider = () => {
  return new ethers.providers.JsonRpcProvider(env.YOMINET_RPC_URL);
};

export const getYominetSigner = () => {
  const provider = getYominetProvider();
  if (!env.KAMIGOTCHI_PRIVATE_KEY) {
    throw new Error('No private key configured in environment');
  }
  return new ethers.Wallet(env.KAMIGOTCHI_PRIVATE_KEY, provider);
};

export async function executeContractCall(
  contractAddress: string,
  abi: ethers.ContractInterface,
  method: string,
  args: any[],
  isView: boolean = false
): Promise<any> {
  console.log('\n📞 Executing contract call:', {
    contractAddress,
    method,
    args,
    isView
  });

  try {
    const signerOrProvider = isView ? getYominetProvider() : getYominetSigner();
    const contract = new ethers.Contract(contractAddress, abi, signerOrProvider);
    
    if (isView) {
      console.log('🔍 Executing view call...');
      const result = await contract.callStatic[method](...args);
      console.log('✅ View call successful:', result);
      return result;
    } else {
      console.log('📝 Executing write transaction...');
      const tx = await contract[method](...args);
      console.log('⏳ Transaction submitted:', tx.hash);
      const receipt = await tx.wait();
      console.log('✅ Transaction confirmed:', receipt);
      return receipt;
    }
  } catch (error) {
    console.error('❌ Contract call failed:', {
      error,
      contractAddress,
      method,
      args
    });
    throw error;
  }
} 