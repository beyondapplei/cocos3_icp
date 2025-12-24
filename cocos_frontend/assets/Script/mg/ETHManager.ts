import { _decorator } from 'cc';
import UIManager from "../UIManager";
import LoginManager from "./LoginManager";
import { DFX_NETWORK } from "./DefData";
import { ethers } from 'ethers';
import BackManager from "./BackManager";

export default class ETHManager {
    public static readonly Instance: ETHManager = new ETHManager();
    private constructor(){}
    private provider: any = null;    
 
    Init(){

    }
   
   
    async GetBalanceETH(ethAddress: string): Promise<string> {

        // try {
//            //https://ethereum-rpc.publicnode.com
//            //https://ethereum-sepolia-rpc.publicnode.com
        // if (!this.provider) {
        // this.provider = new ethers.providers.JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');
        // }
        // const bal = await this.provider.getBalance(ethAddress);
        // const balanceInEth = parseFloat(ethers.utils.formatEther(bal)); // 转换为 ETH
        // return `Balance: ${balanceInEth.toFixed(6)} ETH`;
        // } catch (e) {
        // console.error(e);
        // return 'Balance: error';
        // }
    }
    async SendETH(fromAddr: string,toAddr: string, amountStr: string): Promise<string> {



        // try {
        // if (!this.provider) {
        // this.provider = new ethers.providers.JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');
        // }
        // const chainId = (await this.provider.getNetwork()).chainId;
        // const nonce = await this.provider.getTransactionCount(fromAddr);
        // const feeData = await this.provider.getFeeData();

        // const tx: any = {};
        // tx.to = toAddr;
        // tx.value = ethers.utils.parseEther(amountStr);
        // tx.nonce = nonce;
        // tx.chainId = chainId;
        // tx.maxFeePerGas = feeData.maxFeePerGas;
        // tx.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
        // tx.gasLimit = 21000;
        // tx.type = 2;


//            // 调用后端签名：先序列化 unsigned tx，然后对其 keccak256
        // const unsignedSerialized = ethers.utils.serializeTransaction(tx);
        // const msgHash = ethers.utils.keccak256(unsignedSerialized);
        // const msgHashBytes = ethers.utils.arrayify(msgHash);

        // cc.log("ETHManager: requesting signature for msgHash:", msgHash);
        // const signatureBlob = await BackManager.Instance.Sign(Array.from(msgHashBytes));
        // cc.log("ETHManager: received signature blob length:", signatureBlob && signatureBlob.length);
        // const signatureBytes = new Uint8Array(signatureBlob);

        // const r = ethers.utils.hexlify(signatureBytes.slice(0, 32));
        // const s = ethers.utils.hexlify(signatureBytes.slice(32, 64));

//            // 尝试不同的 v 值（0/1/27/28）来拼接签名并发送
        // const tryVs = [0, 1, 27, 28];
        // let lastError: any = null;
        // for (const v of tryVs) {
        // try {
        // const signature = ethers.utils.joinSignature({ r, s, v });
        // const signedSerialized = ethers.utils.serializeTransaction(tx, signature);
        // cc.log("ETHManager: trying send with v=", v, signedSerialized);
        // const response = await this.provider.sendTransaction(signedSerialized);
        // await response.wait();
        // return `Transaction confirmed: ${response.hash}`;
        // } catch (e: any) {
        // cc.warn("ETHManager: send attempt failed for v=", v, e && e.message ? e.message : e);
        // lastError = e;
//                    // try next v
        // }
        // }
//            // 如果都失败，抛出最后的错误
        // throw lastError || new Error('ETHManager: failed to send signed transaction');
        // } catch (e: any) {
        // console.error(e);
        // throw e;
        // }
    }
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// import UIManager from "../UIManager";
// import LoginManager from "./LoginManager";
// import { DFX_NETWORK } from "./DefData";
// 
// import { ethers } from 'ethers';
// import BackManager from "./BackManager";
// 
// export default class ETHManager {
//     public static readonly Instance: ETHManager = new ETHManager();
//     private constructor(){}
//     private provider: any = null;    
//  
//     Init(){
//    
//     }
//    
//    
//     async GetBalanceETH(ethAddress: string): Promise<string> {
//         
//         try {
//             //https://ethereum-rpc.publicnode.com
//             //https://ethereum-sepolia-rpc.publicnode.com
//             if (!this.provider) {
//                 this.provider = new ethers.providers.JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');
//             }
//             const bal = await this.provider.getBalance(ethAddress);
//             const balanceInEth = parseFloat(ethers.utils.formatEther(bal)); // 转换为 ETH
//             return `Balance: ${balanceInEth.toFixed(6)} ETH`;
//         } catch (e) {
//             console.error(e);
//             return 'Balance: error';
//         }
//     }
// 
//     async SendETH(fromAddr: string,toAddr: string, amountStr: string): Promise<string> {
//        
//       
// 
//         try {
//             if (!this.provider) {
//                 this.provider = new ethers.providers.JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');
//             }
//             const chainId = (await this.provider.getNetwork()).chainId;
//             const nonce = await this.provider.getTransactionCount(fromAddr);
//             const feeData = await this.provider.getFeeData();
// 
//             const tx: any = {};
//             tx.to = toAddr;
//             tx.value = ethers.utils.parseEther(amountStr);
//             tx.nonce = nonce;
//             tx.chainId = chainId;
//             tx.maxFeePerGas = feeData.maxFeePerGas;
//             tx.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
//             tx.gasLimit = 21000;
//             tx.type = 2;
// 
//             
//             // 调用后端签名：先序列化 unsigned tx，然后对其 keccak256
//             const unsignedSerialized = ethers.utils.serializeTransaction(tx);
//             const msgHash = ethers.utils.keccak256(unsignedSerialized);
//             const msgHashBytes = ethers.utils.arrayify(msgHash);
// 
//             cc.log("ETHManager: requesting signature for msgHash:", msgHash);
//             const signatureBlob = await BackManager.Instance.Sign(Array.from(msgHashBytes));
//             cc.log("ETHManager: received signature blob length:", signatureBlob && signatureBlob.length);
//             const signatureBytes = new Uint8Array(signatureBlob);
// 
//             const r = ethers.utils.hexlify(signatureBytes.slice(0, 32));
//             const s = ethers.utils.hexlify(signatureBytes.slice(32, 64));
// 
//             // 尝试不同的 v 值（0/1/27/28）来拼接签名并发送
//             const tryVs = [0, 1, 27, 28];
//             let lastError: any = null;
//             for (const v of tryVs) {
//                 try {
//                     const signature = ethers.utils.joinSignature({ r, s, v });
//                     const signedSerialized = ethers.utils.serializeTransaction(tx, signature);
//                     cc.log("ETHManager: trying send with v=", v, signedSerialized);
//                     const response = await this.provider.sendTransaction(signedSerialized);
//                     await response.wait();
//                     return `Transaction confirmed: ${response.hash}`;
//                 } catch (e: any) {
//                     cc.warn("ETHManager: send attempt failed for v=", v, e && e.message ? e.message : e);
//                     lastError = e;
//                     // try next v
//                 }
//             }
//             // 如果都失败，抛出最后的错误
//             throw lastError || new Error('ETHManager: failed to send signed transaction');
//         } catch (e: any) {
//             console.error(e);
//             throw e;
//         }
//     }
// 
// }
