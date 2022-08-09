import sdk from "../scripts/1-initialize-sdk.js";
import { useEffect, useState } from "react";
import { useAddress } from '@thirdweb-dev/react';
import coinLogo from '../assets/img/etherum.png'

const Governance = () => {
    let balance = '100sadsa0'
    const userAddress = useAddress()
    const [walletBalance, setWalletBalance] = useState('')
    const [tokenSupply, setTokenSupply] = useState('')
    const [nftOwnedByUser, setNftOwnedByUser] = useState('')
    const [percentage, setPercentage] = useState('')
    const [showDetails, setShowDetails] = useState(true)
    var valueMultiplier = 0.20

    const toggleDetails = () => {
        setShowDetails(value => !value);
        console.log("toggle details", showDetails)
    }

    useEffect(() => {
        toggleDetails()
    }, [setShowDetails])

    async function getGovernanceDetails() {
        const contract = sdk.getToken("0x0FF24E4774735e6704f474765fe76E6aF30D1e76");
        const editionDropContract = sdk.getEditionDrop("0x3526C290F6FC7910EB8fE1e1d7945d9d2b90Ea11")

        balance = await contract.totalSupply()
        setTokenSupply(balance.displayValue)
        const prevTotalSupply = localStorage.getItem("totalSupply")
        console.log("previous total supply", prevTotalSupply)
        console.log("new total supply", tokenSupply)

        const currentWalletBalance = await contract.balanceOf(userAddress)
        setWalletBalance(currentWalletBalance.displayValue)

        const walletBalanceValue = walletBalance * valueMultiplier;

        console.log("wallet balance value in INR", Math.round(walletBalanceValue))

        console.log("wallet balance wariabvle in usestate", walletBalance)
        console.log("total token supply", balance.displayValue)

        const perc = (currentWalletBalance.displayValue / balance.displayValue) * 100
        setPercentage(perc)

        if (prevTotalSupply != tokenSupply) {
            console.log("check condition for 2% increment")
            const twoPercentDiff = ((1 / 100) * prevTotalSupply)
            console.log("differnce of 2% is", twoPercentDiff)
            if ((tokenSupply - prevTotalSupply) == twoPercentDiff) {
                console.log("increment the value of the token")
                valueMultiplier += 0.05;
            }
            else {
                console.log("dont increment the value of the token", tokenSupply - prevTotalSupply)
                valueMultiplier = 0.20;
            }
        }

        const nftOwned = await editionDropContract.getOwned(userAddress)
        setNftOwnedByUser(nftOwned.length)


    }
    useEffect(() => {
        getGovernanceDetails()
        // walletBalance, tokenSupply, nftOwnedByUser, percentage
    }, [])

    return (
        <>
            <section className="section section-lg gov_details">
                <section className="section">
                    <div className="container">
                        <div class="row-grid justify-content-between row">

                            {
                                showDetails ?
                                    <>
                                        <div className="col-md-5">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="card-body p-3 m-3 details_body">
                                                        <div class="card-group m-2">
                                                            <div class="card p-2 m-3">
                                                                {/* <img class="card-img-top" data-src="holder.js/100x180/" alt="Card image cap" /> */}
                                                                <div class="card-body">
                                                                    <h4 class="card-title">Title</h4>
                                                                    <p class="card-text">Text</p>
                                                                </div>
                                                            </div>
                                                            <div class="card p-2 m-3">
                                                                {/* <img class="card-img-top" data-src="holder.js/100x180/" alt="Card image cap" /> */}
                                                                <div class="card-body">
                                                                    <h4 class="card-title">Title</h4>
                                                                    <p class="card-text">Text</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="card-group m-2">
                                                            <div class="card p-2 m-3">
                                                                {/* <img class="card-img-top" data-src="holder.js/100x180/" alt="Card image cap" /> */}
                                                                <div class="card-body">
                                                                    <h4 class="card-title">Title</h4>
                                                                    <p class="card-text">Text</p>
                                                                </div>
                                                            </div>
                                                            <div class="card p-2 m-3">
                                                                {/* <img class="card-img-top" data-src="holder.js/100x180/" alt="Card image cap" /> */}
                                                                <div class="card-body">
                                                                    <h4 class="card-title">Title</h4>
                                                                    <p class="card-text">Text</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                    : <div class="col-md-5">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="numbers text-center pb-5">
                                                                <i class="fa-brands fa-ethereum coin"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            }



                            <div class="col-md-6 gov_details">
                                <div class="pl-md-5">
                                    <h1>Governance <br />Details</h1>
                                    <p className="pt-3">GLS - DAO works on a simple governance by consensus model. Individuals can pool in their resources and share the ownership by way of stake in the DAO.</p><br /><p>It does not have any central leadership. Decisions get made from the bottom-up, governed by its members.</p><br /><a
                                        class="font-weight-bold text-info mt-5" onClick={toggleDetails}>{showDetails ? "Hide Details" : "Show Details"}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </section>

            <section className="section section-lg member_details">
                <section className="section">
                    <div className="container">
                        <div class="row-grid justify-content-between row">
                            <div class="col-md-5">
                                <div class="pl-md-5">
                                    <h1>Member <br />Details</h1>
                                    <p className="pt-3">GLS-DAO is governed and managed by its members. The DAO's control is spread across its members. </p><br /><p>Members can use their governance tokens to vote on any topic related to any fund allocation, constitution amendment proposal, etc.</p><br /><a
                                        className="font-weight-bold text-info mt-5 member_details_view">View Details</a>
                                </div>
                            </div>
                            <div class="col-md-6 pt-5">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="numbers text-center pb-5">
                                                        <i class="fa-solid fa-users member"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
            {/* <div className="row">
                <div className="col-md-6 p-4 governance">
                    <div className="mb-4 mb-xl-0">
                        <div className="card-body">
                            <div className="row">
                                <div className="col">
                                    <h2 className="text-uppercase text-muted mb-0 card-title">User Details</h2>
                                </div>
                            </div>
                            <br />
                            <div className="row">
                                <div className="col-md-9">
                                    <span
                                        className="h4 font-weight-bold mb-0">User Address : </span><span>{userAddress}</span>
                                </div>
                                <br />
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <span
                                        className="h4 font-weight-bold mb-0">Wallet Balance : </span><span>{walletBalance}</span>
                                </div>
                                <br />
                                <div className="col-md-6 text-center">
                                    <span
                                        className="h4 font-weight-bold mb-0">% Owned : </span><span>{percentage}</span>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-3">
                                    <span
                                        className="h4 font-weight-bold mb-0">NFT Owned : </span><span>{nftOwnedByUser}</span>
                                </div>
                            </div>
                            <p className="mt-3 mb-0 text-muted text-sm"><span className="text-success mr-2"><i className="fa fa-arrow-up"></i> 3.48%</span>
                                <span className="text-nowrap">Since last month</span></p>
                        </div>

                    </div>
                </div>
            </div> */}
        </>
    )


}
export default Governance