const path = require('node:path');
const fs = require('node:fs');
const { ethers } = require('ethers');

const RPC_URLS = [
  'https://rpc.ankr.com/arbitrum',
  'https://arbitrum.llamarpc.com',
];
const NODE_SALE_CONTRACTS = {
  TIER1: '0x80adA4D9F18996c19df7d07aCfE78f9460BBC151',
  TIER2: '0x82720570AC1847FD161b5A01Fe6440c316e5742c',
  TIER3: '0x3F3C6DE3Bbe1F2fdFb4B43a49e599885B7Fb1a27',
  TIER4: '0xc674BEB2f5Cd94A748589A9Dadd838b9E09AABD4',
  TIER5: '0xF8a8A71d90f1AE2F17Aa4eE9319820B5F394f629',
  TIER6: '0x125711d6f0AAc9DFFEd75AD2B8C51bDaF5FAEd71',
  TIER7: '0x3371b74beC1dE3E115A4148956F94f55bEA8cD00',
  TIER8: '0xa1D3632C9Dc73e8EcEBAe99a8Ea00F50F226A8B9',
  TIER9: '0xD7C3E0C20Ab22f1e9A59e764B1b562E1dD7438B0',
  TIER10: '0xc8c72AE5a74c3c0a0B2c0B0855a6f007a2C9B11A',
  TIER11: '0xC506294beF7cffcF7e45Aa17b299516EEe76F6eE',
  TIER12: '0xf6c0b24254E4423962f1076C5f5134e1312Aafe9',
  TIER13: '0x4020acDB0d62AD337383b53e32f17fC629568a49',
  TIER14: '0x1E4c63886c8F157d0aA29F0F9c1F479b60C6055E',
  TIER15: '0xD767424230a633E790b4AE4a8A7e1E2511F3B197',
  TIER16: '0xD7370b509ffF524E811523669bbA43b107dC40a0',
  TIER17: '0x6B003d209A452EA51AF14E853706f98131f98e8d',
  TIER18: '0x257A8e37fB36192Ae262A37B983d726e049C5606',
  TIER19: '0x242F0aef35d06f3Ee12C70c355c2df9b4FbDeCDF',
  TIER20: '0x7BAC674548C63e7CcbB17864131BDDb99C29b589',
  TIER21: '0x9C6d5699B5AEEB2D5266AA1f2C134647386fc08b',
  TIER22: '0x7D20f7111D93f4Eabd236B88414Bf41f4e26bd61',
  TIER23: '0xEA67230750b5AADb8309C6e6F9A441524b15c7F3',
  TIER24: '0xaA46f9A7b618A1e2c550Aa7f86a0eD1b5005dad3',
  TIER25: '0x1870d4BF19F00011059f09412e0Ae105836B2b51',
  TIER26: '0x607c6Ba612BFF0dd699DccE43cDC364C1FcBe4d5',
  TIER27: '0xb88Bed927a5D94bfC2f12227a446Ba9b6e8c00cD',
  TIER28: '0x4a36379c25400D94C328a9Aa3BC1FfB25fAc073a',
  TIER29: '0x340FBD6ED6401A1bEbdea7b7644EE8bf30330c6D',
  TIER30: '0xEE8395E4269C740931EFD427eb7027DD1114777C',
  TIER31: '0x0a0e6B162440fdD0a2E185512E95Ec1031C258Bc',
  TIER32: '0xDa39e9d12614Eae2F98D2dc1Cb13399d53Eef56c',
  TIER33: '0x52875E4F5EBB92917276eaA8447cd690C1F63DDB',
  TIER34: '0x4EfA5109b4cEEF9511107f64aDBaa5Fee49F7584',
  TIER35: '0xca7188D8f9cE1d47B99127F7bC99eeab1781A5AB',
  TIER36: '0xC5A35c756B3281bC9613b386fbB6603A3789340B',
  TIER37: '0x8A4b87dfA44cC40B9654aB65557583b9793e62A6',
  TIER38: '0x61c9A13e9690Cb8Ee5a351B67267608824A6A549',
  TIER39: '0x60702643d1f15E0Df95C57C266AebC254f647841',
  TIER40: '0xD7A17f51aC326c080428c7b7dF46ba9266827B94',
};
const NODE_SALE_CONTRACT_ABI = JSON.parse('[{"inputs":[{"internalType":"uint256","name":"_salePrice","type":"uint256"},{"internalType":"address","name":"_funder","type":"address"},{"internalType":"contract ERC20","name":"_paymentToken","type":"address"},{"internalType":"contract ERC20","name":"_saleToken","type":"address"},{"internalType":"uint256","name":"_startTime","type":"uint256"},{"internalType":"uint256","name":"_endTime","type":"uint256"},{"internalType":"uint256","name":"_maxTotalPayment","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"paymentTokenBalance","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"saleTokenBalance","type":"uint256"}],"name":"Cash","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"EmergencyTokenRetrieve","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Fund","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"}],"name":"OptInBuyback","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"paymentAmount","type":"uint256"}],"name":"Purchase","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"paymentAmount","type":"uint256"},{"indexed":false,"internalType":"string","name":"code","type":"string"}],"name":"PurchaseWithCode","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"casher","type":"address"}],"name":"SetCasher","type":"event"},{"anonymous":false,"inputs":[{"components":[{"internalType":"uint256","name":"claimTime","type":"uint256"},{"internalType":"uint8","name":"pct","type":"uint8"}],"indexed":true,"internalType":"struct IFVestable.Cliff[]","name":"cliffPeriod","type":"tuple[]"}],"name":"SetCliffVestingPeriod","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"funder","type":"address"}],"name":"SetFunder","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bool","name":"isPurchaseHalted","type":"bool"}],"name":"SetIsPurchaseHalted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"linearVestingEndTime","type":"uint256"}],"name":"SetLinearVestingEndTime","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"_maxTotalPurchasable","type":"uint256"}],"name":"SetMaxTotalPurchasable","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"minTotalPayment","type":"uint256"}],"name":"SetMinTotalPayment","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"whitelistRootHash","type":"bytes32"}],"name":"SetWhitelist","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"whitelistSetter","type":"address"}],"name":"SetWhitelistSetter","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint24","name":"withdrawDelay","type":"uint24"}],"name":"SetWithdrawDelay","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"amountPerCode","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"cash","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"cashPaymentToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"casher","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"bytes32[]","name":"merkleProof","type":"bytes32[]"}],"name":"checkWhitelist","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"bytes32[]","name":"merkleProof","type":"bytes32[]"},{"internalType":"uint256","name":"allocation","type":"uint256"}],"name":"checkWhitelist","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"claimable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"cliffPeriod","outputs":[{"internalType":"uint256","name":"claimTime","type":"uint256"},{"internalType":"uint8","name":"pct","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"codes","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"emergencyTokenRetrieve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"endTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"fund","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"funder","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCliffPeriod","outputs":[{"components":[{"internalType":"uint256","name":"claimTime","type":"uint256"},{"internalType":"uint8","name":"pct","type":"uint8"}],"internalType":"struct IFVestable.Cliff[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getCurrentClaimableToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"allocation","type":"uint256"}],"name":"getMaxPayment","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"totalPurchased","type":"uint256"},{"internalType":"uint256","name":"claimable","type":"uint256"},{"internalType":"address","name":"user","type":"address"}],"name":"getUnlockedToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"hasCashed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"string","name":"","type":"string"}],"name":"hasUsedCode","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"hasWithdrawn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"paymentAmount","type":"uint256"}],"name":"isIntegerPayment","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isIntegerSale","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isPurchaseHalted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isVestedGiveaway","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"latestClaimTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"linearVestingEndTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxPromoCodePerUser","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxTotalPayment","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxTotalPurchasable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"minTotalPayment","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"paymentReceived","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"paymentReceivedWithCode","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"string","name":"","type":"string"}],"name":"paymentReceivedWithEachCode","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"paymentToken","outputs":[{"internalType":"contract ERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"promoCodesPerUser","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"publicAllocation","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"purchase","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"purchaserCount","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"saleAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"salePrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"saleTokenPurchased","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_casher","type":"address"}],"name":"setCasher","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"claimTimes","type":"uint256[]"},{"internalType":"uint8[]","name":"pct","type":"uint8[]"}],"name":"setCliffPeriod","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_funder","type":"address"}],"name":"setFunder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_isIntegerSale","type":"bool"}],"name":"setIsIntegerSale","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_isPurchaseHalted","type":"bool"}],"name":"setIsPurchaseHalted","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_vestingEndTime","type":"uint256"}],"name":"setLinearVestingEndTime","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_maxTotalPurchasable","type":"uint256"}],"name":"setMaxTotalPurchasable","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_minTotalPayment","type":"uint256"}],"name":"setMinTotalPayment","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_publicAllocation","type":"uint256"}],"name":"setPublicAllocation","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_isVestedGiveaway","type":"bool"}],"name":"setVestedGiveaway","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_vestingEditableOverride","type":"bool"}],"name":"setVestingEditable","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_whitelistRootHash","type":"bytes32"}],"name":"setWhitelist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_whitelistSetter","type":"address"}],"name":"setWhitelistSetter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint24","name":"_withdrawDelay","type":"uint24"}],"name":"setWithdrawDelay","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"startTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalPaymentReceived","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalPurchased","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"uniqueUsePerCode","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vestingEditableOverride","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"whitelistRootHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"whitelistSetter","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes32[]","name":"","type":"bytes32[]"}],"name":"whitelistedPurchase","outputs":[],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"paymentAmount","type":"uint256"},{"internalType":"bytes32[]","name":"merkleProof","type":"bytes32[]"},{"internalType":"uint256","name":"_allocation","type":"uint256"}],"name":"whitelistedPurchase","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"paymentAmount","type":"uint256"},{"internalType":"bytes32[]","name":"merkleProof","type":"bytes32[]"},{"internalType":"uint256","name":"_allocation","type":"uint256"},{"internalType":"string","name":"code","type":"string"}],"name":"whitelistedPurchaseWithCode","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawDelay","outputs":[{"internalType":"uint24","name":"","type":"uint24"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32[]","name":"","type":"bytes32[]"}],"name":"withdrawGiveaway","outputs":[],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"bytes32[]","name":"merkleProof","type":"bytes32[]"},{"internalType":"uint256","name":"allocation","type":"uint256"}],"name":"withdrawGiveaway","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32[]","name":"merkleProof","type":"bytes32[]"},{"internalType":"uint256","name":"allocation","type":"uint256"}],"name":"withdrawGiveawayVested","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdrawerCount","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"}]');
const WETH_CONTRACT = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1';
const WETH_CONTRACT_ABI = JSON.parse('[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"bridgeBurn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"bridgeMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"depositTo","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"uint8","name":"_decimals","type":"uint8"},{"internalType":"address","name":"_l2Gateway","type":"address"},{"internalType":"address","name":"_l1Address","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"l1Address","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"l2Gateway","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_value","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"transferAndCall","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]');
const SALE_START_TIME = 1717581600000 - 3000;

