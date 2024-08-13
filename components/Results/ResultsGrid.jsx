import React from 'react';
import { Grid } from '@mui/material';
import ResultCard from './ResultCard';

const ResultsGrid = ({ products, gridLayout }) => {
  const getGridItemProps = () => {
    switch (gridLayout) {
      case 'compact':
        return { xs: 6, sm: 4, md: 3, lg: 2, xl: 2, spacing: 1 };
      case 'image-only':
        return { xs: 4, sm: 3, md: 2, lg: 1, xl: 1, spacing: 0 };
      default:
        return { xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4, spacing: 2 };
    }
  };

  const gridItemProps = getGridItemProps();

  return (
    <Grid container spacing={gridItemProps.spacing} sx={{ padding: 2 }}>
      {products.map((productItem, productIndex) => (
        <Grid 
          key={`${productItem.id_item}-${productIndex}`} 
          item 
          xs={gridItemProps.xs} 
          sm={gridItemProps.sm} 
          md={gridItemProps.md} 
          lg={gridItemProps.lg} 
          xl={gridItemProps.xl}
        >
          <ResultCard 
            productItem={productItem} 
            layoutType={gridLayout} 
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ResultsGrid;