import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther, ZeroAddress, isAddress } from "ethers";
import { config } from "dotenv";

// Load environment variables
config();

const AiPredictionV1Module = buildModule("AiPredictionV1Module", (m) => {
  // Validate required environment variables
  if (!process.env.OWNER_ADDRESS) throw new Error("OWNER_ADDRESS is required");
  if (!process.env.ADMIN_ADDRESS) throw new Error("ADMIN_ADDRESS is required");
  if (!process.env.ORACLE_ROUTER) throw new Error("ORACLE_ROUTER is required");
  if (!process.env.ORACLE_DON_ID) throw new Error("ORACLE_DON_ID is required");

  // Validate addresses
  const ownerAddress = process.env.OWNER_ADDRESS;
  const adminAddress = process.env.ADMIN_ADDRESS;
  const oracleRouter = process.env.ORACLE_ROUTER;

  // Check if addresses are valid
  if (!isAddress(ownerAddress)) throw new Error("OWNER_ADDRESS is not a valid address");
  if (!isAddress(adminAddress)) throw new Error("ADMIN_ADDRESS is not a valid address");
  if (!isAddress(oracleRouter)) throw new Error("ORACLE_ROUTER is not a valid address");

  // Check for zero addresses
  if (ownerAddress === ZeroAddress) throw new Error("OWNER_ADDRESS cannot be zero address");
  if (adminAddress === ZeroAddress) throw new Error("ADMIN_ADDRESS cannot be zero address");
  if (oracleRouter === ZeroAddress) throw new Error("ORACLE_ROUTER cannot be zero address");

  const oracleDonId = process.env.ORACLE_DON_ID;

  // Optional parameters from env with defaults
  const minBetAmount = process.env.MIN_BET_AMOUNT 
    ? parseEther(process.env.MIN_BET_AMOUNT).toString()
    : parseEther("0.01").toString(); // Default: 0.01 ETH
  
  const houseFee = +(process.env.HOUSE_FEE ?? "100"); // Default: 1%
  
  const roundMasterFee = process.env.ROUND_MASTER_FEE ?? "200"; // Default: 2%
  
  const oracleCallbackGasLimit = process.env.ORACLE_CALLBACK_GAS_LIMIT ?? "300000";

  // Deploy the contract
  const aiPredictionV1 = m.contract("AiPredictionV1", [
    ownerAddress,
    adminAddress,
    minBetAmount,
    houseFee,
    roundMasterFee,
    oracleRouter,
    oracleDonId,
    oracleCallbackGasLimit
  ]);

  return { aiPredictionV1 };
});

export default AiPredictionV1Module;