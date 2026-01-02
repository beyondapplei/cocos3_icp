import Principal "mo:base/Principal";
import BackSigner "BackSigner";
import CFSigner "CFSigner";
import Blob "mo:base/Blob";
import Nat8 "mo:base/Nat8";

persistent actor ICPDEX {
  // We store the greeting in a stable variable such that it gets persisted over canister upgrades.
  var greeting : Text = "Hello, ";
  var ethAddress : ?Text = null;

  // This update method stores the greeting prefix in stable memory.
  public func setGreeting(prefix : Text) : async () {
    greeting := prefix;
  };

  // This query method returns the currently persisted greeting with the given name.
  public query func greet(name : Text) : async Text {
    return greeting # name # "!";
  };

  // Returns a secp256k1 public key derived from the caller using Chain Key tECDSA.
  public shared ({ caller }) func get_eth_public_key() : async Blob {
    await BackSigner.getEthPublicKey(caller);
  };

  // Signs a message hash using the caller's derived key.
  public shared ({ caller }) func sign(message_hash : Blob) : async Blob {
    await BackSigner.signMessageHash(caller, message_hash);
  };

  // Request ETH address from CFSigner and save it (placeholder: use pubKey hex as address)
  public shared func requestPubkey() : async Blob {
    await CFSigner.getSelfEthPublicKey();
  };

  public shared func requestAndSaveEthAddress() : async Text {
    await CFSigner.getEthAddress();
  };

  // Get saved ETH address
  public query func getSavedEthAddress() : async ?Text {
    ethAddress;
  };
};
