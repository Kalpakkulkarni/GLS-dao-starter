import { useAddress } from "@thirdweb-dev/react"
import { useEffect, useState } from "react"
import sdk from "../scripts/1-initialize-sdk"
import { AddressZero } from "@ethersproject/constants";

import { Contract, ethers } from "ethers"
import { VoteType } from "@thirdweb-dev/sdk"

const Vote = () => {
    const address = useAddress()
    const voteContract = sdk.getVote("0xfAC682809EefB4194DF53d4D89f75995768ECb0E")
    const tokenContract = sdk.getToken("0x0FF24E4774735e6704f474765fe76E6aF30D1e76")

    const [proposals, setProposals] = useState([]);
    const [isVoting, setIsVoting] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);

    // get all proposals from the contract
    useEffect(() => {
        const getAllProposals = async () => {
            try {
                const proposals = await voteContract.getAll()
                setProposals(proposals)
            }
            catch (error) {
                console.error("failed to get proposals", error)
            }
        }
        getAllProposals()
    }, [])

    // check if the current user has voted or not.

    useEffect(() => {

        if (!proposals.length) {
            return
        }

        const checkIfUserHasVoted = async () => {
            try {
                const hasVoted = await voteContract.hasVoted(proposals[0].proposalId)
                setHasVoted(hasVoted)
                if (hasVoted) {
                    console.log("user has already voted...")
                }
                else {
                    console.log("user has not voted yet...")
                }
            }
            catch (error) {
                console.error("Failed to check if user has voted...", error)
            }
        }
        checkIfUserHasVoted();
    }, [proposals, address, voteContract])

    return (
        <section className="section section-lg">
            <div className="row">
                <div className="col-md-12 text-center p-2 m-3 text-light">
                    <h1>Voting and Proposals</h1>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault()
                            e.stopPropagation()

                            setIsVoting(true)

                            const votes = proposals.map((proposal) => {
                                const voteResult = {
                                    proposalId: proposal.proposalId,
                                    vote: 2
                                }

                                proposal.votes.forEach((vote) => {
                                    const elem = document.getElementById(proposal.proposalId + "-" + vote.type)
                                    if (elem.checked) {
                                        voteResult.vote = vote.type
                                        return
                                    }
                                })
                                return voteResult
                            })

                            try {
                                const delegation = await tokenContract.getDelegationOf(address)
                                if (delegation === AddressZero) {
                                    await tokenContract.delegateTo(address)
                                }

                                try {
                                    await Promise.all(
                                        votes.map(async ({ proposalId, vote: _vote }) => {
                                            const proposal = await voteContract.get(proposalId)

                                            if (proposalId.state === 1) {
                                                return voteContract.vote(proposalId, _vote)
                                            }
                                            return
                                        })
                                    )
                                    try {
                                        await Promise.all(
                                            votes.map(async ({ proposalId }) => {
                                                const proposal = await voteContract.get(proposalId)

                                                if (proposal.state === 4) {
                                                    return voteContract.execute(proposalId)
                                                }
                                            })
                                        )
                                        setHasVoted(true)
                                        console.log("successfully Voted...")
                                    }
                                    catch (error) {
                                        console.error("failed to execute votes...", error)
                                    }
                                }
                                catch (error) {
                                    console.error("failed to vote...", error)
                                }

                            }
                            catch (error) {
                                console.error("failed to Delegate tokens...", error)
                            }
                            finally {
                                setIsVoting(false)
                            }
                        }
                        }>


                        <div className="row offset-1 pl-5">
                            {proposals.map((proposal) => (
                                <div key={proposal.proposalId} className="col-md-5 card_vote p-5 m-2">
                                    <h5>{proposal.description}</h5>
                                    <div className="row d-flex justify-content-between">
                                        {proposal.votes.map(({ type, label }) => (
                                            <div key={type} className="col-md-4">

                                                <input
                                                    type="radio"
                                                    id={proposal.proposalId + "-" + type}
                                                    name={proposal.proposalId}
                                                    value={type}
                                                    //default the "abstain" vote to checked
                                                    defaultChecked={type === 2}
                                                />
                                                <span htmlFor={proposal.proposalId + "-" + type}>
                                                    {label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center pt-3">
                            <button className="text-center btn btn-primary ml-5 offset-3" disabled={isVoting || hasVoted} type="submit">
                                {isVoting
                                    ? "Voting..."
                                    : hasVoted
                                        ? "You Already Voted"
                                        : "Submit Votes"}
                            </button>
                        </div>
                        {!hasVoted && (
                            <small>
                                This will trigger multiple transactions that you will need to
                                sign.
                            </small>
                        )}
                    </form>
                </div>
            </div>
        </section>
    )
}
export default Vote