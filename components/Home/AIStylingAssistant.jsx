import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from './AIStylingAssistant.module.css';

const AIStylingAssistant = ({ onClose }) => {
  const [stage, setStage] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchParams, setSearchParams] = useState([]);
  const chatRef = useRef(null);
  const router = useRouter();

  const chat = new ChatOpenAI({ 
    temperature: 0.7,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const hasEnoughInformation = (messages) => {
    const userMessages = messages.filter(msg => msg.type === 'human');
    if (userMessages.length < 2) return false;

    const requiredInfo = ['style', 'occasion', 'budget'];
    const allMessages = userMessages.map(msg => msg.content.toLowerCase()).join(' ');

    return requiredInfo.every(info => allMessages.includes(info));
  };

  useEffect(() => {
    const initialMessage = async () => {
      setIsTyping(true);
      const response = await chat.call([
        new SystemMessage("You are an AI fashion stylist assistant. Greet the user and ask about their style preferences, body type, and occasion they're dressing for."),
      ]);
      setMessages([{ type: 'assistant', content: response.text }]);
      setIsTyping(false);
    };
    initialMessage();
  }, []);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const newMessages = [...messages, { type: 'human', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    const response = await chat.call([
      new SystemMessage(`You are an AI fashion stylist assistant. Engage in a short, minimalistic but engaging conversation to gather information about the user's style preferences, budget, and occasion. Ask follow-up questions if needed. ${hasEnoughInformation(newMessages) ? "You now have enough information to generate search queries. Use the 'generateSearchQueries' function." : "Continue the conversation to gather more information."}`),
      ...newMessages.map(msg => 
        msg.type === 'human' ? new HumanMessage(msg.content) : new SystemMessage(msg.content)
      ),
    ], {
      functions: [
        {
          name: "generateSearchQueries",
          description: "Generate up to 5 search queries based on user preferences",
          parameters: {
            type: "object",
            properties: {
              queries: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    query: { type: "string" },
                    maxPrice: { type: "number", optional: true },
                    onSale: { type: "boolean", optional: true },
                    brands: { 
                      type: "array", 
                      items: { type: "string" },
                      optional: true 
                    }
                  }
                }
              }
            }
          }
        }
      ],
      function_call: "auto"
    });

    if (response.additional_kwargs.function_call) {
      const functionResponse = JSON.parse(response.additional_kwargs.function_call.arguments);
      setSearchParams(functionResponse.queries);
      setStage('results');
    } else {
      setMessages([...newMessages, { type: 'assistant', content: response.text }]);
    }
    setIsTyping(false);
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleViewResults = () => {
    if (searchParams.length > 0) {
      const query = {
        queries: JSON.stringify(searchParams),
        lan: router.query.lan || 'en',
        zone: router.query.zone || 'us'
      };
      router.push({
        pathname: '/multi-results',
        query: query
      });
    }
  };

  const renderStage = () => {
    switch (stage) {
      case 'chat':
        return (
          <>
            <div ref={chatRef} className={styles.chatContainer}>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`${styles.message} ${message.type === 'human' ? styles.userMessage : styles.assistantMessage}`}
                >
                  <div className={`${styles.messageContent} ${message.type === 'human' ? styles.userMessageContent : styles.assistantMessageContent}`}>
                    {message.content}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className={styles.assistantMessage}>
                  <div className={`${styles.messageContent} ${styles.assistantMessageContent}`}>
                    <div className={styles.typingIndicator}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.inputContainer}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className={styles.input}
              />
              <button onClick={handleSend} className={styles.sendButton}>
                Send
              </button>
            </div>
          </>
        );
      case 'results':
        return (
          <div className={styles.resultsContainer}>
            <h3 className={styles.resultsTitle}>Great! I've found some options for you.</h3>
            <p className={styles.resultsDescription}>
              Based on your preferences, I've prepared searches for:
              <br />
              {searchParams.map((param, index) => (
                <div key={index}>
                  <strong>Query {index + 1}:</strong> {param.query}
                  <br />
                  <strong>Style Tags:</strong> {param.tags}
                  {param.maxPrice && (
                    <>
                      <br />
                      <strong>Max Price:</strong> ${param.maxPrice}
                    </>
                  )}
                  <br />
                </div>
              ))}
            </p>
            <button onClick={handleViewResults} className={styles.viewResultsButton}>
              View Results
            </button>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className={styles.assistantContainer}
      >
        <div className={styles.assistantDialog}>
          <div className={styles.header}>
            <h2 className={styles.title}>AI Styling Assistant</h2>
            <button onClick={onClose} className={styles.closeButton}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {renderStage()}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIStylingAssistant;