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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface Fornecedor {
  id: string
  nome: string
}

interface Item {
  id: string
  nome: string
  precoMedio: number
  quantidade: number
}

interface ModalNovaCotacaoProps {
  isOpen: boolean
  onClose: () => void
  onSalvar: (dados: DadosCotacao) => void
  fornecedores: Fornecedor[]
  itensDisponiveis: Item[]
  prazosResposta: Array<{
    valor: string
    label: string
  }>
}

export interface DadosCotacao {
  nome: string
  fornecedorId: string
  prazoResposta: string
  itens: Array<{
    id: string
    quantidade: number
  }>
  observacao: string
}

export function ModalNovaCotacao({
  isOpen,
  onClose,
  onSalvar,
  fornecedores,
  itensDisponiveis,
  prazosResposta
}: ModalNovaCotacaoProps) {
  const [dados, setDados] = useState<DadosCotacao>({
    nome: '',
    fornecedorId: '',
    prazoResposta: '24',
    itens: [],
    observacao: ''
  })

  const handleAddItem = (itemId: string) => {
    if (!dados.itens.find(i => i.id === itemId)) {
      setDados(prev => ({
        ...prev,
        itens: [...prev.itens, { id: itemId, quantidade: 1 }]
      }))
    }
  }

  const handleRemoveItem = (itemId: string) => {
    setDados(prev => ({
      ...prev,
      itens: prev.itens.filter(i => i.id !== itemId)
    }))
  }

  const handleUpdateQuantidade = (itemId: string, quantidade: number) => {
    setDados(prev => ({
      ...prev,
      itens: prev.itens.map(i => 
        i.id === itemId ? { ...i, quantidade } : i
      )
    }))
  }

  const handleSalvar = () => {
    onSalvar(dados)
    onClose()
  }

  const getPrecoTotal = () => {
    return dados.itens.reduce((total, item) => {
      const itemInfo = itensDisponiveis.find(i => i.id === item.id)
      return total + (itemInfo?.precoMedio || 0) * item.quantidade
    }, 0)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Nova Cotação</DialogTitle>
          <DialogDescription>
            Crie uma nova cotação selecionando o fornecedor e os itens desejados.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Cotação</Label>
              <Input
                id="nome"
                value={dados.nome}
                onChange={(e) => setDados(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Digite um nome para identificar a cotação"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fornecedor">Fornecedor</Label>
              <Select
                value={dados.fornecedorId}
                onValueChange={(value) => setDados(prev => ({ ...prev, fornecedorId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  {fornecedores.map((fornecedor) => (
                    <SelectItem key={fornecedor.id} value={fornecedor.id}>
                      {fornecedor.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Prazo de Resposta</Label>
            <Select
              value={dados.prazoResposta}
              onValueChange={(value) => setDados(prev => ({ ...prev, prazoResposta: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o prazo" />
              </SelectTrigger>
              <SelectContent>
                {prazosResposta.map((prazo) => (
                  <SelectItem key={prazo.valor} value={prazo.valor}>
                    {prazo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Itens da Cotação</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Itens Disponíveis</Label>
                <ScrollArea className="h-[200px] border rounded-md p-2">
                  {itensDisponiveis
                    .filter(item => !dados.itens.find(i => i.id === item.id))
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                        onClick={() => handleAddItem(item.id)}
                      >
                        <span>{item.nome}</span>
                        <span className="text-sm text-gray-500">
                          R$ {item.precoMedio.toFixed(2)}
                        </span>
                      </div>
                    ))}
                </ScrollArea>
              </div>

              <div>
                <Label>Itens Selecionados</Label>
                <ScrollArea className="h-[200px] border rounded-md p-2">
                  {dados.itens.map((item) => {
                    const itemInfo = itensDisponiveis.find(i => i.id === item.id)
                    if (!itemInfo) return null

                    return (
                      <div key={item.id} className="space-y-2 p-2">
                        <div className="flex justify-between items-center">
                          <span>{itemInfo.nome}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            Remover
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantidade}
                            onChange={(e) => handleUpdateQuantidade(item.id, Number(e.target.value))}
                            className="w-24"
                          />
                          <span className="text-sm text-gray-500">
                            x R$ {itemInfo.precoMedio.toFixed(2)} = R$ {(itemInfo.precoMedio * item.quantidade).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </ScrollArea>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacao">Observação</Label>
            <Textarea
              id="observacao"
              value={dados.observacao}
              onChange={(e) => setDados(prev => ({ ...prev, observacao: e.target.value }))}
              placeholder="Digite alguma observação se necessário"
              maxLength={500}
            />
            <p className="text-sm text-gray-500">
              {dados.observacao.length}/500 caracteres
            </p>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div>
              <p className="text-sm font-medium">Total Estimado:</p>
              <p className="text-lg font-bold">R$ {getPrecoTotal().toFixed(2)}</p>
            </div>
            <p className="text-sm text-gray-500">
              {dados.itens.length} {dados.itens.length === 1 ? 'item' : 'itens'} selecionados
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSalvar}
            disabled={!dados.nome || !dados.fornecedorId || dados.itens.length === 0}
          >
            Criar Cotação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}