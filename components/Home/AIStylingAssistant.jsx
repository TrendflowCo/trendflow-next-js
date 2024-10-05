import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from './AIStylingAssistant.module.css';

const AIStylingAssistant = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchParams, setSearchParams] = useState([]);
  const [avatar, setAvatar] = useState('/default-avatar.png');
  const [mood, setMood] = useState('neutral');
  const [readyForResults, setReadyForResults] = useState(false);
  const [quickResponses, setQuickResponses] = useState([]);
  const chatRef = useRef(null);
  const router = useRouter();

  const chat = new ChatOpenAI({ 
    temperature: 0.7,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const updateAvatar = (newMood) => {
    setMood(newMood);
    setAvatar(`/avatar-${newMood}.png`);
  };

  useEffect(() => {
    introSequence();
  }, []);

  const introSequence = async () => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMessages([{ 
      type: 'assistant', 
      content: "👋 Hello! I'm your AI Styling Assistant. How can I help you with your fashion needs today?",
      interactiveElements: [
        { type: 'button', label: '👚 Find an outfit', action: 'find_outfit' },
        { type: 'button', label: '💡 Get styling advice', action: 'styling_advice' },
        { type: 'button', label: '🔥 Discover trends', action: 'discover_trends' },
        { type: 'button', label: '🛍️ Shop for specific item', action: 'specific_item' }
      ]
    }]);
    updateAvatar('happy');
    setIsTyping(false);
  };

  const handleInteraction = (type, label, value) => {
    switch(type) {
      case 'button':
        switch(label) {
          case 'Find an outfit':
            handleSend("I'd like to find an outfit");
            break;
          case 'Get styling advice':
            handleSend("I need some styling advice");
            break;
          case 'Discover trends':
            handleSend("What are the current fashion trends?");
            break;
          case 'Shop for specific item':
            handleSend("I'm looking for a specific item");
            break;
          default:
            handleSend(label);
        }
        break;
      case 'dropdown':
        if (label.includes('occasion')) {
          handleSend(`I'm dressing for a ${value}`);
        } else if (label.includes('style')) {
          handleSend(`I prefer ${value} style`);
        } else if (label.includes('budget')) {
          handleSend(`My budget is ${value}`);
        } else {
          handleSend(`${label}: ${value}`);
        }
        break;
      case 'slider':
        handleSend(`${label}: ${value}`);
        break;
      default:
        handleSend(value);
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const parseInteractiveElements = (content) => {
    const regex = /\[([^\]]+)\]\((button|dropdown|slider)(?::([^)]+))?\)/g;
    let lastIndex = 0;
    const elements = [];
    const plainText = [];

    let match;
    while ((match = regex.exec(content)) !== null) {
      plainText.push(content.slice(lastIndex, match.index));
      
      const [_, label, type, options] = match;
      const element = { type, label };
      
      if (type === 'dropdown' && options) {
        element.options = options.split(',').map(opt => opt.trim());
      } else if (type === 'slider' && options) {
        const [min, max, step] = options.split(',').map(Number);
        element.min = min;
        element.max = max;
        element.step = step;
      }
      
      elements.push(element);
      lastIndex = regex.lastIndex;
    }

    plainText.push(content.slice(lastIndex));
    return { text: plainText.join(''), elements };
  };

  const handleSend = async (message = input) => {
    if (message.trim() === '') return;

    const newMessages = [...messages, { type: 'human', content: message }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chat.call([
        new SystemMessage(`You are an AI fashion stylist assistant. Engage in a natural conversation to understand the user's style preferences, needs, and context. Be adaptive to short or long conversations. Use emojis to add personality. When appropriate, suggest interactive elements using the following syntax:
        - For buttons: [Button Label](button)
        - For dropdowns: [Dropdown Label](dropdown:option1,option2,option3)
        - For sliders: [Slider Label](slider:min,max,step)
        From time to time provide at least one interactive element in your responses to keep the conversation engaging. When you have enough information or the user expresses readiness, suggest viewing results. Use the 'generateSearchQueries' function to create tailored search queries when appropriate.`),
        ...newMessages.map(msg => 
          msg.type === 'human' ? new HumanMessage(msg.content) : new SystemMessage(msg.content)
        ),
      ], {
        functions: [
          {
            name: "generateSearchQueries",
            description: "Generate rich search queries based on user preferences",
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
                      category: { type: "string", enum: ['men', 'women', 'kids', 'home', 'gift'], optional: true },
                      brands: { 
                        type: "array", 
                        items: { type: "string" },
                        enum: ['zara', 'mango', 'uo', 'h&m', 'cos', 'massimo dutti', 'pull & bear', 'bershka', 'stradivarius', '&other', 'desigual', 'uniqlo', 'ben sherman', 'loewe', 'adidas', 'moschino', 'farm rio', 'miu miu', 'calvin klein', 'balenciaga', 'champion', 'dior', 'all saints', 'alexander mcqueen', 'fila', 'sandro', 'ysl', 'parfois', 'hugo boss', 'hyein seo', 'jaded london', 'the reformation', 'adanola', 'bobo choses', 'danielle guizio', 'fait par foutch', 'feners', 'geel', 'gimaguas', 'henne', 'kitteny', 'ksubi', 'miaou', 'mode mischief', 'my mum made it', 'nodress', 'the bekk', 'rouje', 'rationalle', 'souce unknown'],
                        optional: true 
                      }
                    }
                  }
                },
                interactiveElements: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      type: { type: "string", enum: ["button", "slider", "dropdown"] },
                      label: { type: "string" },
                      action: { type: "string" },
                      options: { 
                        type: "array", 
                        items: { type: "string" },
                        optional: true 
                      },
                      min: { type: "number", optional: true },
                      max: { type: "number", optional: true },
                      step: { type: "number", optional: true }
                    }
                  },
                  optional: true
                }
              }
            }
          }
        ],
        function_call: "auto"
      });

      const { text, elements } = parseInteractiveElements(response.text);

      let assistantMessage = {
        type: 'assistant',
        content: text,
        interactiveElements: elements
      };

      if (response.additional_kwargs.function_call) {
        const functionResponse = JSON.parse(response.additional_kwargs.function_call.arguments);
        setSearchParams(functionResponse.queries || []);
        setReadyForResults(functionResponse.queries && functionResponse.queries.length > 0);
        updateAvatar('excited');
      } else {
        updateAvatar('thoughtful');
      }

      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error('Error in AI conversation:', error);
      setMessages([...newMessages, { type: 'assistant', content: "I'm sorry, I encountered an error. Please try again." }]);
      updateAvatar('confused');
    }

    setIsTyping(false);
  };

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

  const renderInteractiveElement = (element, index) => {
    switch(element.type) {
      case 'button':
        return (
          <motion.button
            key={index}
            onClick={() => handleInteraction('button', element.label)}
            className={styles.interactiveButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {element.label}
          </motion.button>
        );
      case 'slider':
        return (
          <div key={index} className={styles.sliderContainer}>
            <label>{element.label}</label>
            <input
              type="range"
              min={element.min}
              max={element.max}
              step={element.step}
              onChange={(e) => handleInteraction('slider', element.label, e.target.value)}
              className={styles.slider}
            />
          </div>
        );
      case 'dropdown':
        return (
          <select
            key={index}
            onChange={(e) => handleInteraction('dropdown', element.label, e.target.value)}
            className={styles.dropdown}
          >
            <option value="">{element.label}</option>
            {element.options.map((option, i) => (
              <option key={i} value={option}>{option}</option>
            ))}
          </select>
        );
      default:
        return null;
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
            <h2 className={styles.title}>Your Fashion Journey</h2>
            <button onClick={onClose} className={styles.closeButton}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className={styles.avatarContainer}>
            <Image src={avatar} alt="AI Assistant Avatar" width={100} height={100} className={styles.avatar} />
          </div>
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
                {message.interactiveElements && (
                  <div className={styles.interactiveElements}>
                    {message.interactiveElements.map((element, i) => renderInteractiveElement(element, i))}
                  </div>
                )}
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
            <button onClick={() => handleSend()} className={styles.sendButton}>
              Send
            </button>
          </div>
          {readyForResults && (
            <motion.button 
              onClick={handleViewResults} 
              className={styles.viewResultsButton}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Your Curated Style 👗👔
            </motion.button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIStylingAssistant;