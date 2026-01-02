import Principal "mo:base/Principal";
import Blob "mo:base/Blob";
//import Cycles "mo:base/ExperimentalCycles";
import Error "mo:base/Error";
import CFSignerdid "CFSignerdid";

module {

  // For local, use dfx canister id signer
  let signer : CFSignerdid.Service = actor ("grghe-syaaa-aaaar-qabyq-cai");

  // Helper to determine the key name (dfx_test_key for local, key_1 for mainnet)
  public func getKeyName() : async Text {
    "key_1" // For mainnet signer canister
  };

  public func getEthPublicKey( owner : Principal) : async Blob {
    let derivationPath : [Blob] = [Principal.toBlob(owner)];
    let keyName = await getKeyName();

    let args : CFSignerdid.EcdsaPublicKeyArgument = {
      canister_id = null;
      derivation_path = derivationPath;
      key_id = { curve = #secp256k1; name = keyName };
    };

    let payment : ?CFSignerdid.PaymentType = ?#AttachedCycles;

    let res = await signer.generic_caller_ecdsa_public_key(args, payment);

    switch (res) {
      case (#Ok response) { response._0_.public_key };
      case (#Err _err) { throw Error.reject("Error getting public key") };
    };
  };

  public func getEthAddress( owner : Principal) : async Text {
    let request : CFSignerdid.EthAddressRequest = {
      principal = ?owner;
    };

    let payment : ?CFSignerdid.PaymentType = ?#AttachedCycles;

    let res = await signer.eth_address(request, payment);

    switch (res) {
      case (#Ok response) { response.address };
      case (#Err _err) { throw Error.reject("Error getting address") };
    };
  };

  // Signs a message hash using the caller's derived key via Chain Fusion Signer.
  public func signWithSigner(caller : Principal, message_hash : Blob,) : async Blob {
    let derivationPath : [Blob] = [Principal.toBlob(caller)];
    let keyName = await getKeyName();

    let args : CFSignerdid.SignWithEcdsaArgument = {
      message_hash = message_hash;
      derivation_path = derivationPath;
      key_id = { curve = #secp256k1; name = keyName };
    };

    let payment : ?CFSignerdid.PaymentType = ?#PatronPaysIcrc2Cycles {
      owner = caller;
      subaccount = null;
    };

    let res = await signer.generic_sign_with_ecdsa(payment, args);

    switch (res) {
      case (#Ok response) { response._0_.signature };
      case (#Err _err) { throw Error.reject("Error signing") };
    };
  };
};