import sdk from "../scripts/1-initialize-sdk"
import { useMetamask } from '@thirdweb-dev/react';
import glsLogo from '../assets/img/GLS.jpg'
import ethLogo from '../assets/img/ethlogo.gif'


const ConnectWallet = () => {
    const connectWithMetamask = useMetamask()
    return (
        <>
            <div className="header login_page bg-gradient-gls py-7 py-lg-8" style={{ height: "100vh" }}>
                <div className="container">
                    <div className="header-body text-center mb-7" style={{ margin: "10% auto" }}>
                        <div className="justify-content-center row d-flex flex-column">
                            <div className="col-md-12">
                                <img src={glsLogo} alt="" className="glsLogo_login" />
                            </div>
                            <div className="col-md-12 text-light">
                                <h1>DAO Playground</h1>
                            </div>
                            <div className="col-md-12 text-light pt-3">
                                <span>Giant Leap Systems has created a DAO Playground to Mint/Trade NFTs, </span><br />
                                <span>participate in an investement club, vote on proposals, etc.</span>
                            </div>
                            <div className="col-md-12 col-lg-12">
                                {/* <img src="../scripts/assets/GLS.jpg" /> */}
                                <div className="text-center"><button type="button" className="my-4 btn btn-primary" onClick={connectWithMetamask}>Connect Wallet</button></div>
                            </div>
                            <div className="col-md-12 text-light">
                                <a target="_blank" href="https://metamask.zendesk.com/hc/en-us/articles/360015489531-Getting-started-with-MetaMask">Don't have Metamask? click here.</a>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ConnectWallet