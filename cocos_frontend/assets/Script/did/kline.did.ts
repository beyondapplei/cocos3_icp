export const idlFactoryKline = ({ IDL }) => {
  return IDL.Service({
    'deleteCurrencyData' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'getAllData' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Nat))))],
        ['query'],
      ),
    'getCanisterId' : IDL.Func([], [IDL.Text], ['query']),
    'getCurrencyData' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Nat))],
        ['query'],
      ),
    'getKLineData' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Nat],
        [IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Nat))],
        ['query'],
      ),
    'getStoredCurrencies' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Nat))))],
        ['query'],
      ),
    'storeKLineData' : IDL.Func(
        [IDL.Text, IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Nat))],
        [],
        [],
      ),
  });
};
export const initKline = ({ IDL }) => { return []; };
