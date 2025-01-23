import { KamiManager } from "../kamiManager.js";

// We can already implement this strategy:
export async function simpleHarvestStrategy(
    manager: KamiManager,
    kamiIndex: number,
    kamiHarvestID: string,
    kamiSecondHarvestID: string,
    nodeID: string,
    harvestDuration: number, // in milliseconds
    options = {
        collectInterval: 0, // 0 means don't collect, just stop
        maxCycles: 3, // number of harvest cycles before stopping
        cooldownWait: 60000 // 1 minute cooldown wait
    }
) {
    let cycles = 0;
    
    while (cycles < options.maxCycles) {
        try {
            // Get kami info to check state
            const kamiInfo = await manager.getKamiInfo(kamiIndex);
            
            // Start harvesting if RESTING
            if (kamiInfo.state === "RESTING") {
                console.log(`Starting harvest cycle ${cycles + 1}/${options.maxCycles}`);
                await manager.startHarvesting(kamiHarvestID, nodeID);
                
                if (options.collectInterval > 0) {
                    // Collect periodically during harvest
                    const collectTimes = Math.floor(harvestDuration / options.collectInterval);
                    for (let i = 0; i < collectTimes; i++) {
                        await new Promise(r => setTimeout(r, options.collectInterval));
                        try {
                            await manager.collectHarvest(kamiSecondHarvestID);
                        } catch (error) {
                            console.log('Collection failed, continuing...');
                        }
                    }
                    
                    // Wait remaining time
                    const remainingTime = harvestDuration % options.collectInterval;
                    if (remainingTime > 0) {
                        await new Promise(r => setTimeout(r, remainingTime));
                    }
                } else {
                    // Just wait full duration
                    await new Promise(r => setTimeout(r, harvestDuration));
                }
                
                // Try to stop harvesting, handle cooldown
                try {
                    await manager.stopHarvesting(kamiSecondHarvestID);
                } catch (error) {
                    if (error instanceof Error && error.message.includes('cooldown')) {
                        console.log('Kami on cooldown, waiting...');
                        await new Promise(r => setTimeout(r, options.cooldownWait));
                        // Try one more time after cooldown
                        await manager.stopHarvesting(kamiSecondHarvestID);
                    } else {
                        throw error; // Re-throw if it's not a cooldown error
                    }
                }
                
                cycles++;
                
                // Wait between cycles
                await new Promise(r => setTimeout(r, 5000));
            } else {
                console.log(`Kami not in RESTING state (${kamiInfo.state}), waiting...`);
                await new Promise(r => setTimeout(r, 10000));
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Strategy error:', error.message);
            } else {
                console.error('Unknown strategy error');
            }
            // Wait before retrying
            await new Promise(r => setTimeout(r, 10000));
        }
    }
    
    console.log(`Strategy completed ${cycles} cycles`);
}
