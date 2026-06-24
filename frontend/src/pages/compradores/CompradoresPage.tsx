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
import {
  createComprador,
  deleteComprador,
  listCompradores,
  updateComprador,
} from '../../services/compradoresService'
import type { Comprador, CreateCompradorPayload } from '../../types'
import { formatDocumento, formatShortId } from '../../utils/documento'
import { resolveErrorMessage } from '../../utils/errorMessages'
import CompradorFormDialog from './CompradorFormDialog'

export default function CompradoresPage() {
  const { notifyError, notifySuccess } = useErrorHandler()
  const [compradores, setCompradores] = useState<Comprador[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Comprador | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Comprador | null>(null)

  const loadCompradores = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await listCompradores()
      setCompradores(data)
    } catch (err) {
      setError(resolveErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCompradores()
  }, [loadCompradores])

  const handleCreate = () => {
    setEditing(null)
    setDialogOpen(true)
  }

  const handleEdit = (comprador: Comprador) => {
    setEditing(comprador)
    setDialogOpen(true)
  }

  const handleSubmit = async (payload: CreateCompradorPayload) => {
    setSaving(true)

    try {
      if (editing) {
        await updateComprador(editing.id, payload)
        notifySuccess('Comprador atualizado com sucesso.')
      } else {
        await createComprador(payload)
        notifySuccess('Comprador cadastrado com sucesso.')
      }

      setDialogOpen(false)
      await loadCompradores()
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
      await deleteComprador(deleteTarget.id)
      notifySuccess('Comprador excluído com sucesso.')
      setDeleteTarget(null)
      await loadCompradores()
    } catch (err) {
      notifyError(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box>
      <PageHeader title="Compradores" onAdd={handleCreate} addLabel="Novo comprador" />

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
                <TableCell>Documento</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {compradores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Nenhum comprador cadastrado.
                  </TableCell>
                </TableRow>
              ) : (
                compradores.map((comprador) => (
                  <TableRow key={comprador.id} hover>
                    <TableCell>
                      <Tooltip title={comprador.id}>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ fontFamily: 'monospace' }}
                        >
                          {formatShortId(comprador.id)}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{comprador.nome}</TableCell>
                    <TableCell>{formatDocumento(comprador.documento)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton onClick={() => handleEdit(comprador)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir (somente sem pedidos vinculados)">
                        <IconButton color="error" onClick={() => setDeleteTarget(comprador)}>
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

      <CompradorFormDialog
        open={dialogOpen}
        comprador={editing}
        loading={saving}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Confirmar exclusão"
        message={`Deseja realmente excluir o comprador "${deleteTarget?.nome}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir comprador"
        loading={saving}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  )
}
