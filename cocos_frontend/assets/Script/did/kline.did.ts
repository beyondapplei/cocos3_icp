export const idlFactoryKline = ({ IDL }) => {


  const KLineData = IDL.Record({ 'close' : IDL.Nat });
  return IDL.Service({
    'deleteCurrencyData' : IDL.Func([IDL.Text], [IDL.Bool], []),


    'getCanisterId' : IDL.Func([], [IDL.Text], ['query']),
    'getCurrencyData' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(IDL.Tuple(IDL.Nat, KLineData))],
        ['query'],
      ),
    'getCurrentTimestamp' : IDL.Func([], [IDL.Int], ['query']),

    'getKLineData' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Nat],
        [IDL.Vec(IDL.Tuple(IDL.Nat, KLineData))],
        ['query'],
      ),
    'getStoredCurrencies' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(IDL.Tuple(IDL.Nat, KLineData))))],
        ['query'],
      ),
    'storeKLineData' : IDL.Func(
        [IDL.Text, IDL.Vec(IDL.Tuple(IDL.Nat, KLineData))],
        [],
        [],
      ),
  });
};
export const initKline = ({ IDL }) => { return []; };
