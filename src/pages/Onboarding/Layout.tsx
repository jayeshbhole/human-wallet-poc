import { Box, Button, Grid, IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import { Outlet } from 'react-router-dom';

const OnboardingLayout = () => {
  return (
    <Box
      px={6}
      pt={6}
      pb={4}
      display="flex"
      flexDirection="column"
      height="100%"
      width="100%"
      gap={8}>
      <Grid
        templateColumns="4rem 1fr 4rem"
        width="100%"
        className="__header">
        {/* back button */}
        <IconButton
          icon={<ChevronLeftIcon />}
          aria-label="back to the previous page"
          width="8"
          minW="8"
          height="8"
          minH="8"
          p="1"
          variant="outline"
          borderWidth="1.5px"
          color="blackAlpha.400"
          borderColor="blackAlpha.400"
          _hover={{
            color: 'blackAlpha.700',
            borderColor: 'blackAlpha.700',
          }}
          rounded="xl"
        />

        {/* onboarding flow title */}
        <h3></h3>

        {/* step progress */}
        <div></div>
      </Grid>

      {/* step */}
      <Outlet />
    </Box>
  );
};

export default OnboardingLayout;
