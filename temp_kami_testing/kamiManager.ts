import { ethers } from 'ethers';
import { getKamiInfo as _getKamiInfo } from './echoKamis.js';
import { reviveKami } from './reviveKamis.js';
import { feedKami } from './feedKami.js'
import { moveToRoom } from './moveKamis.js';
import { startHarvesting } from './harvestKamis.js';
import { stopHarvesting } from './stopHarvestKamis.js';
import { collectHarvest } from './collectHarvest.js';
import { liquidateHarvest } from './liquidateHarvest.js';

// import from abi file cleanly soon
const WorldABI = [
    {
        "type": "function",
        "name": "systems",
        "inputs": [],
        "outputs": [
        {
            "name": "",
            "type": "address",
            "internalType": "contract IUint256Component"
        }
        ],
        "stateMutability": "view"
    }
];

const Uint256ComponentABI = [
    {
    "type": "function",
    "name": "getEntitiesWithValue",
    "inputs": [{ "name": "value", "type": "bytes", "internalType": "bytes" }],
    "outputs": [{ "name": "", "type": "uint256[]", "internalType": "uint256[]" }],
    "stateMutability": "view"
    }
];

interface KamiStats {
    health: {
        base: number;
        boost: number;
        sync: number;
    };
    power: {
        base: number;
        boost: number;
        sync: number;
    };
    harmony: {
        base: number;
        boost: number;
        sync: number;
    };
    violence: {
        base: number;
        boost: number;
        sync: number;
    };
}

interface KamiTraits {
    face: number;
    hand: number;
    body: number;
    background: number;
    color: number;
}

interface KamiInfo {
    id: string;
    index: number;
    name: string;
    mediaURI: string;
    stats: KamiStats;
    traits: KamiTraits;
    affinities: string[];
    account: string;
    level: string;
    xp: string;
    room: number;
    state: string;
}

export class KamiManager {
    private provider: ethers.providers.JsonRpcProvider;
    private signer: ethers.Wallet;
    private worldAddr: string;
    private systemAddresses: { [key: string]: string } = {};

    private readonly SYSTEM_IDS = {
        GETTER: "system.getter",
        MOVE: "system.account.move",
        USE_ITEM: "system.kami.use.item",
        HARVEST_START: "system.harvest.start",
        HARVEST_STOP: "system.harvest.stop",
        HARVEST_COLLECT: "system.harvest.collect",
        HARVEST_LIQUIDATE: "system.harvest.liquidate",
    };

    constructor(
        providerUrl: string = "https://json-rpc.preyominet.initia.tech/",
        privateKey: string = "0xc9a0ba2fa2d828cf6af5898791bbfb8b5fcb6cdb7f9ba07d6fd1256e2fc734cb",
        worldAddr: string = "0x89090F774BeC95420f6359003149f51fec207133"
    ) {
        this.provider = new ethers.providers.JsonRpcProvider(providerUrl);
        this.signer = new ethers.Wallet(privateKey, this.provider);
        this.worldAddr = worldAddr;
    }

    async getAddrByID(registryAddr: string, id: string): Promise<string> {
        const registry = new ethers.Contract(registryAddr, Uint256ComponentABI, this.signer);
        try {
            const values = await registry.getEntitiesWithValue(ethers.utils.arrayify(id));
            return values.length > 0
                ? ethers.utils.getAddress(values[0].toHexString())
                : ethers.constants.AddressZero;
        } catch (error) {
            console.error("Error fetching values:", error);
            return ethers.constants.AddressZero;
        }
    };

    async getSystemAddress(systemId: string): Promise<string> {
        if (!this.systemAddresses[systemId]) {
            const world = new ethers.Contract(this.worldAddr, WorldABI, this.signer);
            const systemRegistryAddr = await world.systems();
            const id = ethers.utils.solidityKeccak256(["string"], [systemId]);
            this.systemAddresses[systemId] = await this.getAddrByID(systemRegistryAddr, id);
        }
        return this.systemAddresses[systemId];
    }

    async getKamiInfo(kamiIndex: number): Promise<KamiInfo> {
        const getterAddr = await this.getSystemAddress(this.SYSTEM_IDS.GETTER);
        return await _getKamiInfo(kamiIndex, this.signer, getterAddr) as KamiInfo;
    }

    async moveToRoom(roomIndex: number): Promise<ethers.ContractReceipt> {
        const moveAddr = await this.getSystemAddress(this.SYSTEM_IDS.MOVE);
        return await moveToRoom(roomIndex, this.signer, moveAddr);
    }

    async reviveKami(kamiIndex: number): Promise<ethers.ContractReceipt> {
        const useItemAddr = await this.getSystemAddress(this.SYSTEM_IDS.USE_ITEM);
        const kamiInfo = await this.getKamiInfo(kamiIndex);
        return await reviveKami(kamiInfo.id, this.signer, useItemAddr);
    }

    async feedKami(kamiIndex: number, foodIndex: number): Promise<ethers.ContractReceipt> {
        const useItemAddr = await this.getSystemAddress(this.SYSTEM_IDS.USE_ITEM);
        const kamiInfo = await this.getKamiInfo(kamiIndex);
        return await feedKami(kamiInfo.id, foodIndex, this.signer, useItemAddr);
    }

    async getCurrentRoom(kamiIndex: number): Promise<number> {
        const kamiInfo = await this.getKamiInfo(kamiIndex);
        // get the room from the kamiInfo (hack until we can read more data
        return kamiInfo.room;
    }

    async startHarvesting(kamiID: string, nodeID: string): Promise<ethers.ContractReceipt> {
        const harvestAddr = await this.getSystemAddress(this.SYSTEM_IDS.HARVEST_START);
        return await startHarvesting(kamiID, nodeID, this.signer, harvestAddr);
    }

    async stopHarvesting(kamiID: string): Promise<ethers.ContractReceipt> {
        const harvestAddr = await this.getSystemAddress(this.SYSTEM_IDS.HARVEST_STOP);
        return await stopHarvesting(kamiID, this.signer, harvestAddr);
    }

    async collectHarvest(harvestID: string): Promise<ethers.ContractReceipt> {
        const collectAddr = await this.getSystemAddress(this.SYSTEM_IDS.HARVEST_COLLECT);
        return await collectHarvest(harvestID, this.signer, collectAddr);
    }

    async liquidateHarvest(harvestID: string, kamiID: string): Promise<ethers.ContractReceipt> {
        const liquidateAddr = await this.getSystemAddress(this.SYSTEM_IDS.HARVEST_LIQUIDATE);
        return await liquidateHarvest(harvestID, kamiID, this.signer, liquidateAddr);
    }

    // private parseTransactionReceipt(receipt: ethers.ContractReceipt): any {
    //     return {
    //         status: receipt.status === 1 ? 'Success' : 'Failed',
    //         blockNumber: receipt.blockNumber,
    //         gasUsed: receipt.gasUsed.toString(),
    //     };
    // }
}
