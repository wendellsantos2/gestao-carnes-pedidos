import { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material'
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material'
import ConfirmDialog from '../../components/ConfirmDialog'
import PageHeader from '../../components/PageHeader'
import { getApiErrorMessage } from '../../services/api'
import { createCarne, deleteCarne, listCarnes, updateCarne } from '../../services/carnesService'
import type { Carne, CreateCarnePayload } from '../../types'
import { formatCurrency } from '../../utils/format'
import CarneFormDialog from './CarneFormDialog'

export default function CarnesPage() {
  const [carnes, setCarnes] = useState<Carne[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [snackbar, setSnackbar] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Carne | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Carne | null>(null)

  const loadCarnes = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await listCarnes()
      setCarnes(data)
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCarnes()
  }, [loadCarnes])

  const handleCreate = () => {
    setEditing(null)
    setDialogOpen(true)
  }

  const handleEdit = (carne: Carne) => {
    setEditing(carne)
    setDialogOpen(true)
  }

  const handleSubmit = async (payload: CreateCarnePayload) => {
    setSaving(true)

    try {
      if (editing) {
        await updateCarne(editing.id, payload)
        setSnackbar('Carne atualizada com sucesso.')
      } else {
        await createCarne(payload)
        setSnackbar('Carne cadastrada com sucesso.')
      }

      setDialogOpen(false)
      await loadCarnes()
    } catch (err) {
      setSnackbar(getApiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    setSaving(true)

    try {
      await deleteCarne(deleteTarget.id)
      setSnackbar('Carne excluída com sucesso.')
      setDeleteTarget(null)
      await loadCarnes()
    } catch (err) {
      setSnackbar(getApiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box>
      <PageHeader title="Carnes" onAdd={handleCreate} addLabel="Nova carne" />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Preço/kg</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {carnes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Nenhuma carne cadastrada.
                  </TableCell>
                </TableRow>
              ) : (
                carnes.map((carne) => (
                  <TableRow key={carne.id} hover>
                    <TableCell>{carne.nome}</TableCell>
                    <TableCell>{carne.tipo}</TableCell>
                    <TableCell>{formatCurrency(carne.precoKg)}</TableCell>
                    <TableCell>
                      <Chip
                        label={carne.ativo ? 'Ativo' : 'Inativo'}
                        color={carne.ativo ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton onClick={() => handleEdit(carne)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton color="error" onClick={() => setDeleteTarget(carne)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <CarneFormDialog
        open={dialogOpen}
        carne={editing}
        loading={saving}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Excluir carne"
        message={`Deseja excluir a carne "${deleteTarget?.nome}"?`}
        confirmLabel="Excluir"
        loading={saving}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={4000}
        onClose={() => setSnackbar('')}
        message={snackbar}
      />
    </Box>
  )
}
