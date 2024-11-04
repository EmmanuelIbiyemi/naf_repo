import { Box, Paper, Typography, Button } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import LockIcon from '@mui/icons-material/Lock';

const CBTTests = () => {
  const tests = [
    {
      id: 1,
      title: 'B.Tech Specialization in Health Informatics',
      dateCreated: '20/09',
      lastModified: '25/09',
      status: 'new'
    },
    {
      id: 2,
      title: 'B.Tech Specialization in Health Informatics',
      dateCreated: '20/09',
      lastModified: '25/09',
      status: 'expires-soon',
      expiryTime: '30 minutes'
    },
    {
      id: 3,
      title: 'B.Tech Specialization in Health Informatics',
      dateCreated: '20/09',
      lastModified: '25/09',
      status: 'expires-soon',
      expiryTime: '2 days'
    },
    {
      id: 4,
      title: 'B.Tech Specialization in Health Informatics',
      dateCreated: '20/09',
      lastModified: '25/09',
      status: 'closed'
    }
  ];

 const getStatusChip = (status: string, expiryTime: string = '') => {
  switch (status) {
    case 'new':
      return (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: '#e8f5e9',
          color: '#2e7d32',
          borderRadius: '16px',
          px: 1,
          py: 0.5,
          width: 'fit-content'
        }}>
          <NewReleasesIcon sx={{ fontSize: 16, mr: 0.5 }} />
          <Typography variant="caption">New</Typography>
        </Box>
      );
    case 'expires-soon':
      return (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderRadius: '16px',
          px: 1,
          py: 0.5,
          width: 'fit-content'
        }}>
          <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
          <Typography variant="caption">Expires in {expiryTime}</Typography>
        </Box>
      );
    case 'closed':
      return (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: '#eeeeee',
          color: '#616161',
          borderRadius: '16px',
          px: 1,
          py: 0.5,
          width: 'fit-content'
        }}>
          <LockIcon sx={{ fontSize: 16, mr: 0.5 }} />
          <Typography variant="caption">Closed</Typography>
        </Box>
      );
    default:
      return null;
  }
};


  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 500 }}>
          CBT Tests
        </Typography>
        <Button 
          variant="outlined" 
          color="primary"
          startIcon={<AccessTimeIcon />}
        >
          Generate Exam Card
        </Button>
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        List of test that have been created in the course "Sosososo And So"
      </Typography>

      {tests.map((test) => (
        <Paper 
          key={test.id} 
          sx={{ 
            mb: 2, 
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            '&:hover': {
              boxShadow: 3
            }
          }}
        >
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
              {test.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Date Created: {test.dateCreated} • Last Modified: {test.lastModified}
            </Typography>
          </Box>
          {getStatusChip(test.status, test.expiryTime)}
        </Paper>
      ))}
    </Box>
  );
};

export default CBTTests;