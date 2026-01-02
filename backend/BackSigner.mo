import Principal "mo:base/Principal";
import Blob "mo:base/Blob";
//import Cycles "mo:base/ExperimentalCycles";

module {
  public type EcdsaCurve = { #secp256k1 };
  public type KeyId = { curve : EcdsaCurve; name : Text };

  public type EcdsaPublicKeyArgs = {
    canister_id : ?Principal;
    derivation_path : [Blob];
    key_id : KeyId;
  };
  public type EcdsaPublicKeyResponse = { public_key : Blob; chain_code : Blob };

  public type SignWithEcdsaArgs = {
    message_hash : Blob;
    derivation_path : [Blob];
    key_id : KeyId;
  };
  public type SignWithEcdsaResponse = { signature : Blob };

  public let icsys : actor {
    ecdsa_public_key : EcdsaPublicKeyArgs -> async EcdsaPublicKeyResponse;
    sign_with_ecdsa : SignWithEcdsaArgs -> async SignWithEcdsaResponse;
  } = actor ("aaaaa-aa");

  // Helper to determine the key name (dfx_test_key for local, key_1 for mainnet)
  public func getKeyName() : async Text {
    try {
      ignore await icsys.ecdsa_public_key({
        canister_id = null;
        derivation_path = [];
        key_id = { curve = #secp256k1; name = "dfx_test_key" };
      });
      "dfx_test_key"
    } catch (_) {
      "key_1"
    }
  };

  // Returns a secp256k1 public key derived from the caller using Chain Key tECDSA.
  public func getEthPublicKey(caller : Principal) : async Blob {
    let derivationPath : [Blob] = [Principal.toBlob(caller)];
    let keyName = await getKeyName();

    let res = await icsys.ecdsa_public_key({
      canister_id = null;
      derivation_path = derivationPath;
      key_id = { curve = #secp256k1; name = keyName };
    });
    res.public_key;
  };

  // Signs a message hash using the caller's derived key.
  public func signMessageHash(caller : Principal, message_hash : Blob) : async Blob {
    let derivationPath : [Blob] = [Principal.toBlob(caller)];
    let keyName = await getKeyName();

    // Add cycles to pay for the signature. 
    // On mainnet this is expensive (~26B cycles). On local it's cheap.
    // We add a generous amount here.
    //Cycles.add(20_000_000_000);

    let res = await icsys.sign_with_ecdsa({
      message_hash = message_hash;
      derivation_path = derivationPath;
      key_id = { curve = #secp256k1; name = keyName };
    });
    
    res.signature;
  };
};