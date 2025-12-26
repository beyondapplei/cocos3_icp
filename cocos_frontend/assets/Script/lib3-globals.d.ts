export {};

declare global {
  // ethers UMD puts itself on global as `ethers`
  // eslint-disable-next-line no-var
  var ethers: any;

  // eslint-disable-next-line no-var
  var DfinityAgent: any;

	// eslint-disable-next-line no-var
  var DfinityAuthClient: any;
}
