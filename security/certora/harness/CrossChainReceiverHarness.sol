pragma solidity ^0.8.8;

import {CrossChainReceiverHarnessAbstract} from './CrossChainReceiverHarnessAbstract.sol';
import {CrossChainReceiver} from '../../../src/contracts/CrossChainReceiver.sol';

contract CrossChainReceiverHarness is CrossChainReceiverHarnessAbstract {

constructor(
    ConfirmationInput[] memory initialRequiredConfirmations,
    ReceiverBridgeAdapterConfigInput[] memory bridgeAdaptersToAllow
  ) CrossChainReceiver(initialRequiredConfirmations, bridgeAdaptersToAllow) 
  {}


}
