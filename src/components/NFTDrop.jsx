import { useEffect, useState, useMemo } from "react";
import { useAddress, useEditionDrop } from "@thirdweb-dev/react";
import sdk from "../scripts/1-initialize-sdk.js";

const NFTDrop = () => {
    const contract = sdk.getNFTDrop("0x871D23C719cb26904aECE488516b2d3aD6b253fA")
    const address = useAddress()
    const [listings, setListings] = useState([])
    const [memberTokenAmounts, setMemberTokenAmounts] = useState([])
    const [tokenId, setTokenId] = useState(0)
    const [memberAddresses, setMemberAddresses] = useState([]);
    const [senderAddress, setSenderAddress] = useState('')
    const editionDrop = useEditionDrop("0x3526C290F6FC7910EB8fE1e1d7945d9d2b90Ea11")


    useEffect(() => {
        const getAllNftDropListings = async () => {
            const listing = await contract.getAll()
            const roles = await contract.roles.getAll()
            const ownedNFT = await contract.getOwned(address)
            // await contract.setApprovalForAll(address, true)
            console.log(`NFT's owned by ${address} :`, ownedNFT)
            setListings(listing)
            console.log("all the listings in the marketplace", listings, listing, contract)
            console.log("roles of NFT drop contract", roles)
        }

        getAllNftDropListings()
    }, [])

    const ClickedNftData = async (list) => {
        // setSelectedNFT(list)
        setTokenId(list)
        const singleNFTData = await contract.get(list)
        console.log("selected NFT", singleNFTData)
        console.log("token id selected is", tokenId)
    }

    const transferNft = async () => {
        try {
            console.log("token id in modal", tokenId, senderAddress)
            console.log("transfer restrictons", await contract.isApproved(address, "0x75166Ce872d7f89D73031fD80F230E92842494dB"))
            // const nftTransferTx = await contract.transfer("0x2175FFb9cb23eC76F2fEe36E23658a1E3725285f", tokenId)
            // const receipt = nftTransferTx.receipt
            // console.log("Tx receipt", receipt)
        }
        catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        const getAllAddresses = async () => {
            try {
                const memberAddresses = await editionDrop.history.getAllClaimerAddresses(1);
                setMemberAddresses(memberAddresses);
                console.log("🚀 Members addresses", memberAddresses);
            } catch (error) {
                console.error("failed to get member list", error);
            }

        };
        getAllAddresses();
    }, [editionDrop.history]);


    const memberList = useMemo(() => {
        return memberAddresses.map((address) => {
            // We're checking if we are finding the address in the memberTokenAmounts array.
            // If we are, we'll return the amount of token the user has.
            // Otherwise, return 0.
            const member = memberTokenAmounts?.find(({ holder }) => holder === address);

            return {
                address,
                tokenAmount: member?.balance.displayValue || "0",
                symbol: member?.balance.symbol || "NA"
            }
        });
    }, [memberAddresses, memberTokenAmounts]);


    const shortenAddress = (str) => {
        return str.substring(0, 6) + "..." + str.substring(str.length - 4);
    };

    const burnNft = async (list) => {
        try {
            if (list.owner == address) {
                const burn = await contract.burn(list.metadata.id._hex)
                console.log("burn NFT Data", burn)
            }
            else {
                window.alert(`You are not the owner of the NFT ${list.metadata.name}`)
            }

        }
        catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <section className="section section-lg">
                <section className="section">
                    <div className="container">
                        <div class="row-grid justify-content-between row">
                            <div className="col-md-6">

                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="numbers text-center pb-5">
                                                        <i class="fa-solid fa-box-open nft_drop_logo"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-12 text-light">
                                    <div class="pl-md-5">
                                        <h1>NFT Drop</h1>
                                        <p className="pt-3">GLS-DAO's NFT drop features unique 1 to 1 ERC-721 NFT's.</p><br /><p>Discover unique and exclusive NFT collection of GLS waiting to be claimed.</p><br />
                                    </div>
                                </div>

                            </div>
                            <div className="col-md-6">
                                <iframe
                                    src="https://gateway.ipfscdn.io/ipfs/QmZ7JB3mBYxTD8McJZK8QrVAY7i9JrL3Tqu14GVaYYqnQh/nft-drop.html?contract=0x871D23C719cb26904aECE488516b2d3aD6b253fA&chainId=4&theme=dark&primaryColor=orange&secondaryColor=pink"
                                    className="editionDrop_card editionDrop_frame"
                                    frameBorder="0"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
        </>

    )
}
export default NFTDrop