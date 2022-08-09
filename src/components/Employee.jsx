import React from 'react'
import abi from '../assets/EdiDemo.json'
import { ethers } from 'ethers'

const Employee = () => {
    const contractAddress = "0x6e729E2de7ED3abe627839D0ff179596C26A31Bf"
    const contractABI = abi.abi

    const getEmployee = async () => {
        try {

            const { ethereum } = window

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const ediContract = new ethers.Contract(contractAddress, contractABI, signer)

                const data = await ediContract.returnAll()
                // const data = await ediContract.getAllEmployees()
                console.log("Data from the contract", data)
                // return data;
            }
        } catch (error) {
            console.error(error)
        }
    }

    const addEmployee = async () => {
        try {

            const { ethereum } = window

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const ediContract = new ethers.Contract(contractAddress, contractABI, signer)
                const dataArr = await ediContract.addEmployee("sadsad", "dsadsa", true)
                console.log("Data from the contract", dataArr)
                // console.log("details", status, firstName, lastName, id)
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <button onClick={getEmployee}>GET</button>
            <button onClick={addEmployee}>ADD</button>
        </div>
    )
}

export default Employee