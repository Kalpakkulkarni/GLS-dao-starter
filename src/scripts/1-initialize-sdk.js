import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from 'ethers'
// Importing and configuring our .env file that we use to securely store our environment variables

// RPC URL, we'll use our Alchemy API URL from our .env file.
const provider = new ethers.providers.JsonRpcProvider("https://eth-rinkeby.alchemyapi.io/v2/DJl-h0qeLDMV07HZDA5sVKL-RNGF12ig");
// Your wallet private key. ALWAYS KEEP THIS PRIVATE, DO NOT SHARE IT WITH ANYONE, add it to your .env file and do not commit that file to github!
const wallet = new ethers.Wallet("e21dfa1b4ab3a0e599137c9e3ae93a0b2eb458c18872469e55a113c04b93e67b", provider);
const sdk = new ThirdwebSDK(wallet);

(async () => {
    try {
        const address = await sdk.getSigner().getAddress();
        console.log("SDK initialized by address:", address)
        // const contract = await sdk.getContract("0x6aea05d774192FA46b36251EeB682D02D089B6c2")
        // const rolesAndMembers = await contract.roles.getAll()
        // console.log("roles of users",rolesAndMembers)
    } catch (err) {
        console.error("Failed to get apps from the sdk", err);
        process.exit(1);
    }
})();

// We are exporting the initialized thirdweb SDK so that we can use it in our other scripts
export default sdk;