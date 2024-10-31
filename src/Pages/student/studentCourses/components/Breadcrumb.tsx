import { Box, Breadcrumbs, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRightRounded } from '@mui/icons-material';

const Breadcrumb = () => {
  const location = useLocation();
  
  // Remove the base '/student' path and split the remaining path
  const pathnames = location.pathname
    .replace('/student', '')
    .split('/')
    .filter((x) => x);

  // Map of path segments to display names
const pathMap: { [key: string]: string } = {
  'dashboard': 'Dashboard',
  'overview': 'Overview',
  'courses': 'Courses',
  'exam-card': 'Exam Card',
  'course-form': 'Course Form',
  'add-course': 'Add Course',
  'reports': 'Reports',
  'live-class': 'Live Class',
  'settings': 'Settings'
};


  return (
    <Box sx={{ 
      my: 1,
      p: 2,
      borderRadius: 1,
    }}>
      <Breadcrumbs 
        separator={<ChevronRightRounded />}
        aria-label="breadcrumb"
      >
        {/* Home link is always present */}
        <Link
          to="/student/dashboard"
          style={{
            color: '#666',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            fontSize: '0.875rem'
          }}
        >
          Home
        </Link>

        {/* Map through path segments to create breadcrumb items */}
        {pathnames.map((path, index) => {
          const routeTo = `/student/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const displayName = pathMap[path] || path.charAt(0).toUpperCase() + path.slice(1);

          if (isLast) {
            return (
              <Typography
                key={path}
                sx={{
                  color: 'primary.main',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                {displayName}
              </Typography>
            );
          }

          return (
            <Link
              key={path}
              to={routeTo}
              style={{
                color: '#666',
                textDecoration: 'none',
                fontSize: '0.875rem'
              }}
            >
              {displayName}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default Breadcrumb;