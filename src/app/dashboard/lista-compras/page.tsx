'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ShoppingCart, 
  PlusCircle, 
  Edit, 
  Trash, 
  AlertCircle,
  Check,
  X,
  RefreshCw
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import { 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from '@/components/ui/use-toast'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from '@/lib/utils'

// Tipos
interface Produto {
  id: string
  codigo: string
  nome: string
  unidade: string
  quantidade: number
  preco_unitario: number
  preco_total: number
  secao?: string
  status: 'disponivel' | 'indisponivel'
  categoria: string
}

interface Fornecedor {
  id: string
  nome: string
  tipo: 'atacadista' | 'distribuidor' | 'fabricante' | 'ecommerce'
  bairro: string
  cidade: string
  estado: string
  pedido_minimo: number
  homologado: boolean
  produtos: Produto[]
  total: number
}

interface ListaCompra {
  id: string
  data_emissao: Date
  fornecedores: Fornecedor[]
  total_geral: number
  status: 'pendente' | 'finalizada' | 'cancelada'
}

// Dados Mock
const SECOES = [
  'Hortifruti',
  'Açougue',
  'Padaria',
  'Mercearia',
  'Bebidas',
  'Limpeza',
  'Higiene',
  'Congelados',
  'Laticínios',
  'Outros'
]

const produtosMock: Produto[] = [
  {
    id: '1',
    codigo: 'P001',
    nome: 'Arroz Integral',
    unidade: 'kg',
    quantidade: 10,
    preco_unitario: 5.99,
    preco_total: 59.90,
    secao: 'Mercearia',
    status: 'disponivel',
    categoria: 'Grãos'
  },
  {
    id: '2',
    codigo: 'P002',
    nome: 'Feijão Preto',
    unidade: 'kg',
    quantidade: 5,
    preco_unitario: 7.90,
    preco_total: 39.50,
    secao: 'Mercearia',
    status: 'disponivel',
    categoria: 'Grãos'
  },
  {
    id: '3',
    codigo: 'P003',
    nome: 'Leite Integral',
    unidade: 'L',
    quantidade: 20,
    preco_unitario: 4.50,
    preco_total: 90.00,
    secao: 'Laticínios',
    status: 'disponivel',
    categoria: 'Laticínios'
  },
  {
    id: '4',
    codigo: 'P004',
    nome: 'Açúcar Refinado',
    unidade: 'kg',
    quantidade: 8,
    preco_unitario: 3.99,
    preco_total: 31.92,
    secao: 'Mercearia',
    status: 'disponivel',
    categoria: 'Básicos'
  },
  {
    id: '5',
    codigo: 'P005',
    nome: 'Café Torrado',
    unidade: 'kg',
    quantidade: 4,
    preco_unitario: 29.90,
    preco_total: 119.60,
    status: 'disponivel',
    categoria: 'Bebidas'
  },
]

const fornecedoresMock: Fornecedor[] = [
  {
    id: '1',
    nome: 'Atacadão Distribuidor',
    tipo: 'atacadista',
    bairro: 'Centro',
    cidade: 'São Paulo',
    estado: 'SP',
    pedido_minimo: 200.00,
    homologado: true,
    produtos: [produtosMock[0], produtosMock[1], produtosMock[3]],
    total: 131.32
  },
  {
    id: '2',
    nome: 'Distribuidora Alimentos Brasil',
    tipo: 'atacadista',
    bairro: 'Pinheiros',
    cidade: 'São Paulo',
    estado: 'SP',
    pedido_minimo: 150.00,
    homologado: true,
    produtos: [produtosMock[2], produtosMock[4]],
    total: 209.60
  },
  {
    id: '3',
    nome: 'Atacado Popular',
    tipo: 'atacadista',
    bairro: 'Vila Mariana',
    cidade: 'São Paulo',
    estado: 'SP',
    pedido_minimo: 300.00,
    homologado: false,
    produtos: [produtosMock[0], produtosMock[2]],
    total: 149.90
  }
]

const listaComprasMock: ListaCompra[] = [
  {
    id: '1',
    data_emissao: new Date(2023, 2, 15),
    fornecedores: [fornecedoresMock[0], fornecedoresMock[1]],
    total_geral: 340.92,
    status: 'pendente'
  },
  {
    id: '2',
    data_emissao: new Date(2023, 2, 10),
    fornecedores: [fornecedoresMock[2]],
    total_geral: 149.90,
    status: 'finalizada'
  },
  {
    id: '3',
    data_emissao: new Date(2023, 2, 5),
    fornecedores: [fornecedoresMock[0], fornecedoresMock[1], fornecedoresMock[2]],
    total_geral: 490.82,
    status: 'cancelada'
  }
]

// Componente de item ordenável
function SortableFornecedor({ fornecedor }: { fornecedor: Fornecedor }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: fornecedor.id,
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
      <FornecedorItem fornecedor={fornecedor} />
    </div>
  );
}

