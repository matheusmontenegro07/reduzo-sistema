'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardCotacao } from "@/components/cotacao/card-cotacao"
import { EstatisticasCotacao } from "@/components/cotacao/estatisticas"
import { ModalPrazo } from "@/components/cotacao/modal-prazo"
import { ModalNovaCotacao } from "@/components/cotacao/modal-nova-cotacao"
import { Plus } from "lucide-react"

// Tipos
interface Fornecedor {
  id: string
  nome: string
  tipo: 'atacadista' | 'varejista'
}

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
    tipo: 'atacadista' | 'varejista'
  }
  prazoResposta: string | null
  quantidadeItens: number
  totalEstimado: number
  status: 'em_aberto' | 'respondida' | 'nao_respondida'
  tipo: 'automatica' | 'manual'
  linkFormulario?: string
}

// Dados Mock
const FORNECEDORES_MOCK: Fornecedor[] = [
  { id: '1', nome: 'Fornecedor A', tipo: 'atacadista' },
  { id: '2', nome: 'Fornecedor B', tipo: 'varejista' },
  { id: '3', nome: 'Fornecedor C', tipo: 'atacadista' },
]

const ITENS_MOCK: Item[] = [
  { id: '1', nome: 'Produto A', precoMedio: 10.50, quantidade: 100 },
  { id: '2', nome: 'Produto B', precoMedio: 25.00, quantidade: 50 },
  { id: '3', nome: 'Produto C', precoMedio: 15.75, quantidade: 75 },
]

const PRAZOS_RESPOSTA = [
  { valor: '2', label: '2 horas' },
  { valor: '4', label: '4 horas' },
  { valor: '8', label: '8 horas' },
  { valor: '12', label: '12 horas' },
  { valor: '24', label: '24 horas' },
  { valor: '48', label: '48 horas' },
  { valor: '72', label: '72 horas' },
  { valor: 'sem_prazo', label: 'Sem prazo' },
]

function gerarCotacoesMock(tipo: 'automatica' | 'manual'): Cotacao[] {
  return Array.from({ length: 6 }, (_, i) => ({
    id: `${tipo}-${i + 1}`,
    codigo: `COT-${tipo === 'automatica' ? 'A' : 'M'}-${String(i + 1).padStart(3, '0')}`,
    dataEmissao: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    fornecedor: FORNECEDORES_MOCK[Math.floor(Math.random() * FORNECEDORES_MOCK.length)],
    prazoResposta: Math.random() > 0.3 ? '24' : null,
    quantidadeItens: Math.floor(Math.random() * 10) + 1,
    totalEstimado: Math.random() * 10000,
    status: ['em_aberto', 'respondida', 'nao_respondida'][Math.floor(Math.random() * 3)] as Cotacao['status'],
    tipo,
    linkFormulario: `/dashboard/cotacao/formulario/${tipo}-${i + 1}`,
  }))
}

export default function CotacaoPage() {
  const [tipoCotacao, setTipoCotacao] = useState<'automatica' | 'manual'>('automatica')
  const [statusFiltro, setStatusFiltro] = useState<Cotacao['status'] | 'todas'>('todas')
  const [modalPrazoAberto, setModalPrazoAberto] = useState(false)
  const [cotacaoSelecionada, setCotacaoSelecionada] = useState<string | null>(null)
  const [modalNovaCotacaoAberto, setModalNovaCotacaoAberto] = useState(false)

  const cotacoes = gerarCotacoesMock(tipoCotacao)
  const cotacoesFiltradas = statusFiltro === 'todas' 
    ? cotacoes 
    : cotacoes.filter(c => c.status === statusFiltro)

  const handleAtualizarPrazo = (prazo: string) => {
    // Implementar atualização do prazo
    console.log('Atualizando prazo:', { cotacaoId: cotacaoSelecionada, prazo })
    setModalPrazoAberto(false)
    setCotacaoSelecionada(null)
  }

  const handleEnviarWhatsApp = (cotacao: Cotacao) => {
    const mensagem = `Olá! Temos uma nova cotação para você (${cotacao.codigo}). Por favor, acesse o link para responder: ${window.location.origin}${cotacao.linkFormulario}`
    const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`
    window.open(url, '_blank')
  }

  const handleCriarCotacao = (dados: any) => {
    // Implementar criação da cotação
    console.log('Criando cotação:', dados)
    setModalNovaCotacaoAberto(false)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ordens de Cotação</h1>
        <Button onClick={() => setModalNovaCotacaoAberto(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Cotação
        </Button>
      </div>

      <EstatisticasCotacao />

      <Tabs 
        defaultValue="automatica" 
        value={tipoCotacao}
        onValueChange={(v) => setTipoCotacao(v as 'automatica' | 'manual')}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="automatica">Cotação Automática</TabsTrigger>
          <TabsTrigger value="manual">Cotação Manual</TabsTrigger>
        </TabsList>

        {['automatica', 'manual'].map((tipo) => (
          <TabsContent key={tipo} value={tipo}>
            <div className="space-y-6">
              <Tabs defaultValue="todas" value={statusFiltro} onValueChange={setStatusFiltro}>
                <TabsList>
                  <TabsTrigger value="todas">Todas</TabsTrigger>
                  <TabsTrigger value="em_aberto">Em Aberto</TabsTrigger>
                  <TabsTrigger value="respondida">Respondidas</TabsTrigger>
                  <TabsTrigger value="nao_respondida">Não Respondidas</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cotacoesFiltradas.map((cotacao) => (
                  <CardCotacao
                    key={cotacao.id}
                    {...cotacao}
                    onEditarPrazo={() => {
                      setCotacaoSelecionada(cotacao.id)
                      setModalPrazoAberto(true)
                    }}
                    onEnviarWhatsApp={() => handleEnviarWhatsApp(cotacao)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <ModalPrazo
        isOpen={modalPrazoAberto}
        onClose={() => {
          setModalPrazoAberto(false)
          setCotacaoSelecionada(null)
        }}
        onSalvar={handleAtualizarPrazo}
        prazoAtual={cotacaoSelecionada ? 
          cotacoes.find(c => c.id === cotacaoSelecionada)?.prazoResposta || undefined
          : undefined
        }
        opcoesPrazo={PRAZOS_RESPOSTA}
      />

      <ModalNovaCotacao
        isOpen={modalNovaCotacaoAberto}
        onClose={() => setModalNovaCotacaoAberto(false)}
        onSalvar={handleCriarCotacao}
        fornecedores={FORNECEDORES_MOCK}
        itensDisponiveis={ITENS_MOCK}
        prazosResposta={PRAZOS_RESPOSTA}
      />
    </div>
  )
}