import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material'
import { RestaurantMenu as RestaurantMenuIcon } from '@mui/icons-material'
import { Outlet } from 'react-router-dom'

export default function MainLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <RestaurantMenuIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            Gestão Carnes Pedidos
          </Typography>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ flex: 1, py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  )
}