// Componente de fornecedor
function FornecedorItem({ fornecedor }: { fornecedor: Fornecedor }) {
  const { toast } = useToast()
  const [produtosEditados, setProdutosEditados] = useState<Record<string, any>>({})
  const [produtoEmEdicao, setProdutoEmEdicao] = useState<Produto | null>(null)
  const [modalEditarAberto, setModalEditarAberto] = useState(false)
  
  const handleEditarProduto = (produto: Produto) => {
    setProdutoEmEdicao(produto)
    setModalEditarAberto(true)
  }
  
  const handleSalvarEdicao = () => {
    if (!produtoEmEdicao) return
    
    // Aqui seria a lógica para salvar as edições
    toast({
      title: "Produto atualizado",
      description: "As alterações foram salvas com sucesso.",
    })
    
    setModalEditarAberto(false)
    setProdutoEmEdicao(null)
  }
  
  return (
    <Card className={cn(
      "mb-4",
      fornecedor.total < fornecedor.pedido_minimo && "border-red-300",
      fornecedor.homologado && "border-l-4 border-l-green-500"
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center">
              {fornecedor.nome}
              {fornecedor.homologado && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="ml-2 bg-green-100 text-green-700 border-green-200">
                        Homologado
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Fornecedor homologado</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </CardTitle>
            <CardDescription>
              {fornecedor.bairro}, {fornecedor.cidade} - {fornecedor.estado}
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">Pedido mínimo: R$ {fornecedor.pedido_minimo.toFixed(2)}</p>
            <p className={cn(
              "text-lg font-bold",
              fornecedor.total < fornecedor.pedido_minimo ? "text-red-500" : "text-green-600"
            )}>
              Total: R$ {fornecedor.total.toFixed(2)}
            </p>
            {fornecedor.total < fornecedor.pedido_minimo && (
              <p className="text-xs text-red-500">
                Faltam R$ {(fornecedor.pedido_minimo - fornecedor.total).toFixed(2)} para o pedido mínimo
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-2 text-xs">Código</th>
                <th className="text-left p-2 text-xs">Produto</th>
                <th className="text-left p-2 text-xs">Unidade</th>
                <th className="text-left p-2 text-xs">Quantidade</th>
                <th className="text-left p-2 text-xs">Preço Un.</th>
                <th className="text-left p-2 text-xs">Total</th>
                <th className="text-left p-2 text-xs">Seção</th>
                <th className="text-left p-2 text-xs">Status</th>
                <th className="text-left p-2 text-xs">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {fornecedor.produtos.map((produto, index) => (
                <tr key={produto.id} className={index % 2 === 0 ? "bg-white" : "bg-muted/20"}>
                  <td className="p-2 text-xs">{produto.codigo}</td>
                  <td className="p-2 text-sm font-medium">{produto.nome}</td>
                  <td className="p-2 text-xs">{produto.unidade}</td>
                  <td className="p-2 text-xs">{produto.quantidade}</td>
                  <td className="p-2 text-xs">R$ {produto.preco_unitario.toFixed(2)}</td>
                  <td className="p-2 text-xs font-medium">R$ {produto.preco_total.toFixed(2)}</td>
                  <td className="p-2 text-xs">
                    {produto.secao || (
                      <span className="text-gray-400 italic">Não definida</span>
                    )}
                  </td>
                  <td className="p-2 text-xs">
                    <Badge variant={produto.status === 'disponivel' ? 'success' : 'destructive'}>
                      {produto.status === 'disponivel' ? 'Disponível' : 'Indisponível'}
                    </Badge>
                  </td>
                  <td className="p-2 text-xs">
                    <Button variant="ghost" size="icon" onClick={() => handleEditarProduto(produto)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          Adicionar Produto
        </Button>
        <Button 
          size="sm" 
          disabled={fornecedor.total < fornecedor.pedido_minimo}
        >
          Finalizar Compra
        </Button>
      </CardFooter>
      
      <Dialog open={modalEditarAberto} onOpenChange={setModalEditarAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
            <DialogDescription>
              Altere as informações do produto abaixo.
            </DialogDescription>
          </DialogHeader>
          
          {produtoEmEdicao && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="produto-nome" className="text-right">
                  Produto
                </Label>
                <Input
                  id="produto-nome"
                  value={produtoEmEdicao.nome}
                  className="col-span-3"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="produto-quantidade" className="text-right">
                  Quantidade
                </Label>
                <Input
                  id="produto-quantidade"
                  type="number"
                  min="0"
                  defaultValue={produtoEmEdicao.quantidade}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="produto-preco" className="text-right">
                  Preço Unitário
                </Label>
                <Input
                  id="produto-preco"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={produtoEmEdicao.preco_unitario}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="produto-secao" className="text-right">
                  Seção
                </Label>
                <Select defaultValue={produtoEmEdicao.secao || ""}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione a seção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sem seção</SelectItem>
                    {SECOES.map(secao => (
                      <SelectItem key={secao} value={secao}>{secao}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalEditarAberto(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvarEdicao}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default function ListaComprasPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [listaCompras, setListaCompras] = useState<ListaCompra[]>(listaComprasMock)
  const [listaSelecionada, setListaSelecionada] = useState<ListaCompra | null>(null)
  const [termoBusca, setTermoBusca] = useState('')
  const [fornecedoresOrdenados, setFornecedoresOrdenados] = useState<Fornecedor[]>([])
  const [modalListaAberto, setModalListaAberto] = useState(false)
  const [modalFinalizarAberto, setModalFinalizarAberto] = useState(false)
  
  // Sensors para DnD
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )
  
  const listasFiltradas = useMemo(() => {
    if (!termoBusca.trim()) return listaCompras
    
    const termo = termoBusca.toLowerCase()
    return listaCompras.filter(lista => {
      // Verifica se algum fornecedor possui o termo no nome
      const fornecedorMatch = lista.fornecedores.some(
        fornecedor => fornecedor.nome.toLowerCase().includes(termo)
      )
      
      // Verifica se algum produto possui o termo no nome
      const produtoMatch = lista.fornecedores.some(fornecedor => 
        fornecedor.produtos.some(produto => 
          produto.nome.toLowerCase().includes(termo)
        )
      )
      
      return fornecedorMatch || produtoMatch
    })
  }, [listaCompras, termoBusca])
  
  const handleSelecionarLista = (lista: ListaCompra) => {
    setListaSelecionada(lista)
    setFornecedoresOrdenados([...lista.fornecedores])
    setModalListaAberto(true)
  }
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over || active.id === over.id) return
    
    setFornecedoresOrdenados(fornecedores => {
      const oldIndex = fornecedores.findIndex(f => f.id === active.id)
      const newIndex = fornecedores.findIndex(f => f.id === over.id)
      
      const newArray = [...fornecedores]
      const [movedItem] = newArray.splice(oldIndex, 1)
      newArray.splice(newIndex, 0, movedItem)
      
      return newArray
    })
  }
  
  const handleFinalizarCompra = () => {
    // Aqui seria implementada a lógica de finalização da compra
    toast({
      title: "Compra finalizada com sucesso!",
      description: "Os itens foram registrados no estoque.",
    })
    
    setModalFinalizarAberto(false)
    setModalListaAberto(false)
    
    // Atualiza o status da lista
    if (listaSelecionada) {
      setListaCompras(prev => 
        prev.map(lista => 
          lista.id === listaSelecionada.id 
            ? { ...lista, status: 'finalizada' as const } 
            : lista
        )
      )
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Lista de Compras</h1>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos ou fornecedores..."
              className="pl-8"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="pendentes">
        <TabsList>
          <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
          <TabsTrigger value="finalizadas">Finalizadas</TabsTrigger>
          <TabsTrigger value="todas">Todas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pendentes" className="mt-4">
          {listasFiltradas
            .filter(lista => lista.status === 'pendente')
            .map(lista => (
              <Card key={lista.id} className="mb-4 cursor-pointer hover:border-primary transition-colors" onClick={() => handleSelecionarLista(lista)}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Lista #{lista.id}</CardTitle>
                      <CardDescription>
                        Emitida em {format(lista.data_emissao, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {lista.fornecedores.length} fornecedor(es)
                      </p>
                      <p className="text-lg font-bold">
                        R$ {lista.total_geral.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {lista.fornecedores.map(fornecedor => (
                      <Badge key={fornecedor.id} variant="outline">
                        {fornecedor.nome}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
        
        <TabsContent value="finalizadas" className="mt-4">
          {listasFiltradas
            .filter(lista => lista.status === 'finalizada')
            .map(lista => (
              <Card key={lista.id} className="mb-4 cursor-pointer hover:border-primary transition-colors" onClick={() => handleSelecionarLista(lista)}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Lista #{lista.id}</CardTitle>
                      <CardDescription>
                        Emitida em {format(lista.data_emissao, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {lista.fornecedores.length} fornecedor(es)
                      </p>
                      <p className="text-lg font-bold">
                        R$ {lista.total_geral.toFixed(2)}
                      </p>
                      <Badge variant="success">Finalizada</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {lista.fornecedores.map(fornecedor => (
                      <Badge key={fornecedor.id} variant="outline">
                        {fornecedor.nome}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
        
        <TabsContent value="todas" className="mt-4">
          {listasFiltradas.map(lista => (
            <Card key={lista.id} className="mb-4 cursor-pointer hover:border-primary transition-colors" onClick={() => handleSelecionarLista(lista)}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Lista #{lista.id}</CardTitle>
                    <CardDescription>
                      Emitida em {format(lista.data_emissao, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {lista.fornecedores.length} fornecedor(es)
                    </p>
                    <p className="text-lg font-bold">
                      R$ {lista.total_geral.toFixed(2)}
                    </p>
                    {lista.status === 'finalizada' && <Badge variant="success">Finalizada</Badge>}
                    {lista.status === 'pendente' && <Badge variant="outline">Pendente</Badge>}
                    {lista.status === 'cancelada' && <Badge variant="destructive">Cancelada</Badge>}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {lista.fornecedores.map(fornecedor => (
                    <Badge key={fornecedor.id} variant="outline">
                      {fornecedor.nome}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
      
      {/* Modal para mostrar fornecedores */}
      <Dialog open={modalListaAberto} onOpenChange={setModalListaAberto}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Lista de Compras #{listaSelecionada?.id}
            </DialogTitle>
            <DialogDescription>
              Emitida em {listaSelecionada && format(listaSelecionada.data_emissao, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto">
            {fornecedoresOrdenados.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Arraste os fornecedores para organizá-los conforme sua rota
                </p>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={fornecedoresOrdenados.map(f => f.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {fornecedoresOrdenados.map(fornecedor => (
                      <SortableFornecedor key={fornecedor.id} fornecedor={fornecedor} />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            )}
          </div>
          
          <DialogFooter className="border-t pt-4">
            <div className="mr-auto flex flex-col items-start">
              <p className="text-lg font-bold">
                Total Geral: R$ {listaSelecionada?.total_geral.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                {listaSelecionada?.fornecedores.reduce((acc, f) => acc + f.produtos.length, 0)} produtos
              </p>
            </div>
            <Button variant="outline" onClick={() => setModalListaAberto(false)}>
              Fechar
            </Button>
            <Button 
              onClick={() => {
                if (listaSelecionada?.status !== 'finalizada') {
                  setModalFinalizarAberto(true)
                }
              }}
              disabled={listaSelecionada?.status === 'finalizada'}
            >
              Finalizar Todas as Compras
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal para finalizar compra */}
      <Dialog open={modalFinalizarAberto} onOpenChange={setModalFinalizarAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Finalização</DialogTitle>
            <DialogDescription>
              Você está prestes a finalizar as compras e registrar os itens no estoque.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="mb-2 font-medium">Resumo da Compra:</p>
            <ul className="space-y-1 mb-4">
              <li className="text-sm flex justify-between">
                <span>Total de fornecedores:</span>
                <span>{listaSelecionada?.fornecedores.length}</span>
              </li>
              <li className="text-sm flex justify-between">
                <span>Total de produtos:</span>
                <span>{listaSelecionada?.fornecedores.reduce((acc, f) => acc + f.produtos.length, 0)}</span>
              </li>
              <li className="text-sm flex justify-between font-bold">
                <span>Valor total:</span>
                <span>R$ {listaSelecionada?.total_geral.toFixed(2)}</span>
              </li>
            </ul>
            
            <Alert variant="warning" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Atenção</AlertTitle>
              <AlertDescription>
                Esta ação irá registrar automaticamente a entrada dos itens no estoque.
              </AlertDescription>
            </Alert>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalFinalizarAberto(false)}>
              Cancelar
            </Button>
            <Button onClick={handleFinalizarCompra}>
              Confirmar e Registrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}