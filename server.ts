import { GraphQLServer } from "graphql-yoga";
import { prisma } from "./generated/prisma-client";
import axios from "axios";

const typeDefs = `
  type Message{
    id: String!
    text: String!
  }
  type Query {
    messages: [Message!]!
  }
  type Mutation {
    sendMessage(text:String!): Message!
  }
  type Subscription {
    newMessage: Message!
  }
`;

const TOKEN = "ExponentPushToken[hdnzzeC_FYfTWpwHRYExjy]";

const resolvers = {
  Query: {
    messages: () => prisma.messages()
  },
  Mutation: {
    sendMessage: async (_, { text }) => {
      const { data } = await axios.post(
        "https://exp.host/--/api/v2/push/send",
        {
          to: TOKEN,
          title: "새로운 메시지 입니다!",
          body: text,
          badge: 1
        }
      );
      console.log(data);
      return prisma.createMessage({
        text
      });
    }
  },
  Subscription: {
    newMessage: {
      subscribe: () => prisma.$subscribe.message().node(),
      resolve: (payload) => payload
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() =>
  console.log("✅😤Server is running on http://localhost:4000")
);
