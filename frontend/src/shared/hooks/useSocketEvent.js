import { useEffect, useState } from "react";

const useSocketEvent = (socket, eventName, callback) => {
  useEffect(() => {
    const handleSocketEvent = (data) => {
      console.log(`Received from backend (${eventName}):`, data);
      callback(data);
    };

    socket.on(eventName, handleSocketEvent);

    return () => {
      // Unsubscribe from the socket event when the component unmounts
      socket.off(eventName, handleSocketEvent);
    };
  }, [socket, eventName, callback]);
};

export { useSocketEvent };
