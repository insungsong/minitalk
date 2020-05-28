import React, { useState, useEffect } from "react";
import { ApolloProvider } from "react-apollo-hooks";
import * as Permissions from "expo-permissions";
import { Notifications } from "expo";
import client from "./apollo";
import Chat from "./Chat";

export default function App() {
  const [notificationStatus, setStatus] = useState(false);

  const ask = async () => {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    setStatus(status as any);
    console.log(status);

    try {
      let token = await Notifications.getExpoPushTokenAsync();
      console.log(token);
      Notifications.setBadgeNumberAsync(0);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    ask();
  }, []);
  return (
    <ApolloProvider client={client}>
      <Chat />
    </ApolloProvider>
  );
}
