import { ApolloServer, gql } from 'apollo-server'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { quotes, users } from './fakedb.js'

const typeDefs = gql`
   type Query{
       users:[User] 
       quotes:[Quote]
       user(id:ID!):User
       quote(by:ID!):Quote
   }  
    type User{
        id:ID
        firstName:String
        lastName:String
        email:String
        quotes:[Quote]
    }
    type Quote{
        name:String
        by:ID
        users:[User]
    }
`;

const resolvers = {
    Query: {
        users: () => users,
        quotes: () => quotes,
        user:(_,{id})=>users?.find((user)=>user?.id === id),
        quote:(_,{by})=>quotes?.find((quote)=>quote?.by === by)
    },

    // Filter Quote by users (user ni andar quote jota chhe atle)
    User:{
        quotes:(singleUser)=>quotes.filter((singleQuote)=>singleUser?.id === singleQuote?.by),
    },

    // Filter User by quotes (Quote ni andar User ni detail joti chhe atle)
    Quote:{
        users:(singleQuote)=>users.filter((singleUser)=>singleUser?.id === singleQuote?.by),
    }
}


const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground()
    ]
});

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});