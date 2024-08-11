import { useAuthContext } from "~~/contexts/AuthContext";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export default function RegisterWithAadhaarProof() {
  const { keypair, isRegistered, generateKeypair } = useAuthContext();

  // to do, get the proof from the AnonAahaar prover
  // right now is hadcoded
  const anonProof = {
    nullifierSeed: 1356901n,
    nullifier: 20979784874714056060541051260689831410980619730749142799673303954514703681875n,
    timestamp: 1723321800n,
    signal: 429134404602683082299695775875803861605232807327n,
    revealArray: [0n, 0n, 0n, 0n] as const,
    groth16Proof: [
      12828900230146543594478658752150624615122494885738128275826725493364383328288n,
      19469316686023506377399184555392055330124109950859140428974756092630763970162n,
      10455107533057272822039075089191026900775354061661973208452813809659488439708n,
      17254337159427966584531508653125692941434670590119436795591032470922546707862n,
      14609417139310070813329495819573641584077493065312370986130365378279749606056n,
      8165214427110633620929278824231065019818254910366123684685891680535414094122n,
      9513210418062207665695878833318595340168203436446687627592383012933933129473n,
      20219862337431553459244682776269593961320859825385401397000368261059617887035n,
    ] as const,
  };

  const { writeAsync } = useScaffoldContractWrite({
    contractName: "MACIWrapper",
    functionName: "signUpAadhaar",
    args: [keypair?.pubKey.asContractParam() as { x: bigint; y: bigint }, "0x", "0x", anonProof],
  });

  async function register() {
    if (!keypair) return;

    try {
      await writeAsync({ args: [keypair.pubKey.asContractParam() as { x: bigint; y: bigint }, "0x", "0x", anonProof] });
    } catch (err) {
      console.log(err);
    }
  }

  if (!keypair) {
    return (
      <button className="border border-slate-600 bg-primary px-3 py-2 rounded-lg font-bold" onClick={generateKeypair}>
        Login with MACI
      </button>
    );
  }

  if (isRegistered) return <div>Thanks for Registration</div>;

  return (
    <>
      (You are not registered yet)
      <button className="border border-slate-600 bg-primary px-3 py-2 rounded-lg font-bold" onClick={register}>
        Register with Aadhaar
      </button>
    </>
  );
}
