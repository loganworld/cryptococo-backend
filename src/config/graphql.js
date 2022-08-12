const { gql } = require("apollo-server-express");

const typeDefs = gql`
    scalar Date

    type attributes {
        key: String
        value: String
    }

    type NFTmetadata {
        name: String
        description: String
        coverImage: String
        image: String
        external_url: String
        fee: Float
        fee_recipent: String
    }

    type metadata {
        image: String
        external_url1: String
        external_url2: String
        external_url3: String
        external_url4: String
        description: String
        name: String
        attributes: [attributes]
    }

    type marketdata {
        price: String
        acceptedToken: String
        owner: String
        startTime: String
        endTime: String
        bidder: String
        bidPrice: String
        prices: [String]
        tokens: [String]
        owners: [String]
        bidders: [String]
        bidPrices: [String]
        bidTokens: [String]
        bidTime: [String]
    }

    type item {
        tokenID: String
        collectionAddress: String
        likes: [String]
        creator: String
        owner: String
        metadata: metadata
        marketdata: marketdata
        isOffchain: Boolean
    }

    type NFTs {
        address: String
        metadata: NFTmetadata
        items: [item]
    }

    type User {
        address: String
        name: String
        bio: String
        email: String
        image: String
        coverimage: String
        backgroundimage: String
        follow: Int
        description: String
        privateKey: String
    }

    type Prices {
        ETHEURPrice: Float
        ETHUSDPrice: Float
        ETHJPYPrice: Float
    }

    type Query {
        getAllNFTs: [item]
        getNFTs(address: String): [item]
        getCollectionNFTs: [NFTs]
        getCollectionNFT(address: String): [NFTs]
        getUsersInfo: [User]
        getPrice: Prices
    }
`;

module.exports = { typeDefs };
