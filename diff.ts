
import { getRPCUrl, ChainId } from "@bgd-labs/rpc-env";
import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { Client, createClient, getAddress, Hex, http } from "viem";
import { getStorageAt } from "viem/actions";
import {GovernanceV3Arbitrum, GovernanceV3Avalanche, GovernanceV3Base, GovernanceV3BNB, GovernanceV3Ethereum, GovernanceV3Gnosis, GovernanceV3Linea, GovernanceV3Metis, GovernanceV3Optimism, GovernanceV3Polygon, GovernanceV3Scroll, GovernanceV3ZkSync} from '@bgd-labs/aave-address-book'

const CHAIN_ID_API_KEY_MAP = {
  [ChainId.mainnet]: process.env.ETHERSCAN_API_KEY_MAINNET,
  [ChainId.sepolia]: process.env.ETHERSCAN_API_KEY_MAINNET,
  [ChainId.polygon]: process.env.ETHERSCAN_API_KEY_POLYGON,
  [ChainId.zkEVM]: process.env.ETHERSCAN_API_KEY_ZKEVM,
  [ChainId.arbitrum]: process.env.ETHERSCAN_API_KEY_ARBITRUM,
  [ChainId.optimism]: process.env.ETHERSCAN_API_KEY_OPTIMISM,
  [ChainId.scroll]: process.env.ETHERSCAN_API_KEY_SCROLL,
  [ChainId.scroll_sepolia]: process.env.ETHERSCAN_API_KEY_SCROLL,
  [ChainId.bnb]: process.env.ETHERSCAN_API_KEY_BNB,
  [ChainId.base]: process.env.ETHERSCAN_API_KEY_BASE,
  [ChainId.base_sepolia]: process.env.ETHERSCAN_API_KEY_BASE,
  [ChainId.zksync]: process.env.ETHERSCAN_API_KEY_ZK_SYNC,
  [ChainId.gnosis]: process.env.ETHERSCAN_API_KEY_GNOSIS,
  [ChainId.linea]: process.env.ETHERSCAN_API_KEY_LINEA,
};

const bytes32toAddress = (bytes32: Hex) => {
  return getAddress(`0x${bytes32.slice(26)}`);
};

const getImplementationStorageSlot = async (client: Client, address: Hex) => {
  return (await getStorageAt(client, {
    address,
    slot: "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc",
  })) as Hex;
};

async function snapshotCCC({ CHAIN_ID, CROSS_CHAIN_CONTROLLER }) {
  const client = createClient({ transport: http(getRPCUrl(CHAIN_ID)) });
  const impl = bytes32toAddress(
    await getImplementationStorageSlot(client, CROSS_CHAIN_CONTROLLER),
  );

  const destination = `flattened/${CHAIN_ID}/${impl}.sol`;
  if (!existsSync(destination)) {
    const sourceCommand = `cast etherscan-source --flatten --chain ${CHAIN_ID} -d ${destination} ${impl} --etherscan-api-key ${CHAIN_ID_API_KEY_MAP[CHAIN_ID]}`;
    execSync(sourceCommand);
  }
  const codeDiff = `make git-diff before=${destination} after=flattened/CrossChainController.sol out=${CHAIN_ID}.patch`;
  execSync(codeDiff);

  const command = `mkdir -p reports/${CHAIN_ID} && forge inspect ${destination}:CrossChainController storage > reports/${CHAIN_ID}/storage_${CROSS_CHAIN_CONTROLLER}`;
  execSync(command);
}

async function diffReference() {
  execSync(
    `forge flatten src/contracts/CrossChainController.sol -o flattened/CrossChainController.sol && forge fmt flattened/CrossChainController.sol`,
  );
  execSync(
    `forge inspect flattened/CrossChainController.sol:CrossChainController storage > reports/storage_new`,
  );
}

(async function main() {
  diffReference();
  // await snapshotCCC(GovernanceV3Ethereum);
  await snapshotCCC(GovernanceV3ZkSync);
  // await snapshotCCC(GovernanceV3Polygon);
  // await snapshotCCC(GovernanceV3Avalanche);
  // await snapshotCCC(GovernanceV3Arbitrum);
  // await snapshotCCC(GovernanceV3Optimism);
  // await snapshotCCC(GovernanceV3Base);
  // await snapshotCCC(GovernanceV3Gnosis);
  // await snapshotCCC(GovernanceV3Metis);
  // await snapshotCCC(GovernanceV3BNB);
  // await snapshotCCC(GovernanceV3Scroll);
  // await snapshotCCC(GovernanceV3Linea);
})();