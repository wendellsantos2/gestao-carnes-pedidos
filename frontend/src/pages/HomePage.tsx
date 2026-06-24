import { Box, Card, CardActionArea, CardContent, Grid, Typography } from '@mui/material'
import { LocalDining as LocalDiningIcon, People as PeopleIcon, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import ApiStatus from '../components/ApiStatus'

const modules = [
  {
    title: 'Carnes',
    path: '/carnes',
    description: 'Cadastro de carnes com descrição e origem (Bovina, Suína, Aves, Peixes).',
    icon: <LocalDiningIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Compradores',
    path: '/compradores',
    description: 'Cadastro de clientes com documento, cidade e estado.',
    icon: <PeopleIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Pedidos',
    path: '/pedidos',
    description: 'Pedidos com itens, compradores e total calculado.',
    icon: <ShoppingCartIcon fontSize="large" color="primary" />,
  },
]

export default function HomePage() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Sistema de Gestão de Carnes e Pedidos
      </Typography>

      <ApiStatus />

      <Grid container spacing={3}>
        {modules.map((module) => (
          <Grid item xs={12} md={4} key={module.title}>
            <Card sx={{ height: '100%' }}>
              <CardActionArea
                component={Link}
                to={module.path}
                sx={{ height: '100%', display: 'block' }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>{module.icon}</Box>
                  <Typography variant="h6" gutterBottom>
                    {module.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {module.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
