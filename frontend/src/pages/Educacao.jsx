import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, BookOpen, TrendingUp, PiggyBank, Shield, Target, Lightbulb, Play, Clock, CheckCircle, Star } from 'lucide-react'

// Dados mockados para demonstração
const categorias = [
  {
    id: 'orcamento',
    titulo: 'Orçamento Pessoal',
    icone: PiggyBank,
    cor: 'blue',
    artigos: 8,
    descricao: 'Aprenda a controlar seus gastos e organizar suas finanças'
  },
  {
    id: 'dividas',
    titulo: 'Controle de Dívidas',
    icone: Shield,
    cor: 'red',
    artigos: 6,
    descricao: 'Estratégias para se livrar das dívidas e manter o nome limpo'
  },
  {
    id: 'reserva',
    titulo: 'Reserva de Emergência',
    icone: Target,
    cor: 'green',
    artigos: 5,
    descricao: 'Como criar e manter uma reserva para imprevistos'
  },
  {
    id: 'investimentos',
    titulo: 'Primeiros Investimentos',
    icone: TrendingUp,
    cor: 'purple',
    artigos: 12,
    descricao: 'Guia completo para começar a investir com segurança'
  }
]

const artigos = [
  {
    id: 1,
    categoria: 'orcamento',
    titulo: 'Como fazer um orçamento que funciona',
    tempo: '8 min',
    dificuldade: 'Iniciante',
    conteudo: 'Um orçamento eficaz é a base de uma vida financeira saudável. Comece listando todas as suas receitas e despesas mensais. Divida os gastos em categorias: essenciais (moradia, alimentação, transporte) e não essenciais (lazer, compras). A regra 50/30/20 é um bom ponto de partida: 50% para necessidades, 30% para desejos e 20% para poupança e investimentos.',
    concluido: false
  },
  {
    id: 2,
    categoria: 'dividas',
    titulo: 'Método bola de neve para quitar dívidas',
    tempo: '6 min',
    dificuldade: 'Iniciante',
    conteudo: 'O método bola de neve consiste em quitar primeiro as menores dívidas, mantendo pagamentos mínimos das outras. Isso gera motivação psicológica. Liste todas as dívidas por valor, quite a menor primeiro, depois use o valor que pagava dela para acelerar a próxima. É eficaz para manter a motivação no processo.',
    concluido: true
  },
  {
    id: 3,
    categoria: 'reserva',
    titulo: 'Reserva de emergência: quanto guardar?',
    tempo: '10 min',
    dificuldade: 'Iniciante',
    conteudo: 'A reserva de emergência deve cobrir de 3 a 6 meses dos seus gastos essenciais. Para autônomos ou pessoas com renda variável, recomenda-se 6 a 12 meses. Mantenha esse dinheiro em aplicações líquidas como poupança, CDB com liquidez diária ou Tesouro Selic. O importante é ter acesso rápido quando necessário.',
    concluido: false
  },
  {
    id: 4,
    categoria: 'investimentos',
    titulo: 'Tesouro Direto: seu primeiro investimento',
    tempo: '12 min',
    dificuldade: 'Iniciante',
    conteudo: 'O Tesouro Direto é uma excelente porta de entrada no mundo dos investimentos. Oferece títulos com diferentes características: Selic (pós-fixado), Prefixado e IPCA+ (inflação). Comece com valores baixos (a partir de R$ 30), escolha um título adequado ao seu perfil e prazo. É seguro, rentável e com liquidez diária.',
    concluido: false
  }
]

const dicasRapidas = [
  'Anote todos os gastos por 30 dias para entender seus padrões',
  'Use a regra dos 30 dias antes de compras não essenciais',
  'Automatize sua poupança: transfira valor fixo todo mês',
  'Negocie sempre: contas, seguros e financiamentos',
  'Invista em sua educação financeira regularmente'
]

function CategoriaCard({ categoria }) {
  const iconMap = {
    blue: 'from-blue-500 to-blue-600',
    red: 'from-red-500 to-red-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600'
  }

  const Icon = categoria.icone

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${iconMap[categoria.cor]} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-sm text-gray-500">{categoria.artigos} artigos</span>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{categoria.titulo}</h3>
      <p className="text-gray-600 text-sm">{categoria.descricao}</p>
    </div>
  )
}

function ArtigoCard({ artigo }) {
  const navigate = useNavigate()

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
      onClick={() => navigate(`/educacao/artigo/${artigo.id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 pr-4 hover:text-blue-600 transition-colors">{artigo.titulo}</h3>
        {artigo.concluido ? (
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
        ) : (
          <Play className="w-5 h-5 text-blue-500 flex-shrink-0" />
        )}
      </div>
      
      <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{artigo.tempo}</span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${
          artigo.dificuldade === 'Iniciante' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-yellow-100 text-yellow-700'
        }`}>
          {artigo.dificuldade}
        </span>
      </div>
      
      <p className="text-gray-700 text-sm mb-4 leading-relaxed">
        {artigo.conteudo.substring(0, 200)}...
      </p>
      
      <button className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
        artigo.concluido
          ? 'bg-gray-100 text-gray-600'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}>
        {artigo.concluido ? 'Revisar Artigo' : 'Ler Artigo'}
      </button>
    </div>
  )
}

export default function Educacao() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('todas')
  
  const artigosFiltrados = categoriaSelecionada === 'todas' 
    ? artigos 
    : artigos.filter(artigo => artigo.categoria === categoriaSelecionada)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Educação Financeira</h1>
          <p className="text-gray-600">Aprenda a gerenciar suas finanças com conteúdo prático</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Star className="w-4 h-4 text-yellow-500" />
          <span>2 de 4 artigos concluídos</span>
        </div>
      </div>

      {/* Categorias */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Explore por Categoria</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categorias.map((categoria) => (
            <CategoriaCard key={categoria.id} categoria={categoria} />
          ))}
        </div>
      </div>

      {/* Dicas Rápidas */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200 p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3">
            <Lightbulb className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Dicas Rápidas do Dia</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dicasRapidas.map((dica, index) => (
            <div key={index} className="bg-white rounded-lg p-4">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-blue-600 text-xs font-medium">{index + 1}</span>
                </div>
                <p className="text-sm text-gray-700">{dica}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filtros e Artigos */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Artigos Recomendados</h2>
          
          <select 
            value={categoriaSelecionada}
            onChange={(e) => setCategoriaSelecionada(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todas">Todas as categorias</option>
            <option value="orcamento">Orçamento</option>
            <option value="dividas">Dívidas</option>
            <option value="reserva">Reserva de Emergência</option>
            <option value="investimentos">Investimentos</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {artigosFiltrados.map((artigo) => (
            <ArtigoCard key={artigo.id} artigo={artigo} />
          ))}
        </div>
      </div>

      {/* Progresso */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Seu Progresso</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Artigos Concluídos</span>
              <span className="text-sm font-semibold text-gray-900">2 de 4 (50%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="h-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full" style={{ width: '50%' }}></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-blue-600">12</p>
              <p className="text-sm text-gray-600">Minutos de leitura</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-green-600">85</p>
              <p className="text-sm text-gray-600">Pontos XP ganhos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-right text-sm text-gray-500">
        © 2024 MoneyMapp TCC. Todos os direitos reservados.
      </div>
    </div>
  )
}
