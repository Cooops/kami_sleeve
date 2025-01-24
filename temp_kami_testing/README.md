# KamiManager - Kamigotchi Game Interactions

A TypeScript library for interacting with Kamigotchi game contracts.

## Features

### Core Functionality
- Contract interaction management
- System address caching
- Transaction receipt handling

### Kami Actions
- Get Kami info (stats, traits, location)
- Move between rooms
- Feed Kamis
- Revive Kamis

### Resource Management
- Start/stop harvesting
- Collect harvest rewards
- Claim scavenge rewards
- Purchase items

## Usage Example
typescript
```
const manager = new KamiManager();
// Get Kami info
const kamiInfo = await manager.getKamiInfo(kamiIndex);
console.log(Kami ${kamiInfo.name} is in room ${kamiInfo.room});
// Move to a room
await manager.moveToRoom(47); // Move to Scrap Paths
// Start harvesting at a node
const nodeID = "0x48e075902440c00b3be18427203d7d4865a6ef147e1424b144e22e0756107769"; // Scrap Paths node
await manager.startHarvesting(kamiInfo.id, nodeID);
// Purchase items
await manager.purchaseItem(11001, 1); // Buy 1 Red Gakki Ribbon
// Claim scavenge rewards
const scavBarID = "0x3d494f4976c2522c8dbb2d97b7de000c134092e039a4ab24fee1ffc004887f6b";
await manager.claimScavenge(scavBarID);
typescript
try {
await manager.claimScavenge(scavBarID);
} catch (error) {
if (error.message === 'No unclaimed scavenge rolls available') {
console.log('⚠️ No scavenge rolls to claim - node may be out of sync');
}
}
```
## File Structure
- `/actions/` - Individual contract interactions
- `/tests/` - Test suite
- `/raw_data/` - Game data (items, nodes)

## Development
Built with:
- TypeScript
- ethers.js
- Proper ABI typing