import { KamiManager } from '../kamiManager.js';

async function testRunner() {
    console.log('Starting KamiManager tests...\n');
    
    const manager = new KamiManager();
    
    // Test 1: Get Kami Info ✅
    // ========================
    // try {
    //     console.log('Test 1: Getting Kami Info for index 6717...');
    //     const kamiInfo = await manager.getKamiInfo(6717);
    //     console.log('✅ Successfully got Kami info:');
    //     console.log(JSON.stringify(kamiInfo, null, 2));
    // } catch (error) {
    //     console.error('❌ Failed to get Kami info:', error);
    // }

    // Test 2: Room Movement ✅
    // ========================
    // try {
    //     console.log('\nTest 2: Testing room movement...');
    //     const currentRoom = await manager.getCurrentRoom(6717);
    //     console.log(`Current room: ${currentRoom}`);

    //     // Move to room ???
    //     const targetRoom = 30;
    //     console.log(`Moving to room ${targetRoom}...`);

    //     const receipt = await manager.moveToRoom(targetRoom);
    //     console.log('✅ Successfully moved rooms:');
    //     console.log('Transaction hash:', receipt.transactionHash);

    //     const newRoom = await manager.getCurrentRoom(6717);
    //     console.log(`New room: ${newRoom}`);
    // } catch (error) {
    //     console.error('❌ Failed to move rooms:', error);
    // }

    // Test 3: Try to revive a Kami ✅
    // ===============================
    // try {
    //     console.log('\nTest 3: Attempting to revive Kami 6717...');
    //     const kamiInfo = await manager.getKamiInfo(6717);

    //     if (kamiInfo.state === "DEAD") {
    //         const receipt = await manager.reviveKami(6717);
    //         console.log('✅ Successfully revived Kami:');
    //         console.log('Transaction hash:', receipt.transactionHash);
    //     } else {
    //         console.log(`ℹ️ Kami is not dead (current state: ${kamiInfo.state})`);
    //     }
    // } catch (error) {
    //     console.error('❌ Failed to revive Kami:', error);
    // }

    // Test 4: Start Harvesting
    // =======================
    try {
        console.log('\nTest 4: Starting harvesting for Kami 6717...');
        const kamiInfo = await manager.getKamiInfo(6717);
        
        if (kamiInfo.state !== "HARVESTING" && kamiInfo.state !== "DEAD") {
            const nodeID = 30; // scrapyard entrance
            const receipt = await manager.startHarvesting(6717, nodeID);
            console.log('✅ Successfully started harvesting:');
            console.log('Transaction hash:', receipt.transactionHash);
        } else {
            console.log(`ℹ️ Kami cannot harvest (current state: ${kamiInfo.state})`);
        }
    } catch (error) {
        console.error('❌ Failed to start harvesting:', error);
    }
}

// Run tests
testRunner().catch(console.error); 