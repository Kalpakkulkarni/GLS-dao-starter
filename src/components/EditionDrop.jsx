import { useEffect, useState } from "react";
import { useAddress } from "@thirdweb-dev/react";
import sdk from "../scripts/1-initialize-sdk.js";

const Marketplace = () => {

    const contract = sdk.getEditionDrop("0x3526C290F6FC7910EB8fE1e1d7945d9d2b90Ea11");
    const [listings, setListings] = useState([])
    const address = useAddress()
    const [claimConditionStatus, setClaimConditionStatus] = useState(false)


    useEffect(() => {
        const getAllListings = async () => {
            const listing = await contract.getAll()
            const ownedNFT = await contract.getOwned(address)
            console.log(`NFT's owned by ${address} :`, ownedNFT)
            setListings(listing)
            console.log("all the listings in the marketplace", listings, listing, contract)
        }

        getAllListings()
    }, [])

    const purchaseNFT = async (list_id) => {
        try {
            const listId = list_id
            const quantity = 1
            console.log("listing id and quantity", listId, quantity)
            const result = await contract.buyoutListing(listId, quantity)
            console.log("result", result)
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
                            <div class="col-md-5">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="numbers text-center pb-5">
                                                        <i class="fa-solid fa-parachute-box coin"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6 text-light">
                                <div class="pl-md-5">
                                    <h1>Edition Drop</h1>
                                    <p className="pt-3">GLS-DAOs edition drop allows interested users to become members after claiming NFTs by minting them into their wallets having met certain conditions.</p><br /><p>Discover unique and exclusive NFT collection of GLS waiting to be claimed.</p><br /><a
                                        class="font-weight-bold text-info mt-5">See Below</a>
                                </div>
                            </div>
                        </div>
                        <div className="row pt-4">
                            {
                                listings.map((list, index) => {
                                    return (
                                        <div className="col-md-4 p-4 editionDrop_card">
                                            <iframe
                                                className="editionDrop_frame"
                                                height="100%"
                                                src={"https://gateway.ipfscdn.io/ipfs/QmZ7JB3mBYxTD8McJZK8QrVAY7i9JrL3Tqu14GVaYYqnQh/edition-drop.html?contract=0x3526C290F6FC7910EB8fE1e1d7945d9d2b90Ea11&chainId=4&tokenId=" + (list.metadata.id._hex).toString()}
                                                frameBorder="0"
                                            ></iframe>
                                        </div>
                                    )
                                })
                            }

                        </div>
                    </div>
                </section>
            </section>
        </>
        // <>
        //     <div className="row">
        //         <div className="col-md-12 text-center">
        //             <h1>Edition Drop</h1>
        //         </div>
        //     </div>
        //     <div className="row">
        //         {
        //             listings.map((list, index) => {
        //                 return (
        //                     <div className="col-md-3 p-4 editionDrop_card">
        //                         <iframe
        //                             className="editionDrop_frame"
        //                             height="100%"
        //                             src={"https://gateway.ipfscdn.io/ipfs/QmZ7JB3mBYxTD8McJZK8QrVAY7i9JrL3Tqu14GVaYYqnQh/edition-drop.html?contract=0x3526C290F6FC7910EB8fE1e1d7945d9d2b90Ea11&chainId=4&tokenId=" + (list.metadata.id._hex).toString() + "&theme=dark&primaryColor=orange"}
        //                             frameBorder="0"
        //                         ></iframe>
        //                     </div>
        //                 )
        //             })
        //         }

        //     </div>
        // </>
    )
}
export default Marketplace