import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { endpoints } from '../config/endpoints';
import axios from 'axios';
import ResultCard from '../components/Results/ResultCard';
import { Typography, Box, Chip, IconButton, Container, Button, TextField, Drawer } from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown, Celebration, ExpandMore, Chat, Send } from '@mui/icons-material';
import styles from '../styles/MultiResults.module.css';
import AIRefinementAssistant from '../components/Home/AIRefinementAssistant';

const MultiResults = () => {
  const router = useRouter();
  const { queries } = router.query;
  const [results, setResults] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(0);
  const [expandedCriteria, setExpandedCriteria] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiConversation, setAiConversation] = useState([]);
  const sectionRefs = useRef([]);

  useEffect(() => {
    if (queries) {
      const searchParams = JSON.parse(queries);
      fetchResults(searchParams);
    }
  }, [queries]);

  const fetchResults = async (searchParams) => {
    try {
      const allResults = await Promise.all(
        searchParams.map(async (param) => {
          const response = await axios.get(endpoints('results'), {
            params: {
              query: param.query,
              maxPrice: param.maxPrice,
              onSale: param.onSale,
              brands: param.brands ? param.brands.join(',') : undefined,
            },
          });
          return { query: param.query, items: response.data.results || [], ...param };
        })
      );
      setResults(allResults);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching results:', error);
      setError('Failed to fetch results. Please try again.');
      setLoading(false);
    }
  };

  const handleSectionChange = (index) => {
    setActiveSection(index);
    sectionRefs.current[index].scrollIntoView({ behavior: 'smooth' });
  };

  const handleAiRefinement = async () => {
    if (aiInput.trim() === '') return;

    setAiConversation(prev => [...prev, { role: 'user', content: aiInput }]);
    setAiInput('');

    // Simulate AI processing (replace with actual AI processing in production)
    setAiConversation(prev => [...prev, { role: 'ai', content: "I'm refining your search based on your input. Please wait a moment..." }]);

    // Simulate API call for refined results
    setTimeout(async () => {
      try {
        const refinedParams = results.map(result => ({
          ...result,
          query: `${result.query} ${aiInput}`,
        }));

        await fetchResults(refinedParams);

        setAiConversation(prev => [...prev, { role: 'ai', content: `I've refined your search to include "${aiInput}". The results have been updated with new items that match your criteria.` }]);
      } catch (error) {
        console.error('Error refining results:', error);
        setAiConversation(prev => [...prev, { role: 'ai', content: "I'm sorry, I encountered an error while refining the search. Please try again." }]);
      }
    }, 1500);
  };

  const handleRefinement = (newResults, updatedConversation) => {
    setResults(newResults);
    setConversation(updatedConversation);
    // Optionally, update URL or perform other actions
  };

  if (loading) {
    return (
      <Box className={styles.loading}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={styles.loadingSpinner}
        />
        <Typography variant="h6">Curating your personalized style...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Box className={styles.error}>{error}</Box>;
  }

  return (
    <Container maxWidth={false} className={styles.container}>
      <Box className={styles.welcomeSection}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h3" className={styles.welcomeTitle}>
            Your Personalized Style Journey
          </Typography>
          <Typography variant="h6" className={styles.welcomeSubtitle}>
            Based on our chat, we've curated {results.length} unique collections just for you!
          </Typography>
        </motion.div>
      </Box>

      <Box className={styles.collectionPreview}>
        {results.map((result, index) => (
          <Box
            key={index}
            className={`${styles.previewItem} ${activeSection === index ? styles.active : ''}`}
            onClick={() => handleSectionChange(index)}
          >
            <img src={result.items[0]?.img_urls[0]} alt={result.query} />
            <Typography variant="body2">Collection {index + 1}</Typography>
          </Box>
        ))}
      </Box>

      <AnimatePresence>
        {results.map((result, index) => (
          <motion.section
            key={index}
            ref={(el) => (sectionRefs.current[index] = el)}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className={styles.querySection}
            style={{ 
              backgroundColor: `hsl(${index * 60}, 70%, 95%)`,
              display: activeSection === index ? 'block' : 'none'
            }}
          >
            <Box className={styles.queryHeader}>
              <Typography variant="h4" className={styles.queryTitle}>
                Collection {index + 1}: {result.query}
              </Typography>
              <Celebration className={styles.celebrationIcon} />
            </Box>

            <Button
              onClick={() => setExpandedCriteria(!expandedCriteria)}
              endIcon={<ExpandMore />}
              className={styles.criteriaButton}
            >
              AI Search Criteria
            </Button>

            {expandedCriteria && (
              <Box className={styles.criteriaExplanation}>
                <Typography variant="body1">
                  For this collection, I considered:
                  {result.maxPrice && <li>A maximum price of ${result.maxPrice}</li>}
                  {result.onSale && <li>Items currently on sale</li>}
                  {result.brands && <li>Brands including: {result.brands.join(', ')}</li>}
                  <li>Your style preferences from our chat</li>
                </Typography>
              </Box>
            )}

            <Box className={styles.chipContainer}>
              {result.items[0]?.tags && (
                Array.isArray(result.items[0].tags)
                  ? result.items[0].tags.map((tag, idx) => (
                      <Chip key={idx} label={tag} className={styles.chip} />
                    ))
                  : typeof result.items[0].tags === 'string'
                    ? result.items[0].tags.split(',').map((tag, idx) => (
                        <Chip key={idx} label={tag.trim()} className={styles.chip} />
                      ))
                    : null
              )}
            </Box>

            <motion.div 
              className={styles.resultGrid}
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.05 } }
              }}
            >
              {result.items.map((item) => (
                <motion.div
                  key={item.id_item}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 }
                  }}
                >
                  <ResultCard productItem={item} />
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        ))}
      </AnimatePresence>

      <Box className={styles.navigation}>
        {results.map((_, index) => (
          <Box
            key={index}
            className={`${styles.navDot} ${activeSection === index ? styles.active : ''}`}
            onClick={() => handleSectionChange(index)}
          />
        ))}
      </Box>

      <IconButton
        className={styles.navArrow}
        style={{ top: 80 }}
        onClick={() => handleSectionChange(Math.max(0, activeSection - 1))}
      >
        <KeyboardArrowUp />
      </IconButton>
      <IconButton
        className={styles.navArrow}
        style={{ bottom: 20 }}
        onClick={() => handleSectionChange(Math.min(results.length - 1, activeSection + 1))}
      >
        <KeyboardArrowDown />
      </IconButton>

      <Button
        className={styles.aiChatButton}
        onClick={() => setAiDrawerOpen(true)}
        startIcon={<Chat />}
      >
        Refine with AI
      </Button>

      <Drawer
        anchor="right"
        open={aiDrawerOpen}
        onClose={() => setAiDrawerOpen(false)}
        classes={{ paper: styles.aiDrawer }}
      >
        <Box className={styles.aiChatBox}>
          <Typography variant="h6" className={styles.aiChatTitle}>
            AI Style Assistant
          </Typography>
          <Box className={styles.aiConversation}>
            {aiConversation.map((message, index) => (
              <Box key={index} className={`${styles.aiMessage} ${styles[message.role]}`}>
                {message.content}
              </Box>
            ))}
          </Box>
          <Box className={styles.aiInputBox}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ask me to refine your search..."
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAiRefinement()}
            />
            <IconButton onClick={handleAiRefinement} color="primary">
              <Send />
            </IconButton>
          </Box>
        </Box>
      </Drawer>

      <AIRefinementAssistant 
        onRefine={handleRefinement} 
        initialResults={results} 
        initialConversation={conversation}
      />
    </Container>
  );
};

export default MultiResults;