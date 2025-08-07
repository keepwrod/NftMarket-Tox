import { ethers } from "hardhat";
import dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

// 网络配置
export const NETWORK_CONFIG = {
    // Arbitrum Sepolia 测试网
    arbitrumSepolia: {
      rpcUrl: process.env.ARBITRUM_SEPOLIA_RPC_URL || "https://sepolia-rollup.arbitrum.io/rpc",
      chainId: 421614,
      explorerUrl: "https://sepolia.arbiscan.io"
    },
    // Ganache 本地网络
    ganache: {
      rpcUrl: process.env.GANACHE_URL || "http://127.0.0.1:7545",
      chainId: 1337,
      explorerUrl: "http://localhost:7545"
    },
  };

// 获取部署账户
export const getDeployer = async () => {
   const [deployer] = await ethers.getSigners();
   const balance = await ethers.provider.getBalance(deployer.address);
   console.log("账户余额:", ethers.formatEther(balance), "ETH");

   return deployer
  };

  // 保存部署地址到前端
export const saveAddressesToFrontend = (addresses: {
    nftMarket: string;
  }) => {
    // 输出合约地址
    console.log("合约地址:", addresses);
    
    try {
      // 创建合约地址配置文件
      const configContent = `
  // 此文件由部署脚本自动生成，请勿手动修改
  // 最后更新时间: ${new Date().toLocaleString()}
  
  export const CONTRACT_ADDRESSES = {
    nftMarket: "${addresses.nftMarket}",
  };
  `;
  
      // 确保目录存在
      const configDir = path.join(__dirname, "../frontend/src/config");
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }
  
      // 写入配置文件
      const configPath = path.join(configDir, "addresses.ts");
      fs.writeFileSync(configPath, configContent);
      console.log(`合约地址已保存到: ${configPath}`);
      
      // 复制 ABI 文件到前端
      const artifactsDir = path.join(__dirname, "../artifacts/contracts");
      const frontendAbiDir = path.join(__dirname, "../frontend/src/abis");
      
      if (!fs.existsSync(frontendAbiDir)) {
        fs.mkdirSync(frontendAbiDir, { recursive: true });
      }
      
      // 复制 ABI
      const nftMarketArtifact = require(path.join(artifactsDir, "NftMarket.sol/NftMarket.json"));
      fs.writeFileSync(
        path.join(frontendAbiDir, "NftMarket.json"),
        JSON.stringify(nftMarketArtifact, null, 2)
      );
      
      
      console.log("ABI 文件已复制到前端");
    } catch (error) {
      console.error("保存合约地址到前端失败:", error);
    }
  };