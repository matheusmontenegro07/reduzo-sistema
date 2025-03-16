'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  MoreVertical, 
  Send, 
  Clock, 
  Edit, 
  Trash2,
  ExternalLink,
  MessageSquare
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from "@/lib/utils"

export type StatusCotacao = 'em_aberto' | 'respondida' | 'nao_respondida'
export type TipoCotacao = 'automatica' | 'manual'

interface CardCotacaoProps {
  id: string
  codigo: string
  dataEmissao: Date
  fornecedor: string
  prazoResposta: Date
  quantidadeItens: number
  totalEstimado: number
  status: StatusCotacao
  tipo: TipoCotacao
  urlFornecedor?: string
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onEnviarWhatsApp: (id: string) => void
  onPreencherManual: (id: string) => void
}

export function CardCotacao({
  id,
  codigo,
  dataEmissao,
  fornecedor,
  prazoResposta,
  quantidadeItens,
  totalEstimado,
  status,
  tipo,
  urlFornecedor,
  onEdit,
  onDelete,
  onEnviarWhatsApp,
  onPreencherManual
}: CardCotacaoProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const getStatusColor = (status: StatusCotacao) => {
    switch (status) {
      case 'em_aberto':
        return 'bg-yellow-50 border-yellow-200'
      case 'respondida':
        return 'bg-green-50 border-green-200'
      case 'nao_respondida':
        return 'bg-red-50 border-red-200'
    }
  }

  const getStatusText = (status: StatusCotacao) => {
    switch (status) {
      case 'em_aberto':
        return 'Em Aberto'
      case 'respondida':
        return 'Respondida'
      case 'nao_respondida':
        return 'Não Respondida'
    }
  }

  const getPrazoRestante = (prazo: Date) => {
    return formatDistanceToNow(prazo, {
      locale: ptBR,
      addSuffix: true
    })
  }

  return (
    <Card className={cn(
      "p-4 border-2 transition-colors",
      getStatusColor(status)
    )}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium">{codigo}</h3>
          <p className="text-sm text-gray-500">
            Emitida {formatDistanceToNow(dataEmissao, { locale: ptBR, addSuffix: true })}
          </p>
        </div>
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(id)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            {tipo === 'automatica' ? (
              <DropdownMenuItem onClick={() => onEnviarWhatsApp(id)}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Enviar WhatsApp
              </DropdownMenuItem>
            ) : (
              <>
                {urlFornecedor && (
                  <DropdownMenuItem onClick={() => window.open(urlFornecedor, '_blank')}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Acessar Site
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onPreencherManual(id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Preencher Preços
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem 
              onClick={() => onDelete(id)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Fornecedor:</span>
          <span className="text-sm">{fornecedor}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Prazo:</span>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-1 text-gray-500" />
            {getPrazoRestante(prazoResposta)}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Itens:</span>
          <span className="text-sm">{quantidadeItens}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Total Estimado:</span>
          <span className="text-sm">R$ {totalEstimado.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-sm font-medium">Status:</span>
          <span className={cn(
            "text-sm px-2 py-1 rounded-full",
            status === 'em_aberto' && "bg-yellow-100 text-yellow-700",
            status === 'respondida' && "bg-green-100 text-green-700",
            status === 'nao_respondida' && "bg-red-100 text-red-700"
          )}>
            {getStatusText(status)}
          </span>
        </div>
      </div>
    </Card>
  )
}