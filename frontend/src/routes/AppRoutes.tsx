import { Route, Routes } from 'react-router-dom'
import Layout from '../layouts/Layout'
import CarnesPage from '../pages/carnes/CarnesPage'
import CompradoresPage from '../pages/compradores/CompradoresPage'
import HomePage from '../pages/HomePage'
import PedidosPage from '../pages/pedidos/PedidosPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/carnes" element={<CarnesPage />} />
        <Route path="/compradores" element={<CompradoresPage />} />
        <Route path="/pedidos" element={<PedidosPage />} />
      </Route>
    </Routes>
  )
}
