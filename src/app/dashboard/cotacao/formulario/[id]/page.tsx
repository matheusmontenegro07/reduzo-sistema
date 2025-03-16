'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Send } from "lucide-react"
import Link from "next/link"

interface Item {
  id: string
  nome: string
  precoMedio: number
  quantidade: number
}

interface Cotacao {
  id: string
  codigo: string
  dataEmissao: string
  fornecedor: {
    id: string
    nome: string
  }
  prazoResposta: string | null
  itens: Item[]
  observacao?: string
}

// Mock data - substituir por chamada à API
const COTACAO_MOCK: Cotacao = {
  id: '1',
  codigo: 'COT-A-001',
  dataEmissao: new Date().toISOString(),
  fornecedor: {
    id: '1',
    nome: 'Fornecedor A'
  },
  prazoResposta: '24',
  itens: [
    { id: '1', nome: 'Produto A', precoMedio: 10.50, quantidade: 100 },
    { id: '2', nome: 'Produto B', precoMedio: 25.00, quantidade: 50 },
    { id: '3', nome: 'Produto C', precoMedio: 15.75, quantidade: 75 },
  ],
  observacao: 'Favor enviar cotação o mais breve possível.'
}

export default function FormularioCotacaoPage() {
  const params = useParams()
  const cotacaoId = params.id as string

  // Buscar dados da cotação - substituir mock por chamada à API
  const cotacao = COTACAO_MOCK

  const [precos, setPrecos] = useState<Record<string, number>>(
    Object.fromEntries(cotacao.itens.map(item => [item.id, 0]))
  )
  const [observacaoResposta, setObservacaoResposta] = useState('')

  const handlePrecoChange = (itemId: string, valor: string) => {
    const numero = parseFloat(valor)
    if (!isNaN(numero) && numero >= 0) {
      setPrecos(prev => ({ ...prev, [itemId]: numero }))
    }
  }

  const getTotal = () => {
    return Object.entries(precos).reduce((total, [itemId, preco]) => {
      const item = cotacao.itens.find(i => i.id === itemId)
      return total + (item ? preco * item.quantidade : 0)
    }, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Implementar envio da resposta
    console.log('Enviando resposta:', {
      cotacaoId,
      precos,
      observacaoResposta
    })
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/cotacao">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Formulário de Cotação</h1>
          <p className="text-gray-500">Código: {cotacao.codigo}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Itens para Cotação</CardTitle>
            <CardDescription>
              Preencha o preço unitário para cada item solicitado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {cotacao.itens.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <Label>{item.nome}</Label>
                      <div className="text-sm text-gray-500">
                        Quantidade: {item.quantidade}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            R$
                          </div>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={precos[item.id] || ''}
                            onChange={(e) => handlePrecoChange(item.id, e.target.value)}
                            className="pl-8"
                            placeholder="0,00"
                          />
                        </div>
                      </div>
                      <div className="w-32 text-right">
                        <p className="text-sm text-gray-500">Total:</p>
                        <p className="font-medium">
                          R$ {((precos[item.id] || 0) * item.quantidade).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="observacao">Observações</Label>
                <Textarea
                  id="observacao"
                  value={observacaoResposta}
                  onChange={(e) => setObservacaoResposta(e.target.value)}
                  placeholder="Digite alguma observação se necessário"
                  maxLength={500}
                />
                <p className="text-sm text-gray-500">
                  {observacaoResposta.length}/500 caracteres
                </p>
              </div>

              <div className="flex justify-between items-center pt-4">
                <div>
                  <p className="text-sm text-gray-500">Total da Cotação</p>
                  <p className="text-2xl font-bold">R$ {getTotal().toFixed(2)}</p>
                </div>
                <Button type="submit" size="lg">
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Cotação
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Cotação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Fornecedor</p>
                <p className="font-medium">{cotacao.fornecedor.nome}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Data de Emissão</p>
                <p className="font-medium">
                  {new Date(cotacao.dataEmissao).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Prazo de Resposta</p>
                <p className="font-medium">
                  {cotacao.prazoResposta ? `${cotacao.prazoResposta} horas` : 'Sem prazo'}
                </p>
              </div>
              {cotacao.observacao && (
                <div>
                  <p className="text-sm text-gray-500">Observações do Solicitante</p>
                  <p className="font-medium">{cotacao.observacao}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumo dos Itens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {cotacao.itens.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-sm">{item.nome}</span>
                    <span className="text-sm font-medium">{item.quantidade}x</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}