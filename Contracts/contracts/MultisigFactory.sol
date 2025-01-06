// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract MultisigFactory{
    using EnumerableSet for EnumerableSet.AddressSet;
    address public owner;
    address public implementation;
    mapping(address=>EnumerableSet.AddressSet) private ownersAddress;
    constructor(address _implementation){
        owner=msg.sender;
        implementation=_implementation;
    }
    function deployContract(bytes memory _data, address[] memory _owners) public {
        address deployedContract=Clones.clone(implementation);
        (bool success, )=deployedContract.call(_data);
        require(success, "Failed to create contract");
        bool add=false;
        for(uint i=0;i<_owners.length;i++){
            add=ownersAddress[_owners[i]].add(deployedContract);
            if(!add){
                break;
            }
        }
        require(add, "Could not register all owners");
    }

    function getWallets(address deployer) public view returns(address[] memory){
        return ownersAddress[deployer].values();
    }
}