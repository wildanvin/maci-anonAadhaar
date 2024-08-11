import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { MACIWrapper } from "../typechain-types";
import { GatekeeperContractName, InitialVoiceCreditProxyContractName } from "../constants";
import fs from "fs";

const deployContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();

  const maci = await hre.ethers.getContract<MACIWrapper>("MACIWrapper", deployer);
  const initialVoiceCreditProxy = await hre.ethers.getContract(InitialVoiceCreditProxyContractName, deployer);
  const gatekeeper = await hre.ethers.getContract(GatekeeperContractName, deployer);
  const verifier = await hre.ethers.getContract("Verifier", deployer);
  const pollFactory = await hre.ethers.getContract("PollFactory", deployer);
  const poseidonT3 = await hre.ethers.getContract("PoseidonT3", deployer);
  const poseidonT4 = await hre.ethers.getContract("PoseidonT4", deployer);
  const poseidonT5 = await hre.ethers.getContract("PoseidonT5", deployer);
  const poseidonT6 = await hre.ethers.getContract("PoseidonT6", deployer);

  //change to your burner wallet address provided by the FE
  const burnerAddress = "0x4b2b0D5eE2857fF41B40e3820cDfAc8A9cA60d9f";
  await maci.transferOwnership(burnerAddress);

  fs.writeFileSync(
    "./contractAddresses.json",
    JSON.stringify(
      {
        [hre.network.name]: {
          MACI: await maci.getAddress(),
          InitialVoiceCreditProxy: await initialVoiceCreditProxy.getAddress(),
          SignUpGatekeeper: await gatekeeper.getAddress(),
          Verifier: await verifier.getAddress(),
          PollFactory: await pollFactory.getAddress(),
          PoseidonT3: await poseidonT3.getAddress(),
          PoseidonT4: await poseidonT4.getAddress(),
          PoseidonT5: await poseidonT5.getAddress(),
          PoseidonT6: await poseidonT6.getAddress(),
        },
      },
      undefined,
      4,
    ),
  );
};

export default deployContracts;

deployContracts.tags = ["SubsidyFactory"];
