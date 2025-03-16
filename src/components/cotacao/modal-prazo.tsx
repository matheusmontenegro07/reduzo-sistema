'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const OPCOES_PRAZO = [
  { valor: '2', label: '2 horas' },
  { valor: '6', label: '6 horas' },
  { valor: '8', label: '8 horas' },
  { valor: '12', label: '12 horas' },
  { valor: '18', label: '18 horas' },
  { valor: '24', label: '24 horas' },
  { valor: '48', label: '48 horas' },
  { valor: '72', label: '72 horas' },
  { valor: '0', label: 'Sem prazo' }
]

interface ModalPrazoProps {
  isOpen: boolean
  onClose: () => void
  onSalvar: (prazoHoras: number) => void
  prazoAtual?: number
}

export function ModalPrazo({
  isOpen,
  onClose,
  onSalvar,
  prazoAtual
}: ModalPrazoProps) {
  const [prazoSelecionado, setPrazoSelecionado] = useState<string>(
    prazoAtual?.toString() || '24'
  )

  const handleSalvar = () => {
    onSalvar(Number(prazoSelecionado))
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Definir Prazo de Resposta</DialogTitle>
          <DialogDescription>
            Escolha o prazo padrão para resposta das cotações automáticas.
            Este prazo será aplicado a todas as novas cotações.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Select
            value={prazoSelecionado}
            onValueChange={setPrazoSelecionado}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o prazo" />
            </SelectTrigger>
            <SelectContent>
              {OPCOES_PRAZO.map((opcao) => (
                <SelectItem key={opcao.valor} value={opcao.valor}>
                  {opcao.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSalvar}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}