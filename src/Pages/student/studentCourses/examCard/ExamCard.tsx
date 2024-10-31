import { Download, Print } from '@mui/icons-material';
import { Box, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
const ExamCard = () => {
  // Sample data for the table
  const examRows = Array(8).fill({
    sn: '1',
    courseCode: 'PHY 404',
    courseTitle: 'Nuclear and Particle Physics',
    creditUnit: '2',
    invigilatorSign: 'A'
  });

  return (
    <>

    <Box sx={{ maxWidth: 800, mx: 'auto',}}>
    <Breadcrumb />

    <Paper 
      sx={{ 
        p: 4,
        my:3,
        bgcolor: '#ffffff'
      }}
    >
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 4
      }}>
        {/* Left Logo */}
        <Box sx={{ width: 80, height: 80 }}>
          <img 
            src="/api/placeholder/80/80"
            alt="College Logo"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </Box>

        {/* Center Text */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#002B5B' }}>
            Nigerian Air Force
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#002B5B' }}>
            College of Nursing Sciences
          </Typography>
        </Box>

        {/* Right Image */}
        <Box sx={{ width: 80, height: 80 }}>
          <img 
            src="/api/placeholder/80/80"
            alt="Student Photo"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
      </Box>

      {/* Student Info Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
          <Typography variant="body2">
            <strong>MATRIC NO:</strong> U24/RJ/101
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <Typography variant="body2">
            <strong>FULL NAME:</strong> Amina Rabiu Mustapha
          </Typography>
          <Typography variant="body2">
            <strong>SEMESTER:</strong> Second
          </Typography>
          <Typography variant="body2">
            <strong>LEVEL:</strong> 100
          </Typography>
          <Typography variant="body2">
            <strong>SESSION:</strong> 2023/2024
          </Typography>
        </Box>
      </Box>

      {/* Table Section */}
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#002B5B' }}>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>S/N</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>COURSE CODE</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>COURSE TITLE</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>CREDIT UNIT</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>INVIGILATOR SIGN</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {examRows.map((row, index) => (
              <TableRow 
                key={index}
                sx={{ '&:nth-of-type(odd)': { bgcolor: '#f5f5f5' } }}
              >
                <TableCell>{row.sn}</TableCell>
                <TableCell>{row.courseCode}</TableCell>
                <TableCell>{row.courseTitle}</TableCell>
                <TableCell>{row.creditUnit}</TableCell>
                <TableCell>{row.invigilatorSign}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
    
      {/* Download and Print Section */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: 3,
        mb: 3,
        '@media print': { 
          display: 'none' 
        }
      }}>
        {/* Download Card */}
        <Paper sx={{ 
          p: 4, 
          textAlign: 'center',
          border: '1px dashed',
          borderColor: 'divider',
          bgcolor: '#ffffff'
        }}>
          <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 500 }}>
            Download Your Exam Card
          </Typography>
          <Button
            startIcon={<Download />}
            sx={{
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.50'
              }
            }}
            onClick={() => console.log('Download PDF')}
          >
            Click here to Download (PDF)
          </Button>
        </Paper>

        {/* Print Card */}
        <Paper sx={{ 
          p: 4, 
          textAlign: 'center',
          border: '1px dashed',
          borderColor: 'divider',
          bgcolor: '#ffffff'
        }}>
          <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 500 }}>
            Print Your Exam Card
          </Typography>
          <Button
            startIcon={<Print />}
            sx={{
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.50'
              }
            }}
            onClick={() => window.print()}
          >
            Print Exam Card
          </Button>
        </Paper>
      </Box>

      {/* Help Text */}
      <Typography 
        variant="body2" 
        sx={{ 
          textAlign: 'center',
          color: 'text.secondary',
          mb:4,
          '@media print': { 
          display: 'none' 
        },
        }}
      >
        If you are experiencing difficulties generating or printing your exam card, please{' '}
        <Link 
          to="#" 
          onClick={(e) => {
            e.preventDefault();
            console.log('Help clicked');
          }}
          style={{ 
              color: 'primary.main',
              textDecoration: 'underline'
            
          }}
        >
          click here
        </Link>
        {' '}for assistance
      </Typography>
      </Box>
    </>
  );
};

export default ExamCard;