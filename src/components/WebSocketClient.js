import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const WebSocketClient = ({ onMessage }) => {
  const clientRef = useRef(null);

  useEffect(() => {
    // Create a new SockJS connection
    const socket = new SockJS('http://localhost:8083/ws');

    // Create STOMP client
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str), // Optional: Debug logs
      reconnectDelay: 5000,             // Auto-reconnect after 5 seconds
      onConnect: () => {
        console.log('WebSocket connected');

        

        //Subscribe to /topic/simulation for news data
        client.subscribe('/topic/simulation', (message) => {
            console.log('Received message:', message);
          if (message.body) {
            try {
              const parsed = JSON.parse(message.body);
              const finalMessage = {
                "messageType": "news",
                "message": parsed
              }
              onMessage(finalMessage);
            } catch (err) {
              console.error('Error parsing WebSocket message:', err);
            }
          }
        });

        //Subscribe to /topic/prices for prices data
        client.subscribe('/topic/prices', (pricesMessage) => {
            console.log('Received message:', pricesMessage);
          if (pricesMessage.body) {
            try {
              const pricesParsed = JSON.parse(pricesMessage.body);
              const finalMessage = {
                "messageType": "prices",
                "message": pricesParsed
              }
              onMessage(finalMessage);

            } catch (err) {
              console.error('Error parsing WebSocket message:', err);
            }
          }
        });
        
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers['message']);
        console.error('Details:', frame.body);
      }
    });

    client.activate();  // Initiate connection
    clientRef.current = client;

    return () => {
      if (clientRef.current && clientRef.current.active) {
        clientRef.current.deactivate();  // Cleanly disconnect on unmount
        console.log('WebSocket disconnected');
      }
    };
  }, [onMessage]);

 

  return null; // This component doesn't render anything
};

export default WebSocketClient;
