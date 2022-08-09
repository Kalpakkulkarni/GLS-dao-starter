import { useAddress, useEditionDrop, useToken } from "@thirdweb-dev/react";
import { useEffect, useState, useMemo } from "react";
import ConnectWallet from "./components/ConnectWallet";
import EditionDrop from "./components/EditionDrop";
import Governance from "./components/Governance";
import Landing from "./components/Landing";
import Navbar from "./components/Navbar";
import NFTDrop from "./components/NFTDrop";
import Vote from "./components/Vote";
import sdk from "./scripts/1-initialize-sdk"
import { scroller } from "react-scroll";
import Employee from "./components/Employee";

const App = () => {

  const address = useAddress()
  const token = useToken("0x0FF24E4774735e6704f474765fe76E6aF30D1e76")
  const editionDrop = useEditionDrop("0x3526C290F6FC7910EB8fE1e1d7945d9d2b90Ea11")
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
  const [memberAddresses, setMemberAddresses] = useState([]);
  const [senderAddress, setSenderAddress] = useState('')
  const [tokenAmountToSend, setTokenAmountToSend] = useState('')
  const [memberNFTDetails, setMemberNFTDetails] = useState([])
  const memberNftData = {
    "supply": {
      "type": "BigNumber",
      "hex": "0x00"
    },
    "metadata": {
      "name": "DAO Member",
      "description": "GLS-DAO Membership Pass",
      "image": "https://gateway.ipfscdn.io/ipfs/QmWvLS5YYEoLnKXHx6F4HKfCkCo6KDebFDNUGqPa35tv6R/0.png",
      "external_url": "",
      "id": {
        "type": "BigNumber",
        "hex": "0x03"
      },
      "uri": "ipfs://QmY2PNzAdNLVZd1qo2okesBNY1Fbtzn9Hqcf9Vx4gcGBDz/3",
      "background_color": "",
      "attributes": [
        {
          "value": "Genesis",
          "trait_type": "exclusive"
        }
      ]
    }
  }
  console.log("Address", address)

  // check the balance of the membership token to decide the access to the DAO
  const checkBalance = async () => {
    try {
      const balance = await editionDrop.balanceOf(address, 3)
      console.log("balance of wallet", balance)
      if (balance.gt(0)) {
        setHasClaimedNFT(true)
        console.log("user has membership NFT")
      }
      else {
        setHasClaimedNFT(false)
        console.log("user does not has membership NFT")
      }
    }
    catch (error) {
      setHasClaimedNFT(false)
      console.error(error)
    }
  }

  useEffect(() => {
    if (!address) {
      return
    }
    checkBalance()
  }, [address, editionDrop])

  // if user does not has the access to the token allow the user to mint the NFT
  const mintNFT = async () => {
    try {
      setIsClaiming(true)
      await editionDrop.claim("3", 1)
      console.log("successfully Claimed membership NFT")
      setHasClaimedNFT(true)
    }
    catch (error) {
      console.error(error)
    }
    finally {
      setIsClaiming(false)
    }
  }

  // show all the members and the token amount they hold
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllAddresses = async () => {
      try {
        const memberAddresses = await editionDrop.history.getAllClaimerAddresses(3);
        setMemberAddresses(memberAddresses);
        console.log("🚀 Members addresses", memberAddresses);
      } catch (error) {
        console.error("failed to get member list", error);
      }

    };
    getAllAddresses();
  }, [hasClaimedNFT, editionDrop.history]);

  // This useEffect grabs the # of token each member holds.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllBalances = async () => {
      try {
        const amounts = await token.history.getAllHolderBalances();
        setMemberTokenAmounts(amounts);
        console.log("👜 Amounts", amounts);
      } catch (error) {
        console.error("failed to get member balances", error);
      }
    };
    getAllBalances();
  }, [hasClaimedNFT, token.history]);

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

  // function to transfer tokens from one wallet to another
  async function transferTokens() {
    console.log("transfer token data", senderAddress, tokenAmountToSend)
    console.log("sender Address", senderAddress)
    const contract = sdk.getToken("0x0FF24E4774735e6704f474765fe76E6aF30D1e76");

    try {
      await contract.transfer(senderAddress, tokenAmountToSend)
      console.log("sent")
    }
    catch (error) {

      console.log("error", error)
    }
  }

  //function to shorten the address of wallet users
  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  if (!address) {
    return (
      <div className="container-fluid">
        <ConnectWallet />
      </div>
    )
  }

  return (
    <>
      {
        hasClaimedNFT ?
          <>
            <div className="main-content">
              <div className="row">
                <div className="col-md-12 text-center">
                  <ul className="nav_top">
                    <li><a>Voting</a></li>
                    <li><a>Edition Drop</a> </li>
                    <li><a>NFT's</a> </li>
                    <li><a>Marketplace</a></li>
                    <li className="text-light ml-2 address_link">{address}</li>
                  </ul>
                </div>
              </div>
              <div className="page-header">
                <div className="content-center">
                  <div className="row-grid justify-content-between align-items-center text-left row">
                    <div class="col-md-5 col-lg-5">
                      <h1 class="text-white">GLS-DAO</h1>
                      <p class="text-white mb-3"> Giant Leap Systems has created a DAO Playground to Mint/Trade NFTs, participate in an investement club, vote on proposals</p>
                      <div class="btn-wrapper mb-3">
                        {/* <button className='btn btn-sm btn-primary'>Connect Wallet</button> */}
                      </div>
                    </div>
                    <div class="col-md-7 col-lg-7">
                      <div class="shadow card">
                        <div class="border-0 card-header bg-dark">
                          <div class="align-items-center row bg-dark text-light">
                            <div class="col">
                              <h3 class="mb-0">Members & Top Holders</h3>
                            </div>
                            <div class="col text-right"><button class="btn btn-sm btn-primary" data-toggle="modal" data-target="#transferModal">Transfer Tokens</button></div>
                          </div>
                        </div>
                        <div class="table-responsive table-dark table-bordered text-light">
                          <table class="align-items-center table-flush table">
                            <thead class="thead-dark text-light">
                              <tr>
                                <th>Address</th>
                                <th>Token Amount</th>
                                <th>Token Name</th>

                              </tr>
                            </thead>
                            <tbody className="text-light">
                              {memberList.map((member) => {
                                return (
                                  <tr key={member.address}>
                                    <td>{shortenAddress(member.address)}</td>
                                    <td>{member.tokenAmount}</td>
                                    <td>{member.symbol}</td>

                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <section className="section section-lg holders">
                <div class="row pt-3">
                  <div class="col-md-5 p-4">
                    <div class="col-md-12 text-light">
                      <div class="pl-md-5">
                        <h1>Our Top Holders <br /></h1>
                        <p className="pt-3">Get featured in the top holders and transfer your native token to the needful people.</p><br /><br />
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6 p-4">
                    <div class="shadow card">
                      <div class="border-0 card-header bg-dark">
                        <div class="align-items-center row bg-dark text-light">
                          <div class="col">
                            <h3 class="mb-0">Members & Top Holders</h3>
                          </div>
                          <div class="col text-right"><button class="btn btn-sm btn-primary" data-toggle="modal" data-target="#transferModal">Transfer Tokens</button></div>
                        </div>
                      </div>
                      <div class="table-responsive table-dark table-bordered text-light">
                        <table class="align-items-center table-flush table">
                          <thead class="thead-dark text-light">
                            <tr>
                              <th>Address</th>
                              <th>Token Amount</th>
                              <th>Token Name</th>

                            </tr>
                          </thead>
                          <tbody className="text-light">
                            {memberList.map((member) => {
                              return (
                                <tr key={member.address}>
                                  <td>{shortenAddress(member.address)}</td>
                                  <td>{member.tokenAmount}</td>
                                  <td>{member.symbol}</td>

                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    

                  </div>
                </div>
              </section> */}
              <>
                <div class="modal fade" id="transferModal" data-backdrop="true" tabindex="-1" role="dialog" aria-labelledby="modelTitleId" aria-hidden="true">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title">Transfer Token</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        <div class="row">
                          <div class="col-md-12">
                            <div class="form-group">
                              <label for="">Address of Wallet to Transfer Tokens:</label>
                              <>
                                <select class="form-control" onChange={e => setSenderAddress(e.target.value)}>
                                  {memberList.map((member) => {
                                    return (
                                      <option>{member.address}</option>
                                    );
                                  })}
                                </select>
                              </>
                              <small id="helpId" class="form-text text-muted">Name of the NFT</small>
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-12">
                            <div class="form-group">
                              <label for="">Amount of tokens:</label>
                              <input type="text"
                                class="form-control" onChange={e => setTokenAmountToSend(e.target.value)} name="" id="" aria-describedby="helpId" placeholder="" />
                              <small id="helpId" class="form-text text-muted">Set amount of tokens to transfer</small>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onClick={transferTokens}>Transfer</button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
              {/* <Landing /> */}
              {/* <Navbar /> */}
              <div>
                <Governance />
                <Vote id="voting" />
                <EditionDrop />
                <NFTDrop />
                <Employee />
              </div>
            </div></> : <>
            <div className="member_mint py-7 py-lg-8 text-light" id="nft_section">
              <div className="row">
                <div className="col-md-12 text-center">
                  <img src={memberNftData.metadata.image} alt="" className="member_mint_nft_img" />
                </div>
                <div className="col-md-12 text-center">
                  <h2 id="h2id">Mint the exclusive card to become a member</h2>
                </div>
                <div className="col-md-12 text-center">
                  <button
                    className="btn btn-primary"
                    disabled={isClaiming}
                    onClick={mintNFT}
                  >
                    {isClaiming ? "Minting..." : "Mint"}
                  </button>
                </div>
              </div>


            </div>
          </>

      }
    </>

  );
};

export { useAddress }

export default App;
