# Notes

To use this repo as it is, please [download](https://documentation.anon-aadhaar.pse.dev/docs/quick-setup#run-anon-aadhaar-on-localhost-mode) the wasm, zkey and json files and put them in `packages/nextjs/public`.

# Test proof:

- nullifierSeed: 1356901
- nullifier: 20979784874714056060541051260689831410980619730749142799673303954514703681875
- timestamp: 1723321800
- signal: 429134404602683082299695775875803861605232807327
- revealArray: [0,0,0,0]
- groth16Proof: [12828900230146543594478658752150624615122494885738128275826725493364383328288,19469316686023506377399184555392055330124109950859140428974756092630763970162,10455107533057272822039075089191026900775354061661973208452813809659488439708,17254337159427966584531508653125692941434670590119436795591032470922546707862,14609417139310070813329495819573641584077493065312370986130365378279749606056,8165214427110633620929278824231065019818254910366123684685891680535414094122,9513210418062207665695878833318595340168203436446687627592383012933933129473,20219862337431553459244682776269593961320859825385401397000368261059617887035]

## Lessons for using maci-cli

1. In the maci repo:
   ```
   pnpm i
   pnpm run build
   ```
2. cd into `cli` and run `npm install -g .`
3. run `maci-cli -V` you should get: 2.0.0

## Using the cli

- Send some funds:

  1. Replace with one of the private keys generated from `yarn chain` in the maci repo `packages/cli/ts/utils/defaults.ts`

  ```
  export const DEFAULT_ETH_SK = "your_scaffold_private_key";
  ```

  now run:

  ```
  maci-cli fundWallet -a 10000000000000000000 -w 0x93496ef70EA5A1635B52CdEcbB73cc0360619cE7
  ```

- Generate maci keys:

```
maci-cli genMaciKeyPair
```

## Workflow for using maci only wiht the cli [link](https://maci.pse.dev/docs/developers-references/typescript-code/cli#demonstration):

1. Deploy VkRegistry with:

   ```
   maci-cli deployVkRegistry
   ```

2. Set Verifiying keys. We will use:

   ```
   Coordinator:
   Public key: macipk.281830024fb6d21a4c73a89a7139aff61fbbddad731ef2dc2db9516171fd390e
   Private key: macisk.bf92af7614b07e2ba19dce65bb7fef2b93d83b84da2cf2e3af690104fbc52511

   Alice:
   Public key: macipk.1cac8e4e5b54d7dcce4aa06e71d8b9f324458756e7a9368383d005592719512a
   Private key: macisk.63e796e4e5d18a5fcf4ccef1e74e83b807a165d6727bb892017

   ```

   This won't deploy any contract.

   Documentation from cli help:

   ```
   Usage: maci-cli setVerifyingKeys [options]

   Options:
   -s, --state-tree-depth <stateTreeDepth> the state tree depth
   -i, --int-state-tree-depth <intStateTreeDepth> the intermediate state tree depth
   -m, --msg-tree-depth <messageTreeDepth> the message tree depth
   -v, --vote-option-tree-depth <voteOptionTreeDepth> the vote option tree depth
   -b, --msg-batch-depth <messageBatchDepth> the message batch depth
   -pqv, --process-messages-zkey-qv <processMessagesZkeyPathQv> the process messages qv zkey path (see different options for zkey files to use specific circuits
   -tqv, --tally-votes-zkey-qv <tallyVotesZkeyPathQv> the tally votes qv zkey path (see different options for zkey files to use specific circuits
   -pnqv, --process-messages-zkey-non-qv <processMessagesZkeyPathNonQv> the process messages non-qv zkey path (see different options for zkey files to use specific circuits
   -tnqv, --tally-votes-zkey-non-qv <tallyVotesZkeyPathNonQv> the tally votes non-qv zkey path (see different options for zkey files to use specific circuits
   -uq, --use-quadratic-voting <useQuadraticVoting> whether to use quadratic voting (default: true)
   -k, --vk-registry <vkRegistry> the vk registry contract address
   -q, --quiet <quiet> whether to print values to the console (default: false)
   -r, --rpc-provider <provider> the rpc provider URL
   -h, --help display help for command

   ```

   Run (notice that we will be usign params for qv):

   ```
   maci-cli setVerifyingKeys \
   --state-tree-depth 10 \
   --int-state-tree-depth 1 \
   --msg-tree-depth 2 \
   --vote-option-tree-depth 2 \
   --msg-batch-depth 1 \
   --process-messages-zkey-qv ./zkeys/ProcessMessages_10-2-1-2_test/ProcessMessages_10-2-1-2_test.0.zkey \
   --tally-votes-zkey-qv ./zkeys/TallyVotes_10-1-2_test/TallyVotes_10-1-2_test.0.zkey

   ```

3. Create maci contract:

   ```
   maci-cli create -s 10
   ```

   This creates the following contracts:

   - "InitialVoiceCreditProxy"
   - "SignUpGatekeeper"
   - "Verifier"
   - "MACI"
   - "PollFactory"
   - "PoseidonT3"
   - "PoseidonT4"
   - "PoseidonT5"
   - "PoseidonT6"

4. Deploy poll, note that the key is from the coordinator:

   ```
   maci-cli deployPoll \
      -pk macipk.281830024fb6d21a4c73a89a7139aff61fbbddad731ef2dc2db9516171fd390e \
      -t 1000 -i 1 -m 2 -b 1 -v 2
   ```

   This will deploy

   - "MessageProcessor-0"
   - "Tally-0"
   - "Poll-0"

   If you run it again new contracts are deployed with "-1" instead of "-0"

5. Alice sign up

   ```
   maci-cli signup \
      --pubkey macipk.1cac8e4e5b54d7dcce4aa06e71d8b9f324458756e7a9368383d005592719512a
   ```

6. Alice votes:

   ```
   maci-cli publish \
      --pubkey macipk.1cac8e4e5b54d7dcce4aa06e71d8b9f324458756e7a9368383d005592719512a \
      --privkey macisk.63e796e4e5d18a5fcf4ccef1e74e83b807a165d6727bb89201782240458f7420 \
      --state-index 1 \
      --vote-option-index 0 \
      --new-vote-weight 9 \
      --nonce 1 \
      --poll-id 0

   ```

7. Coordinator advances in time:

   ```
   maci-cli timeTravel -s 1000
   ```

8. Coordinator merge sign ups:

   ```
   maci-cli mergeSignups --poll-id 0
   ```

9. Coordinator merge messages:

   ```
   maci-cli mergeMessages --poll-id 0
   ```

10. Coordinator generates proofs:

```
Usage: maci-cli genProofs [options]


generate the proofs for a poll

Options:
-sk, --privkey <privkey> your serialized MACI private key
-x, --maci-address <maciAddress> the MACI contract address
-o, --poll-id <pollId> the poll id
-t, --tally-file <tallyFile> the tally file with results, per vote option spent credits, spent voice credits total
-r, --rapidsnark <rapidsnark> the path to the rapidsnark binary
-wp, --process-witnessgen <processWitnessgen> the path to the process witness generation binary
-pd, --process-witnessdat <processWitnessdat> the path to the process witness dat file
-wt, --tally-witnessgen <tallyWitnessgen> the path to the tally witness generation binary
-td, --tally-witnessdat <tallyWitnessdat> the path to the tally witness dat file
-zp, --process-zkey <processZkey> the path to the process zkey
-zt, --tally-zkey <tallyZkey> the path to the tally zkey
-q, --quiet <quiet> whether to print values to the console (default: false)
-p, --rpc-provider <provider> the rpc provider URL
-f, --output <outputDir> the output directory for proofs
-tx, --transaction-hash <transactionHash> transaction hash of MACI contract creation
-w, --wasm whether to use the wasm binaries
-pw, --process-wasm <processWasm> the path to the process witness generation wasm binary
-tw, --tally-wasm <tallyWasm> the path to the tally witness generation wasm binary
-st, --state-file <stateFile> the path to the state file containing the serialized maci state
-sb, --start-block <startBlock> the block number to start looking for events from
-eb, --end-block <endBlock> the block number to end looking for events from
-bb, --blocks-per-batch <blockPerBatch> the number of blocks to process per batch
-uq, --use-quadratic-voting <useQuadraticVoting> whether to use quadratic voting (default: true)
-h, --help display help for command

```

```
maci-cli genProofs \
--privkey macisk.bf92af7614b07e2ba19dce65bb7fef2b93d83b84da2cf2e3af690104fbc52511 \
--poll-id 0 \
--process-zkey ./zkeys/ProcessMessages_10-2-1-2_test/ProcessMessages_10-2-1-2_test.0.zkey \
--tally-zkey ./zkeys/TallyVotes_10-1-2_test/TallyVotes_10-1-2_test.0.zkey \
--tally-file tally.json \
--output proofs/ \
-tw ./zkeys/TallyVotes_10-1-2_test/TallyVotes_10-1-2_test_js/TallyVotes_10-1-2_test.wasm \
-pw ./zkeys/ProcessMessages_10-2-1-2_test/ProcessMessages_10-2-1-2_test_js/ProcessMessages_10-2-1-2_test.wasm \
-w true
```

## Params for MACI sign up:

{"x":"9453811611401425417873282829453451081901440203056730621234123178381606479004","y":"6606073480734992424491039141423652057001268697189709755693149853209753795002"}

# Scaffold ETH 2 + MACI Voting Template

Welcome to the Scaffold ETH 2 + MACI Voting Template! This template is a powerful starting point for developers aiming to build decentralized voting applications that prioritize privacy and resist collusion. Combining the rapid development environment of Scaffold ETH with the innovative Minimal Anti-Collusion Infrastructure (MACI), this template offers a robust foundation for creating secure and transparent voting systems on the Ethereum blockchain

## Features

- **Voter Registration**: Secure registration process through the MACI contract, enabling eligible voting.
- **Poll Management**: Admins can easily create and manage polls, including question and options setup.
- **Secure Voting**: Leverage MACI's privacy-preserving technology to ensure votes are cast anonymously and securely.
- **Results Display**: Transparent display of poll results after the voting phase concludes.
- **Admin Dashboard**: Comprehensive admin interface for poll oversight, including current status and results analytics.

## Requirements

Ensure you have the following tools installed before you proceed:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

Jumpstart your development with these simple steps:

1. **Clone and Set Up the Project**

```bash
git clone https://github.com/yashgo0018/maci-wrapper.git
cd maci-wrapper
yarn install
```

2. **Download the zkeys for the maci circuits**

In your first terminal window, run:

```bash
yarn download-zkeys
```

3. **Update the environment variables**

Copy the env example files to env files

```bash
cp packages/hardhat/.env.example packages/hardhat/.env
cp packages/nextjs/.env.example packages/nextjs/.env.local
```

Update the values of the env variables in these new .env files

4. **Start a Local Ethereum Network**

In your first terminal window, run:

```bash
yarn chain
```

This initiates a local Ethereum network via Hardhat for development and testing purposes. Adjust the network settings in `hardhat.config.ts` as needed.

5. **Deploy Contracts**

In a second terminal, deploy your test contract with:

```bash
yarn deploy
```

Find the contract in `packages/hardhat/contracts`. This script deploys your contract to the local network, with customization available in `packages/hardhat/deploy`.

6. **Launch the NextJS Application**

In a third terminal, start the NextJS frontend:

```bash
yarn start
```

7. **Compute Results**

- In a fourth terminal, clone the maci repo - `git clone git@github.com:privacy-scaling-explorations/maci.git`
- Copy the zkeys generated from the maci wrapper repo to the cli directory of the maci repo using `cp -r maci-wrapper/packages/hardhat/zkeys maci/cli`.
- Install the dependencies using `pnpm i` and build the maci project using `pnpm run build`
- Copy the new contract addresses from the maci wrapper repo to the maci repo using `cp -r maci-wrapper/packages/contractAddresses.json maci/cli/build/contractAddresses.json`.
- After this you should be able to run the commands written in the [maci documentation](https://maci.pse.dev/docs/v1.2/cli).
- First merge signups, then merge messages, and then generate proof, and upload the tally.json file which is generated in the process to the admin panel after the poll is over.

Navigate to `http://localhost:3000` to interact with your dApp. Modify your app configuration in `packages/nextjs/scaffold.config.ts` and `packages/hardhat/constants.ts` as necessary.

The deployed contracts will be saved to the file `packages/hardhat/contractAddresses.json`, this file is compatible with maci cli.

The coordinator keys will be stored in the file `packages/hardhat/coordinatorKeyPair.json`.

## Usage

After setting up the project, you can:

- **Register**: Use the app's interface to register with the MACI contract and gain voting rights.
- **Create Polls**: As an admin, you can create polls with custom questions and options.
- **Vote**: Registered voters can participate in polls, utilizing MACI's secure voting mechanism.
- **View Results**: Access poll outcomes after the voting phase ends.
- **Admin Dashboard**: Monitor and manage ongoing polls, including viewing detailed poll status.

## Contributing

Your contributions are welcome! Feel free to report issues, submit fixes, or suggest new features to enhance the project.

## License

This project is licensed under the [MIT License](LICENSE).
