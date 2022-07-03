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
        image_data: String
        external_url: String
        description: String
        name: String
        attributes: [attributes]
        background_color: String
        animation_url: String
        youtube_url: String
    }

    type marketdata {
        price: String
        owner: String
        startTime: String
        endTime: String
        bidder: String
        bidPrice: String
        prices: [Int]
        owners: [String]
        bidders: [String]
        bidPrices: [String]
        bidTime: [String]
    }

    type item {
        tokenID: Int
        collectionAddress: String
        likes: [String]
        creator: String
        owner: String
        metadata: metadata
        marketdata: marketdata
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
    }

    type Query {
        getAllNFTs(address : String): [item]
        getNFTs(address : String): [item]
        getCollectionNFTs: [NFTs]
        getCollectionNFT(address : String): [NFTs]
        getUserInfo(account: String): User
        getUsersInfo: [User]
    }
`;  

module.exports = { typeDefs };
