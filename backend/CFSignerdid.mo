// This is a generated Motoko binding.
// Please use `import service "ic:canister_id"` instead to call canisters on the IC if possible.

module {
  public type Account = { owner : Principal; subaccount : ?Blob };
  public type Arg = { #Upgrade; #Init : InitArg };
  public type BitcoinAddressType = { #P2WPKH };
  public type BitcoinNetwork = { #mainnet; #regtest; #testnet };
  public type BtcTxOutput = {
    destination_address : Text;
    sent_satoshis : Nat64;
  };
  public type BuildP2wpkhTxError = {
    #NotEnoughFunds : { available : Nat64; required : Nat64 };
    #WrongBitcoinNetwork;
    #NotP2WPKHSourceAddress;
    #InvalidDestinationAddress : GetAddressResponse;
    #InvalidSourceAddress : GetAddressResponse;
  };
  public type CallerPaysIcrc2Tokens = { ledger : Principal };
  public type CanisterStatusResultV2 = {
    controller : Principal;
    status : CanisterStatusType;
    freezing_threshold : Nat;
    balance : [(Blob, Nat)];
    memory_size : Nat;
    cycles : Nat;
    settings : DefiniteCanisterSettingsArgs;
    idle_cycles_burned_per_day : Nat;
    module_hash : ?Blob;
  };
  public type CanisterStatusType = { #stopped; #stopping; #running };
  public type Config = {
    ecdsa_key_name : Text;
    ic_root_key_raw : ?Blob;
    cycles_ledger : Principal;
  };
  public type DefiniteCanisterSettingsArgs = {
    controller : Principal;
    freezing_threshold : Nat;
    controllers : [Principal];
    memory_allocation : Nat;
    compute_allocation : Nat;
  };
  public type EcdsaCurve = { #secp256k1 };
  public type EcdsaKeyId = { name : Text; curve : EcdsaCurve };
  public type EcdsaPublicKeyArgument = {
    key_id : EcdsaKeyId;
    canister_id : ?Principal;
    derivation_path : [Blob];
  };
  public type EcdsaPublicKeyResponse = { public_key : Blob; chain_code : Blob };
  public type EthAddressError = {
    #SigningError : (RejectionCode_1, Text);
    #PaymentError : PaymentError;
  };
  public type EthAddressRequest = { principal : ?Principal };
  public type EthAddressResponse = { address : Text };
  public type EthPersonalSignRequest = { message : Text };
  public type EthPersonalSignResponse = { signature : Text };
  public type EthSignPrehashRequest = { hash : Text };
  public type EthSignPrehashResponse = { signature : Text };
  public type EthSignTransactionRequest = {
    to : Text;
    gas : Nat;
    value : Nat;
    max_priority_fee_per_gas : Nat;
    data : ?Text;
    max_fee_per_gas : Nat;
    chain_id : Nat;
    nonce : Nat;
  };
  public type GetAddressError = {
    #InternalError : { msg : Text };
    #PaymentError : PaymentError;
  };
  public type GetAddressRequest = {
    network : BitcoinNetwork;
    address_type : BitcoinAddressType;
  };
  public type GetAddressResponse = { address : Text };
  public type GetBalanceRequest = {
    network : BitcoinNetwork;
    address_type : BitcoinAddressType;
    min_confirmations : ?Nat32;
  };
  public type GetBalanceResponse = { balance : Nat64 };
  public type HttpRequest = {
    url : Text;
    method : Text;
    body : Blob;
    headers : [(Text, Text)];
  };
  public type HttpResponse = {
    body : Blob;
    headers : [(Text, Text)];
    status_code : Nat16;
  };
  public type InitArg = {
    ecdsa_key_name : Text;
    ic_root_key_der : ?Blob;
    cycles_ledger : ?Principal;
  };
  public type Outpoint = { txid : Blob; vout : Nat32 };
  public type PatronPaysIcrc2Tokens = { ledger : Principal; patron : Account };
  public type PaymentError = {
    #LedgerWithdrawFromError : {
      error : WithdrawFromError;
      ledger : Principal;
    };
    #LedgerUnreachable : CallerPaysIcrc2Tokens;
    #InvalidPatron;
    #LedgerTransferFromError : {
      error : TransferFromError;
      ledger : Principal;
    };
    #UnsupportedPaymentType;
    #InsufficientFunds : { needed : Nat64; available : Nat64 };
  };
  public type PaymentType = {
    #PatronPaysIcrc2Tokens : PatronPaysIcrc2Tokens;
    #AttachedCycles;
    #CallerPaysIcrc2Cycles;
    #CallerPaysIcrc2Tokens : CallerPaysIcrc2Tokens;
    #PatronPaysIcrc2Cycles : Account;
  };
  public type RejectionCode = {
    #NoError;
    #CanisterError;
    #SysTransient;
    #DestinationInvalid;
    #Unknown;
    #SysFatal;
    #CanisterReject;
  };
  public type RejectionCode_1 = {
    #NoError;
    #CanisterError;
    #SysTransient;
    #DestinationInvalid;
    #Unknown;
    #SysFatal;
    #CanisterReject;
  };
  public type Result = { #Ok : GetAddressResponse; #Err : GetAddressError };
  public type Result_1 = { #Ok : GetBalanceResponse; #Err : GetAddressError };
  public type Result_2 = { #Ok : SendBtcResponse; #Err : SendBtcError };
  public type Result_3 = { #Ok : EthAddressResponse; #Err : EthAddressError };
  public type Result_4 = {
    #Ok : EthPersonalSignResponse;
    #Err : EthAddressError;
  };
  public type Result_5 = {
    #Ok : EthSignPrehashResponse;
    #Err : EthAddressError;
  };
  public type Result_6 = {
    #Ok : { _0_  : EcdsaPublicKeyResponse };
    #Err : EthAddressError;
  };
  public type Result_7 = {
    #Ok : { _0_  : SignWithEcdsaResponse };
    #Err : EthAddressError;
  };
  public type Result_8 = {
    #Ok : { _0_  : EcdsaPublicKeyResponse };
    #Err : EthAddressError;
  };
  public type Result_9 = {
    #Ok : { _0_  : SignWithEcdsaResponse };
    #Err : EthAddressError;
  };
  public type SchnorrAlgorithm = { #ed25519; #bip340secp256k1 };
  public type SchnorrKeyId = { algorithm : SchnorrAlgorithm; name : Text };
  public type SchnorrPublicKeyArgument = {
    key_id : SchnorrKeyId;
    canister_id : ?Principal;
    derivation_path : [Blob];
  };
  public type SendBtcError = {
    #BuildP2wpkhError : BuildP2wpkhTxError;
    #InternalError : { msg : Text };
    #PaymentError : PaymentError;
  };
  public type SendBtcRequest = {
    fee_satoshis : ?Nat64;
    network : BitcoinNetwork;
    utxos_to_spend : [Utxo];
    address_type : BitcoinAddressType;
    outputs : [BtcTxOutput];
  };
  public type SendBtcResponse = { txid : Text };
  public type SignWithEcdsaArgument = {
    key_id : EcdsaKeyId;
    derivation_path : [Blob];
    message_hash : Blob;
  };
  public type SignWithEcdsaResponse = { signature : Blob };
  public type SignWithSchnorrArgument = {
    key_id : SchnorrKeyId;
    derivation_path : [Blob];
    message : Blob;
  };
  public type TransferFromError = {
    #GenericError : { message : Text; error_code : Nat };
    #TemporarilyUnavailable;
    #InsufficientAllowance : { allowance : Nat };
    #BadBurn : { min_burn_amount : Nat };
    #Duplicate : { duplicate_of : Nat };
    #BadFee : { expected_fee : Nat };
    #CreatedInFuture : { ledger_time : Nat64 };
    #TooOld;
    #InsufficientFunds : { balance : Nat };
  };
  public type Utxo = { height : Nat32; value : Nat64; outpoint : Outpoint };
  public type WithdrawFromError = {
    #GenericError : { message : Text; error_code : Nat };
    #TemporarilyUnavailable;
    #InsufficientAllowance : { allowance : Nat };
    #Duplicate : { duplicate_of : Nat };
    #InvalidReceiver : { receiver : Principal };
    #CreatedInFuture : { ledger_time : Nat64 };
    #TooOld;
    #FailedToWithdrawFrom : {
      withdraw_from_block : ?Nat;
      rejection_code : RejectionCode_1;
      refund_block : ?Nat;
      approval_refund_block : ?Nat;
      rejection_reason : Text;
    };
    #InsufficientFunds : { balance : Nat };
  };

  
  public type Service = actor {
    btc_caller_address : shared (
        GetAddressRequest,
        ?PaymentType,
      ) -> async Result;
    btc_caller_balance : shared (
        GetBalanceRequest,
        ?PaymentType,
      ) -> async Result_1;
    btc_caller_send : shared (SendBtcRequest, ?PaymentType) -> async Result_2;
    config : shared query () -> async Config;
    eth_address : shared (EthAddressRequest, ?PaymentType) -> async Result_3;
    eth_address_of_caller : shared ?PaymentType -> async Result_3;
    eth_personal_sign : shared (
        EthPersonalSignRequest,
        ?PaymentType,
      ) -> async Result_4;
    eth_sign_prehash : shared (
        EthSignPrehashRequest,
        ?PaymentType,
      ) -> async Result_5;
    eth_sign_transaction : shared (
        EthSignTransactionRequest,
        ?PaymentType,
      ) -> async Result_5;
    generic_caller_ecdsa_public_key : shared (
        EcdsaPublicKeyArgument,
        ?PaymentType,
      ) -> async Result_6;
    generic_sign_with_ecdsa : shared (
        ?PaymentType,
        SignWithEcdsaArgument,
      ) -> async Result_7;
    get_canister_status : shared () -> async CanisterStatusResultV2;
    http_request : shared query HttpRequest -> async HttpResponse;
    schnorr_public_key : shared (
        SchnorrPublicKeyArgument,
        ?PaymentType,
      ) -> async Result_8;
    schnorr_sign : shared (
        SignWithSchnorrArgument,
        ?PaymentType,
      ) -> async Result_9;
  };
  public type Self = Arg -> async Service;
}