import { useMetamask } from '@thirdweb-dev/react'
import logo from '../assets/img/etherum.png'

const Landing = () => {
    const connectWallet = useMetamask()
    return (
        <>
            <div className="page-header">
                <div className="content-center">
                    <div className="row-grid justify-content-between align-items-center text-left row">
                        <div class="col-md-6 col-lg-6">
                            <h1 class="text-white">GLS-DAO</h1>
                            <p class="text-white mb-3"> Giant Leap Systems has created a DAO Playground to Mint/Trade NFTs, participate in an investement club, vote on proposals</p>
                            <div class="btn-wrapper mb-3">
                                <button className='btn btn-sm btn-primary' onClick={connectWallet}>Connect Wallet</button>
                            </div>
                        </div>
                        <div class="col-md-5 col-lg-4"><img alt="sample" class="img-fluid"
                            src={logo} /></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Landing