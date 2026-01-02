export const idlFactoryBack = ({ IDL }) => {
  return IDL.Service({
    'getSavedEthAddress' : IDL.Func([], [IDL.Opt(IDL.Text)], ['query']),
    'get_eth_public_key' : IDL.Func([], [IDL.Vec(IDL.Nat8)], []),
    'greet' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'requestAndSaveEthAddress' : IDL.Func([], [IDL.Text], []),
    'requestPubkey' : IDL.Func([], [IDL.Text], []),
    'setGreeting' : IDL.Func([IDL.Text], [], []),
    'sign' : IDL.Func([IDL.Vec(IDL.Nat8)], [IDL.Vec(IDL.Nat8)], []),
  });
};
export const init = ({ IDL }) => { return []; };