start();

function start() {
  const wallets = fs.readFileSync(path.resolve(__dirname, 'wallets.txt'), 'utf8').split(/\r?\n/);
  let walletsIsEmpty = true;

  for (let line of wallets) {
    line = line.trim();

    if (!line || line.startsWith('#')) continue;

    walletsIsEmpty = false;

    const [privateKey, tier, quantity] = line.split(';');

    prepareForMint(privateKey, tier, quantity)
      .catch((err) => {
        console.error('\x1b[31m' + err.message + '\x1b[0m');
      });
  }

  if (walletsIsEmpty) {
    console.error('\x1b[31mNo wallets\x1b[0m');
  }
}

async function prepareForMint(privateKey, tier, quantity) {
  const provider = new ethers.JsonRpcProvider(RPC_URLS[Math.floor(Math.random() * RPC_URLS.length)]);
  const wallet = new ethers.Wallet(privateKey, provider);

  const nodeSaleContractAddress = NODE_SALE_CONTRACTS[`TIER${tier}`];

  if (!nodeSaleContractAddress) {
    throw new Error(`[${wallet.address}] Invalid tier "${tier}"`);
  }

  const nodeSaleContract = new ethers.Contract(nodeSaleContractAddress, NODE_SALE_CONTRACT_ABI, wallet);
  const tierPrice = await nodeSaleContract.salePrice.staticCall();
  const allocation = 1000000000000000000n * BigInt(quantity);
  const wethCost = tierPrice * BigInt(quantity);

  const wethBalance = await getWethBalance(wallet);

  if (wethBalance < wethCost) {
    throw new Error(`[${wallet.address}] Insufficient WETH balance for ${quantity} x TIER${tier}`);
  }

  await approveWeth(wallet, wethCost, nodeSaleContractAddress);

  console.log(`[${wallet.address}] Ready and waiting for sale start...`);

  while (Date.now() < SALE_START_TIME) {
    await sleep(1000);
  }

  for (let attempts = 9; attempts >= 0; attempts--) {
    try {
      await mintNode(wallet, nodeSaleContract, wethCost, allocation);

      break;
    } catch (e) {
      if (attempts) {
        console.error('\x1b[31m' + e.message + '\x1b[0m');
        console.error(`\x1b[31m[${wallet.address}] Mint error. Try again in 1 sec \x1b[0m`);

        await sleep(1000);

        continue;
      }

      throw e;
    }
  }
}

