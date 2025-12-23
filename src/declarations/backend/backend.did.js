export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'get_eth_public_key' : IDL.Func([], [IDL.Vec(IDL.Nat8)], []),
    'greet' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'setGreeting' : IDL.Func([IDL.Text], [], []),
    'sign' : IDL.Func([IDL.Vec(IDL.Nat8)], [IDL.Vec(IDL.Nat8)], []),
  });
};
export const init = ({ IDL }) => { return []; };
