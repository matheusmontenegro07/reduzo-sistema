'use client'

import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Award,
  Users
} from "lucide-react"

interface EstatisticasCotacaoProps {
  totalCotacoes: number
  taxaResposta: number
  melhorPreco: number
  fornecedoresRapidos: Array<{
    nome: string
    tempoMedioResposta: string
  }>
  fornecedoresDesempenho: Array<{
    nome: string
    pontuacao: number
  }>
}

export function EstatisticasCotacao({
  totalCotacoes,
  taxaResposta,
  melhorPreco,
  fornecedoresRapidos,
  fornecedoresDesempenho
}: EstatisticasCotacaoProps) {
  const getTaxaRespostaColor = (taxa: number) => {
    if (taxa >= 90) return "text-green-500"
    if (taxa >= 50) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Total de Cotações */}
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-medium">Total de Cotações</h3>
        </div>
        <p className="mt-2 text-2xl font-bold">{totalCotacoes}</p>
      </Card>

      {/* Taxa de Resposta */}
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-medium">Taxa de Resposta</h3>
        </div>
        <p className={`mt-2 text-2xl font-bold ${getTaxaRespostaColor(taxaResposta)}`}>
          {taxaResposta}%
        </p>
      </Card>

      {/* Melhor Preço */}
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-medium">Melhor Preço</h3>
        </div>
        <p className="mt-2 text-2xl font-bold text-green-500">
          R$ {melhorPreco.toFixed(2)}
        </p>
      </Card>

      {/* Fornecedores Mais Rápidos */}
      <Card className="p-4 col-span-1 md:col-span-2 lg:col-span-1">
        <div className="flex items-center space-x-2 mb-3">
          <Clock className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-medium">Fornecedores Mais Rápidos</h3>
        </div>
        <ScrollArea className="h-[200px] pr-4">
          {fornecedoresRapidos.map((fornecedor, index) => (
            <div key={index}>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium">{fornecedor.nome}</span>
                <span className="text-sm text-gray-500">{fornecedor.tempoMedioResposta}</span>
              </div>
              {index < fornecedoresRapidos.length - 1 && <Separator />}
            </div>
          ))}
        </ScrollArea>
      </Card>

      {/* Fornecedores com Melhor Desempenho */}
      <Card className="p-4 col-span-1 md:col-span-2 lg:col-span-2">
        <div className="flex items-center space-x-2 mb-3">
          <Award className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-medium">Fornecedores com Melhor Desempenho</h3>
        </div>
        <ScrollArea className="h-[200px] pr-4">
          {fornecedoresDesempenho.map((fornecedor, index) => (
            <div key={index}>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium">{fornecedor.nome}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${fornecedor.pontuacao}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500">{fornecedor.pontuacao}%</span>
                </div>
              </div>
              {index < fornecedoresDesempenho.length - 1 && <Separator />}
            </div>
          ))}
        </ScrollArea>
      </Card>
    </div>
  )
}