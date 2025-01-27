// Define valid method names
export type KamiMethod = "systems" | "getKamiByIndex" | "getEntitiesWithValue";

// Core ABIs for Kami contract interactions
export const KAMI_ABIS: Record<KamiMethod, any[]> = {
  // World contract ABI
  systems: [{
    type: "function",
    name: "systems",
    inputs: [],
    outputs: [{
      name: "",
      type: "address",
      internalType: "contract IUint256Component"
    }],
    stateMutability: "view"
  }],

  // Getter system ABI
  getKamiByIndex: [{
    type: "function",
    name: "getKamiByIndex",
    inputs: [{ 
      name: "index", 
      type: "uint32" 
    }],
    outputs: [{
      components: [
        { name: "id", type: "uint256" },
        { name: "index", type: "uint32" },
        { name: "name", type: "string" },
        { name: "mediaURI", type: "string" },
        {
          name: "stats",
          components: [
            { name: "health", type: "tuple", components: [
              { name: "base", type: "int32" },
              { name: "shift", type: "int32" },
              { name: "boost", type: "int32" },
              { name: "sync", type: "int32" }
            ]},
            { name: "power", type: "tuple", components: [
              { name: "base", type: "int32" },
              { name: "shift", type: "int32" },
              { name: "boost", type: "int32" },
              { name: "sync", type: "int32" }
            ]},
            { name: "harmony", type: "tuple", components: [
              { name: "base", type: "int32" },
              { name: "shift", type: "int32" },
              { name: "boost", type: "int32" },
              { name: "sync", type: "int32" }
            ]},
            { name: "violence", type: "tuple", components: [
              { name: "base", type: "int32" },
              { name: "shift", type: "int32" },
              { name: "boost", type: "int32" },
              { name: "sync", type: "int32" }
            ]}
          ],
          type: "tuple"
        },
        {
          name: "traits",
          components: [
            { name: "face", type: "uint32" },
            { name: "hand", type: "uint32" },
            { name: "body", type: "uint32" },
            { name: "background", type: "uint32" },
            { name: "color", type: "uint32" }
          ],
          type: "tuple"
        },
        { name: "affinities", type: "string[]" },
        { name: "account", type: "uint256" },
        { name: "level", type: "uint256" },
        { name: "xp", type: "uint256" },
        { name: "room", type: "uint32" },
        { name: "state", type: "string" }
      ],
      name: "",
      type: "tuple"
    }],
    stateMutability: "view"
  }],

  // Add registry contract ABI
  getEntitiesWithValue: [{
    type: "function",
    name: "getEntitiesWithValue",
    inputs: [{ 
      name: "value", 
      type: "bytes", 
      internalType: "bytes" 
    }],
    outputs: [{ 
      name: "", 
      type: "uint256[]", 
      internalType: "uint256[]" 
    }],
    stateMutability: "view"
  }]
};

// Type-safe helper to get ABI
export const getABI = (method: KamiMethod) => {
  return KAMI_ABIS[method];
}; 