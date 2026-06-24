import { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useErrorHandler } from '../../components/ErrorHandlerProvider'
import PageHeader from '../../components/PageHeader'
import { createCarne, deleteCarne, listCarnes, updateCarne } from '../../services/carnesService'
import type { Carne, CreateCarnePayload } from '../../types'
import { formatShortId } from '../../utils/documento'
import { resolveErrorMessage } from '../../utils/errorMessages'
import CarneFormDialog from './CarneFormDialog'

export default function CarnesPage() {
  const { notifyError, notifySuccess } = useErrorHandler()
  const [carnes, setCarnes] = useState<Carne[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
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
      setError(resolveErrorMessage(err))
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
        notifySuccess('Carne atualizada com sucesso.')
      } else {
        await createCarne(payload)
        notifySuccess('Carne cadastrada com sucesso.')
      }

      setDialogOpen(false)
      await loadCarnes()
    } catch (err) {
      notifyError(err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    setSaving(true)

    try {
      await deleteCarne(deleteTarget.id)
      notifySuccess('Carne excluída com sucesso.')
      setDeleteTarget(null)
      await loadCarnes()
    } catch (err) {
      notifyError(err)
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
                <TableCell>Id</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Origem</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {carnes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Nenhuma carne cadastrada.
                  </TableCell>
                </TableRow>
              ) : (
                carnes.map((carne) => (
                  <TableRow key={carne.id} hover>
                    <TableCell>
                      <Tooltip title={carne.id}>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ fontFamily: 'monospace' }}
                        >
                          {formatShortId(carne.id)}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{carne.nome}</TableCell>
                    <TableCell>{carne.origem}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton onClick={() => handleEdit(carne)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir (somente sem pedidos vinculados)">
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
        title="Confirmar exclusão"
        message={`Deseja realmente excluir a carne "${deleteTarget?.nome}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir carne"
        loading={saving}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  )
}