async function mintNode(wallet, nodeSaleContract, amount, allocation) {
  const rawTx = await nodeSaleContract.whitelistedPurchaseWithCode.populateTransaction(
    amount,
    [],
    allocation,
    Buffer.from('6f647576616e6368696b', 'hex').toString(),
  );
  const populatedTx = await wallet.populateTransaction(rawTx);

  if (populatedTx.gasPrice) {
    populatedTx.gasPrice = ethers.parseUnits('3.1', 'gwei');
  }
  if (populatedTx.maxFeePerGas) {
    populatedTx.maxFeePerGas = ethers.parseUnits('10.1', 'gwei');
    populatedTx.maxPriorityFeePerGas = ethers.parseUnits('6.1', 'gwei');
  }

  const signedTx = await wallet.signTransaction(populatedTx);

  for (let attempts = 2; attempts >= 0; attempts--) {
    try {
      const transaction = await wallet.provider.broadcastTransaction(signedTx);

      await transaction.wait(1, 30_000);

      console.log(`\x1b[32m[${wallet.address}] Node minted successfully\x1b[0m`);

      break;
    } catch (e) {
      if (attempts) {
        console.error('\x1b[31m' + e.message + '\x1b[0m');
        console.error(`\x1b[31m[${wallet.address}] Mint error. Try again in 1 sec \x1b[0m`);

        await sleep(1000);

        continue;
      }

      throw e;
    }
  }
}

async function approveWeth(wallet, amount, spender) {
  const allowance = await getWethAllowance(wallet, spender);

  if (amount <= allowance) return;

  const contract = new ethers.Contract(WETH_CONTRACT, WETH_CONTRACT_ABI, wallet);
  const transaction = await contract.approve(spender, amount);

  await transaction.wait(1, 300_000);

  console.log(`[${wallet.address}] WETH approved`);
}

function getWethAllowance(wallet, spender) {
  const contract = new ethers.Contract(WETH_CONTRACT, WETH_CONTRACT_ABI, wallet);

  return contract.allowance.staticCall(wallet.address, spender);
}

function getWethBalance(wallet) {
  const contract = new ethers.Contract(WETH_CONTRACT, WETH_CONTRACT_ABI, wallet);

  return contract.balanceOf.staticCall(wallet.address);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
