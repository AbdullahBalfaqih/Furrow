# Furrow Chain - 0G Chain & 0G Storage Hackathon Integration Manifest

## 1. Network Configuration
- **Network Name**: 0G Chain (Galileo Testnet) / 0G Mainnet Ready
- **Chain ID**: `16602` (Mainnet: `16661`)
- **RPC URL**: `https://evmrpc-testnet.0g.ai` (Mainnet: `https://evmrpc.0g.ai`)
- **Native Currency**: `0G`
- **Block Explorer**: [https://chainscan-galileo.0g.ai](https://chainscan-galileo.0g.ai)

---

## 2. Deployed Smart Contracts

| Contract Name | Deployed Address | 0G Explorer Link |
| :--- | :--- | :--- |
| **`FurrowAccessControl`** | `0x7186Bef44014186F28da770F387F2D7D55835682` | [View Contract](https://chainscan-galileo.0g.ai/address/0x7186Bef44014186F28da770F387F2D7D55835682) |
| **`CropRegistry`** | `0x64Dc9caF5Cb9EAc069Ae8f5aaC6e980E3FD7917b` | [View Contract](https://chainscan-galileo.0g.ai/address/0x64Dc9caF5Cb9EAc069Ae8f5aaC6e980E3FD7917b) |
| **`CropAssessment`** | `0x248d4E9fbC4Ea0b184A090da8a627027D5bF6a85` | [View Contract](https://chainscan-galileo.0g.ai/address/0x248d4E9fbC4Ea0b184A090da8a627027D5bF6a85) |
| **`FurrowMarketplace`** | `0xb94Dc90f3f11d89b8D174B4b676B88255CE6e8B2` | [View Contract](https://chainscan-galileo.0g.ai/address/0xb94Dc90f3f11d89b8D174B4b676B88255CE6e8B2) |

---

## 3. Verified On-Chain Activity (0G Explorer Proofs)

| Action | Block # | Transaction Hash | 0G Explorer Link |
| :--- | :---: | :--- | :--- |
| **Crop Registration (`registerCrop`)** | `50107276` | `0xa7f0b5623c51eeaaae5881811562a28128bcba772b877fd96723ccde0ff0279c` | [View Transaction](https://chainscan-galileo.0g.ai/tx/0xa7f0b5623c51eeaaae5881811562a28128bcba772b877fd96723ccde0ff0279c) |
| **AI Assessment (`submitAssessment`)** | `50107294` | `0x9e5a8701646a34c6e9e59f6594fb4f608860fc082ef1d2139a56eb93091d1bac` | [View Transaction](https://chainscan-galileo.0g.ai/tx/0x9e5a8701646a34c6e9e59f6594fb4f608860fc082ef1d2139a56eb93091d1bac) |
| **Marketplace Listing (`createListing`)** | `50107311` | `0xd48803c4a76e1e82cf9def3123e5a4251eefc67385d8b137d8695e9146456be4` | [View Transaction](https://chainscan-galileo.0g.ai/tx/0xd48803c4a76e1e82cf9def3123e5a4251eefc67385d8b137d8695e9146456be4) |

---

## 4. 0G Storage & Hybrid Provenance Architecture

```
Farmer Uploads Image & Metadata
             │
             ▼
     0G Storage Network
             │
   ┌─────────┴─────────┐
   ▼                   ▼
0G Storage CID     metadataHash
   │                   │
   └─────────┬─────────┘
             ▼
   0G Chain Smart Contract (CropRegistry.sol)
```

- **0G Storage**: Stores raw agricultural images and vision evaluation JSON files.
- **0G Chain**: Stores compact, immutable cryptographic references (`storageCID` and `metadataHash`) onchain.
