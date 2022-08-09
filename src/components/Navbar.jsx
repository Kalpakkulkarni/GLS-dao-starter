import sdk from "../scripts/1-initialize-sdk"
import { useAddress } from "../App"

const Navbar = () => {
    const address = useAddress()
    return (
        <>
            <nav id="navbar-main" className="navbar-top navbar-dark text-dark navbar navbar-expand-md">
                <div className="container-fluid"><a className="h2 mb-0 text-dark text-uppercase d-none d-lg-inline-block"
                    href="/">GLS DAO</a>
                    <ul className="align-items-center text-dark d-none d-md-flex navbar-nav">
                        <li className="dropdown nav-item"><a aria-haspopup="true" href="#" className="pr-0 nav-link" aria-expanded="false">
                            <div className="align-items-center media"><span className="avatar avatar-sm rounded-circle bg-warning"></span>
                                <div className="ml-2 d-none d-lg-block media"><span className="mb-0 text-dark text-sm font-weight-bold">{address}</span>
                                </div>
                            </div>
                        </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}
export default Navbar