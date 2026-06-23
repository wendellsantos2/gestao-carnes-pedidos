import { Box, Card, CardContent, Grid, Typography } from '@mui/material'
import { LocalDining as LocalDiningIcon, People as PeopleIcon, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material'

const modules = [
  {
    title: 'Carnes',
    description: 'Cadastro e gestão de tipos de carne, preços e disponibilidade.',
    icon: <LocalDiningIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Compradores',
    description: 'Clientes com endereços em diferentes cidades e estados.',
    icon: <PeopleIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Pedidos',
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
    

      <Grid container spacing={3}>
        {modules.map((module) => (
          <Grid item xs={12} md={4} key={module.title}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ mb: 2 }}>{module.icon}</Box>
                <Typography variant="h6" gutterBottom>
                  {module.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {module.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
