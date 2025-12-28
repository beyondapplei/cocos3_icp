import { DFX_NETWORK, II_CANISTER_ID_LOCAL } from "./DefData";

const globalAuth = (window as any).DfinityAuthClient;
console.log("LoginManager: globalAuth is", globalAuth);
const AuthClient = globalAuth ? globalAuth.AuthClient : null;
const LocalStorage = globalAuth ? globalAuth.LocalStorage : null;

export default class LoginManager {
    public static readonly Instance: LoginManager = new LoginManager();
    private constructor() {}

    private authClient: any = null;

    private getBrowserLocalStorage(): Storage | null {
        try {
            const g: any = (typeof globalThis !== 'undefined')
                ? globalThis
                : (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : {}));
            return (g && g.localStorage) ? (g.localStorage as Storage) : null;
        } catch {
            return null;
        }
    }

    private clearAuthClientStorage(): void {
        const ls = this.getBrowserLocalStorage();
        if (!ls) return;

        // auth-client 的默认 LocalStorage 前缀是 "ic-"，key 为 identity/delegation/iv
        const keys = [
            'ic-identity',
            'ic-delegation',
            'ic-iv',
            // 兼容某些环境/旧版本未加前缀的情况
            'identity',
            'delegation',
            'iv',
        ];
        for (let i = 0; i < keys.length; i++) {
            try {
                ls.removeItem(keys[i]);
            } catch {
                // ignore
            }
        }
    }

    Init() {
        // 预先初始化 AuthClient，否则可能 AuthClient not ready
        // 特别是在 Web Build 下更容易遇到此问题
        
        // Force clear storage once to fix potential identity mismatch issues from previous builds
        // This can be removed later
        // Bump marker when auth storage/key strategy changes.
        if (!this.getBrowserLocalStorage()?.getItem('ic-identity-cleared-v3')) {
            this.clearAuthClientStorage();
            this.getBrowserLocalStorage()?.setItem('ic-identity-cleared-v3', 'true');
            console.log("LoginManager: Cleared old identity storage.");
        }

        void this.ensureAuthClient().catch(() => {
            // UI 层自行提示；这里不抛出
        });
    }



    public async ensureAuthClient(): Promise<any> {
        if (this.authClient) return this.authClient;

        if (!AuthClient) {
            console.error("LoginManager: AuthClient missing. Ensure lib3/icp-sdk-auth-client.js is loaded before application.js");
            return null;
        }

        // Cocos 环境下 IndexedDB 可能不可用/数据损坏；强制使用 LocalStorage 更稳。
        const createClient = async () => {
            if (LocalStorage) {
                return await AuthClient.create({
                    storage: new LocalStorage('ic-', this.getBrowserLocalStorage() || undefined),
                    // With LocalStorage, prefer Ed25519 because it can be persisted as a string.
                    // Default ECDSA uses CryptoKeyPair, which is not a safe fit for localStorage.
                    keyType: 'Ed25519',
                });
            }
            return await AuthClient.create();
        };

        try {
            const client = await createClient();
            if (!client) throw new Error('AuthClient creation failed');
            this.authClient = client;
            return this.authClient;
        } catch (e: any) {
            const msg = (e && e.message) ? String(e.message) : String(e);
            // 常见：历史缓存 delegation/identity 损坏导致 DelegationChain.fromJSON 报错
            // 或者是 Principal checksum 校验失败 (e.g. "Principal ... does not have a valid checksum")
            if (msg.indexOf('Invalid hexadecimal string') >= 0 || 
                msg.indexOf('DelegationChain') >= 0 || 
                msg.indexOf('valid checksum') >= 0) {
                this.clearAuthClientStorage();
                const client = await createClient();
                if (!client) throw new Error('AuthClient creation failed');
                this.authClient = client;
                return this.authClient;
            }
            throw e;
        }

        // unreachable
    }

    async isAuthenticated(): Promise<boolean> {
        const client = await this.ensureAuthClient();
        return !!(await client.isAuthenticated());
    }

    async getIdentity(): Promise<any> {
        const client = await this.ensureAuthClient();
        return client.getIdentity();
    }

    getPrincipalText(): string | null {
        if (!this.authClient) return null;
        try {
            const identity = this.authClient.getIdentity();
            // Use the identity's principal directly to avoid mixing Principal implementations
            // between bundled (UMD) SDK and npm modules in build output.
            return identity?.getPrincipal?.()?.toText?.() ?? null;
        } catch {
            return null;
        }
    }

    private formatErrorMessage(err: any): string {
        if (!err) return 'Unknown error';
        if (typeof err === 'string') return err;
        if (err instanceof Error && err.message) return err.message;
        if (typeof err.message === 'string' && err.message) return err.message;
        if (typeof err.error === 'string' && err.error) return err.error;
        try {
            return JSON.stringify(err);
        } catch {
            return String(err);
        }
    }



    login(onSuccessCallBack?: () => void, onError?: (err: any) => void): void {
        if (!this.authClient) {
            if (onError) onError(new Error("AuthClient not ready"));
            return;
        }

        let iiUrl = '';
        if (DFX_NETWORK === 'local') {
            iiUrl = `http://${II_CANISTER_ID_LOCAL}.localhost:4943/#authorize`;
        } else {
            iiUrl = 'https://identity.ic0.app/#authorize';
        }

        this.authClient.login({
            identityProvider: iiUrl,
            onSuccess: () => {
                if (onSuccessCallBack) onSuccessCallBack();
            },
            onError: (err: any) => {
                const msg = `Login failed: ${this.formatErrorMessage(err)}`;
                if (onError) onError(new Error(msg));
            },
        });
    }
}
