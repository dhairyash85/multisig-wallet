// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";


// Uncomment this line to use console.log
// import "hardhat/console.sol";
contract MultisigWallet is Initializable {
    uint256 _requiredSignatures;
    address[] private _owners;
    function initialize(address[] memory owners, uint256 requiredSignatures) public initializer {
        require(requiredSignatures > 0, "Required signatures must be greater than 0");
        require(owners.length >= requiredSignatures, "Not enough owners");
        require(isAllAddress(owners), "Invalid owner address");
        _owners=owners;
        _requiredSignatures=requiredSignatures;
    }
    
    function isAllAddress(address[] memory owners)pure private returns(bool){
        for(uint i=0; i<owners.length; i++){
            if(owners[i]!=address(owners[i])){
                return false;
            }
        }
        return true;
    }
    // function getMessageHash(address _to, uint256 _amount, string memory _message) public pure returns()
    function recoverSigner(bytes32 _ethSignedMessage, bytes memory signature) private pure returns(address){
        (bytes32 r, bytes32 s, uint8 v)=splitSignature(signature);
        return ecrecover(_ethSignedMessage, v, r, s);
    }
    function splitSignature(bytes memory sig) private pure returns(bytes32 r, bytes32 s, uint8 v){
        require(sig.length==65, "Invalid Signature Length");
        assembly {
            r:= mload(add(sig, 32))
            s:= mload(add(sig, 64))
            v:= byte(0, mload(add(sig, 96)))
        }
    }
    function verify(
        address _to,
        uint256 _amount,
        string memory _message,
        bytes memory signature
    ) private view returns(bool){
        bytes32 messageHash=keccak256(abi.encodePacked(_to, _amount, _message));
        bytes32 ethSignedMessage=keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32",messageHash));
        
        return isOwner(recoverSigner(ethSignedMessage, signature));
    }
    function isOwner(address account) public view returns(bool){
        for(uint256 i=0; i<_owners.length;i++){
            if(account==_owners[i]){
                return true;
            }
        }
            return false;
    }
    function executeTransaction(address payable to, uint256 value, bytes[] memory signatures) public {
        require(address(this).balance>=value && value>0, "Invalid Value");
        uint256 validSignatures=0;
        for(uint i=0; i<signatures.length; i++){
            if(verify(to, value, "", signatures[i])){
                validSignatures++;
            }
        }
        require(validSignatures>=_requiredSignatures, "Not enough valid signatures");
        (bool success, )=to.call{value: value}("");
        require(success, "Transaction not successful");
    }

    function fundme() public payable{}

    function getOwners() public view returns(address[] memory){
        return _owners;
    } 
    function getRequiredSignatures() public view returns(uint256){
        return _requiredSignatures;
    }
    // receive() external
}

