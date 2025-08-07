// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NftMarket is ERC721URIStorage, Ownable {
    struct NftItem {
        uint tokenId;
        uint price;
        address creator;
        bool isListed;
    }

    uint public listingPrice = 0.025 ether;

    uint private _listedItems;
    uint private _tokenIds;
    uint256[] private _allNfts;

    mapping(uint => NftItem) private _idToNftItem;
    mapping(string => bool) private _usedTokenURIs;
    mapping(address => mapping(uint => uint)) private _ownedTokens;

    event NftItemCreated(
        uint tokenId,
        uint price,
        address creator,
        bool isListed
    );

    constructor() ERC721("ToxNFT", "NFT") Ownable(msg.sender) {}

    // 修改上架价格
    function setListingPrice(uint newPrice) external onlyOwner {
        require(newPrice > 0, "newPrice must be at least 1 wei ");
        listingPrice = newPrice;
    }

    // 获取对应tokenId 的nft
    function getNftItem(uint tokenId) public view returns (NftItem memory) {
        return _idToNftItem[tokenId];
    }

    // 获取上架数量
    function listedItemsCount() public view returns (uint) {
        return _listedItems;
    }

    // 判断当前URI是否已经被使用
    function isUsedURI(string memory tokenURI) public view returns (bool) {
        return _usedTokenURIs[tokenURI];
    }

    function totalSupply() public view returns (uint) {
        return _allNfts.length;
    }

    // 获取token
    function tokenByIndex(uint index) public view returns (uint) {
        require(index < totalSupply(), "Index out of bounds");
        return _allNfts[index];
    }

    // 获取Nft的归属者
    function tokenOfOwnerByIndex(
        address owner,
        uint index
    ) public view returns (uint) {
        require(index < ERC721.balanceOf(owner), "Index out of bounds");
        return _ownedTokens[owner][index];
    }

    // 获取所有在售nft信息
    function getAllNftOnSale() public view returns (NftItem[] memory) {
        uint allItemsCounts = totalSupply();
        uint currentIndex = 0;
        NftItem[] memory items = new NftItem[](_listedItems);

        for (uint i = 0; i < allItemsCounts; ++i) {
            uint tokenId = tokenByIndex(i);
            NftItem storage item = _idToNftItem[tokenId];

            if (item.isListed == true) {
                items[currentIndex] = item;
                currentIndex += 1;
            }
        }
        return items;
    }

    //获取用户nft
    function getOwnedNfts() public view returns (NftItem[] memory) {
        uint ownedItemsCount = ERC721.balanceOf(msg.sender);
        NftItem[] memory items = new NftItem[](ownedItemsCount);

        for (uint i = 0; i < ownedItemsCount; ++i) {
            uint tokenId = tokenByIndex(i);
            NftItem storage item = _idToNftItem[tokenId];
            items[i] = item;
        }
        return items;
    }

    // 铸造token
    function mintToken(
        string memory tokenURI,
        uint price
    ) public payable returns (uint) {
        require(!isUsedURI(tokenURI), "tokenURI is used");
        require(
            msg.value == listingPrice,
            "price must be equal to listing price"
        );

        _tokenIds++;
        _listedItems++;

        uint newTokenId = _tokenIds;
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        _createNftItem(newTokenId, price);
        _usedTokenURIs[tokenURI] = true;
        return newTokenId;
    }

    function _createNftItem(uint tokenId, uint price) private {
        require(price > 0, "price must be at least 1 wei");
        _idToNftItem[tokenId] = NftItem(tokenId, price, msg.sender, false);
        emit NftItemCreated(tokenId, price, msg.sender, false);
    }

    // 购买nft
    function buyNft(uint tokenId) public payable {
        uint price = _idToNftItem[tokenId].price;
        address owner = ERC721.ownerOf(tokenId);

        require(msg.sender != owner, "You alread own this Nft");
        require(msg.value == price, "Please submit the asking price");

        // 下架
        _idToNftItem[tokenId].isListed = false;
        _listedItems--;

        _transfer(owner, msg.sender, tokenId);
        payable(owner).transfer(msg.value);
    }

    // 上架
    function onSale(uint tokenId, uint price) public payable {
        require(
            ERC721.ownerOf(tokenId) == msg.sender,
            "You are not own of this Nft"
        );
        require(_idToNftItem[tokenId].isListed == false, "this nft is listed");
        require(price > 0, "price must be at least 1 wei");

        _idToNftItem[tokenId].isListed = true;
        _idToNftItem[tokenId].price = price;
        _listedItems++;
    }

    // 考虑是否增加删除NFT功能


    // 众筹
    

}
