import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { Typography, Box, IconButton, TextField, Fab, Zoom } from '@mui/material';
import { Chat, Close, Mic, Send, Refresh } from '@mui/icons-material';
import styles from './AIRefinementAssistant.module.css';

const AIRefinementAssistant = ({ onRefine, initialResults, initialConversation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialConversation || []);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [refinedResults, setRefinedResults] = useState(initialResults);
  const chatRef = useRef(null);

  const chat = new ChatOpenAI({ 
    temperature: 0.7,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const handleSend = async () => {
    if (input.trim() === '') return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chat.call([
        new SystemMessage("You are an AI fashion assistant. Continue the conversation and refine the search based on user input. Generate new search queries when appropriate."),
        ...newMessages.map(msg => 
          msg.role === 'user' ? new HumanMessage(msg.content) : new SystemMessage(msg.content)
        ),
      ], {
        functions: [
          {
            name: "updateSearchQueries",
            description: "Update search queries based on new user preferences",
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
        const newResults = await fetchRefinedResults(functionResponse.queries);
        setRefinedResults(newResults);
        setMessages([...newMessages, { role: 'assistant', content: `I've updated your search results based on your request. Here's a summary of the changes: ${summarizeChanges(refinedResults, newResults)}` }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: response.text }]);
      }
    } catch (error) {
      console.error('Error in AI refinement:', error);
      setMessages([...newMessages, { role: 'assistant', content: "I'm sorry, I encountered an error. Please try again." }]);
    }

    setIsTyping(false);
  };

  const fetchRefinedResults = async (queries) => {
    // Replace this with your actual API call to fetch refined results
    const response = await fetch('/api/refineResults', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ queries })
    });
    return await response.json();
  };

  const summarizeChanges = (oldResults, newResults) => {
    // Implement logic to summarize the changes between old and new results
    // This could include changes in number of items, new brands, color changes, etc.
    return "New items added with blue color, and some items removed that didn't match the new criteria.";
  };

  const handleApplyRefinements = () => {
    onRefine(refinedResults, messages);
    setIsOpen(false);
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="refine"
        className={styles.fabButton}
        onClick={() => setIsOpen(true)}
      >
        <Chat />
      </Fab>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={styles.assistantContainer}
          >
            <Box className={styles.assistantHeader}>
              <Typography variant="h6">AI Style Refinement</Typography>
              <IconButton onClick={() => setIsOpen(false)}>
                <Close />
              </IconButton>
            </Box>

            <Box className={styles.chatContainer} ref={chatRef}>
              {messages.map((message, index) => (
                <Box
                  key={index}
                  className={`${styles.message} ${styles[message.role]}`}
                >
                  {message.content}
                </Box>
              ))}
              {isTyping && (
                <Box className={`${styles.message} ${styles.assistant}`}>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                  >
                    ...
                  </motion.div>
                </Box>
              )}
            </Box>

            <Box className={styles.inputContainer}>
              <TextField
                fullWidth
                variant="outlined"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Refine your style..."
              />
              <IconButton onClick={handleSend} color="primary">
                <Send />
              </IconButton>
              <IconButton color="secondary">
                <Mic />
              </IconButton>
            </Box>

            <Box className={styles.previewContainer}>
              <Typography variant="subtitle1">Live Preview</Typography>
              {refinedResults.map((result, index) => (
                <Box key={index} className={styles.previewItem}>
                  <img src={result.items[0]?.img_urls[0]} alt={result.query} />
                  <Typography variant="caption">{result.items.length} items</Typography>
                </Box>
              ))}
            </Box>

            <Zoom in={JSON.stringify(refinedResults) !== JSON.stringify(initialResults)}>
              <Fab
                color="secondary"
                variant="extended"
                onClick={handleApplyRefinements}
                className={styles.applyButton}
              >
                <Refresh sx={{ mr: 1 }} />
                Apply Refinements
              </Fab>
            </Zoom>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIRefinementAssistant;