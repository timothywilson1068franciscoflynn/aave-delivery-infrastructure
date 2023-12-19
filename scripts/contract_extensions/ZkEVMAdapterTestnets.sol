// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.8;

import {TestNetChainIds} from './TestNetChainIds.sol';
import {ZkEVMAdapter} from '../../src/contracts/adapters/zkEVM/ZkEVMAdapter.sol';

contract ZkEVMAdapterGoerli is ZkEVMAdapter {
  constructor(
    address crossChainController,
    address zkEVMBridge,
    uint256 providerGasLimit,
    TrustedRemotesConfig[] memory trustedRemotes
  ) ZkEVMAdapter(crossChainController, zkEVMBridge, providerGasLimit, trustedRemotes) {}

  function isDestinationChainIdSupported(uint256 chainId) public pure override returns (bool) {
    return chainId == TestNetChainIds.POLYGON_ZK_EVM_GOERLI;
  }

  function nativeToInfraChainId(uint256 nativeChainId) public pure override returns (uint256) {
    if (nativeChainId == uint32(0)) {
      return TestNetChainIds.ETHEREUM_GOERLI;
    } else if (nativeChainId == uint32(1)) {
      return TestNetChainIds.POLYGON_ZK_EVM_GOERLI;
    }
    return 0;
  }

  function infraToNativeChainId(uint256 infraChainId) public pure override returns (uint256) {
    if (infraChainId == TestNetChainIds.ETHEREUM_GOERLI) {
      return uint32(0);
    } else if (infraChainId == TestNetChainIds.POLYGON_ZK_EVM_GOERLI) {
      return uint32(1);
    }
    return type(uint32).max;
  }
}

contract ZkEVMAdapterZkEVMGoerli is ZkEVMAdapter {
  constructor(
    address crossChainController,
    address zkEVMBridge,
    uint256 providerGasLimit,
    TrustedRemotesConfig[] memory trustedRemotes
  ) ZkEVMAdapter(crossChainController, zkEVMBridge, providerGasLimit, trustedRemotes) {}

  function isDestinationChainIdSupported(uint256 chainId) public pure override returns (bool) {
    return chainId == TestNetChainIds.ETHEREUM_GOERLI;
  }

  function nativeToInfraChainId(uint256 nativeChainId) public pure override returns (uint256) {
    if (nativeChainId == uint32(0)) {
      return TestNetChainIds.ETHEREUM_GOERLI;
    } else if (nativeChainId == uint32(1)) {
      return TestNetChainIds.POLYGON_ZK_EVM_GOERLI;
    }
    return 0;
  }

  function infraToNativeChainId(uint256 infraChainId) public pure override returns (uint256) {
    if (infraChainId == TestNetChainIds.ETHEREUM_GOERLI) {
      return uint32(0);
    } else if (infraChainId == TestNetChainIds.POLYGON_ZK_EVM_GOERLI) {
      return uint32(1);
    }
    return type(uint32).max;
  }
}
