const gql = require('graphql-tag');

const typeDefs = gql`
    type BlogPost {
        title: String
        body: String
        genre: String
        postImage: String
        error: String
    }

    type User {
        username: String
        email: String
        password: String
    }

    type Aggregate {
        count: String
    }

    type BlogPosts {
        nodes: [BlogPost]
        aggregate: Aggregate
    }

    type SignInResponse {
        token: String
        error: String
    }

    type SignUpResponse {
        token: String
        error: String
    }

    type Query {
        getBlogPosts: BlogPosts
        getBlogPost(genre: String): BlogPost
        getUser(email: String!): User
        getUsers: [User]
    }

    type Mutation {
        addBlogPost(title: String!, body: String!, postImage: String, genre: String!): BlogPost
        signUp(email: String!, username: String, password: String!, role: String): SignUpResponse
        signIn(email: String!, password: String!): SignInResponse
    }
`

module.exports = {
    typeDefs,
}