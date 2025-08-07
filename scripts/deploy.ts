import { ethers } from "hardhat";
import { getDeployer, saveAddressesToFrontend } from "./config";

async function main() {
  console.log("开始部署合约...");

  // 获取部署账户
  const deployer = await getDeployer();

  const NftMarket = await ethers.getContractFactory("NftMarket");
  const NftMarketDeploy = await NftMarket.deploy();
  await NftMarketDeploy.waitForDeployment();
  const NftMarketAddress = await NftMarketDeploy.getAddress();
  console.log(`NftMarkets 已部署到: ${NftMarketAddress}`);


  

  // 保存合约地址
  saveAddressesToFrontend({
   nftMarket:NftMarketAddress
  });

  console.log("部署完成!");
}

// 执行部署
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
