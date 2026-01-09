// OisyManager: minimal wrapper to connect to OISY Wallet Signer
// Uses dynamic import to avoid top-level bundling when possible.

//import { IcpWallet } from '@dfinity/oisy-wallet-signer/icp-wallet';

const globalOisyWalletSigner = (window as any).OisyWalletSigner;
const IcpWallet = globalOisyWalletSigner ? globalOisyWalletSigner.IcpWallet : null;


export default class OisyManager {
    public static readonly Instance: OisyManager = new OisyManager();   
    private constructor(){
    }         
    
    private walletoisy: any = null;
    private strPid: string = '';
 
    Init(){     

    }

    async connectWithOisyLib(): Promise<{ok: boolean, pid?: string, error?: any}> {
    
        const wallet = await IcpWallet.connect({
        url: 'https://oisy.com/sign'
        });

       // await this.disconnect();
        
        const { allPermissionsGranted } = await wallet.requestPermissionsNotGranted();
        const accounts = await wallet.accounts();
        if (allPermissionsGranted && accounts && accounts.length > 0) {
        this.walletoisy = wallet;
        const account = accounts[0];
        this.strPid = account.owner;

        // cc.log("OisyManager: connected to OISY Wallet, account:", account.owner);
        // } else {
        // cc.log("OisyManager: failed to get permissions or accounts from OISY Wallet");
        // }
        return { ok: true, pid: this.strPid };
        } else {
        return { ok: false, error: 'Permissions not granted or no accounts found' };
        }


    }
    

 

   async disconnect() {
        try {
        await this.walletoisy?.disconnect?.();
        return { ok: true };
        } catch (e) {
        return { ok: false, error: e };
        }
  }

   async requestPermissions() {
    try {
      const res = await this.walletoisy.requestPermissionsNotGranted();
      return { ok: true, res };
    } catch (e) {
      return { ok: false, error: e };
    }
  }

   async accounts() {
    try {
      const accounts = await this.walletoisy.accounts();
      return { ok: true, accounts };
    } catch (e) {
      return { ok: false, error: e };
    }
  }

   async transfer(request: any) {
    try {
      const blockHeight = await this.walletoisy.icrc1Transfer(request);
      return { ok: true, blockHeight };
    } catch (e) {
      return { ok: false, error: e };
    }
  }
}





// import { DFX_NETWORK, LEAGER_ICP_ID_LOCAL } from "./DefData";


// export default class OisyManager {
//     public static readonly Instance: OisyManager = new OisyManager();
//     private OisyManager(){
//     }           
 
//     Init(){


//     }
// }

