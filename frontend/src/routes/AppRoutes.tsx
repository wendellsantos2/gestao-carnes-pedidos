import { Route, Routes } from 'react-router-dom'
import Layout from '../layouts/Layout'
import HomePage from '../pages/HomePage'
import PlaceholderPage from '../pages/PlaceholderPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/carnes" element={<PlaceholderPage title="Carnes" />} />
        <Route path="/compradores" element={<PlaceholderPage title="Compradores" />} />
        <Route path="/pedidos" element={<PlaceholderPage title="Pedidos" />} />
      </Route>
    </Routes>
  )
}
