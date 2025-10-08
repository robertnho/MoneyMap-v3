import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, BookOpen, TrendingUp, PiggyBank, Shield, Target, Lightbulb, Play, Clock, CheckCircle, Star, Brain, Calculator } from 'lucide-react'
import { educacaoMock } from '../data/educacaoMock'

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

function CategoriaCard({ categoria, index }) {
  const iconMap = {
    blue: 'from-blue-500 to-blue-600',
    red: 'from-red-500 to-red-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600'
  }

  const Icon = categoria.icone

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <motion.div 
          className={`w-12 h-12 bg-gradient-to-br ${iconMap[categoria.cor]} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
          whileHover={{ rotate: 5 }}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
        <span className="text-sm text-gray-500 dark:text-gray-400">{categoria.artigos} artigos</span>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {categoria.titulo}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{categoria.descricao}</p>
    </motion.div>
  )
}

function ArtigoCard({ artigo, index }) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={() => navigate(`/educacao/artigo/${artigo.id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {artigo.titulo}
        </h3>
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="flex-shrink-0"
        >
          {artigo.concluido ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <Play className="w-5 h-5 text-blue-500" />
          )}
        </motion.div>
      </div>
      
      <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{artigo.tempo}</span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${
          artigo.dificuldade === 'Iniciante' 
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
        }`}>
          {artigo.dificuldade}
        </span>
      </div>
      
      <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 leading-relaxed">
        {artigo.conteudo.substring(0, 200)}...
      </p>
      
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
          artigo.concluido
            ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {artigo.concluido ? 'Revisar Artigo' : 'Ler Artigo'}
      </motion.button>
    </motion.div>
  )
}

export default function Educacao() {
  const navigate = useNavigate()
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('todas')
  
  const artigosFiltrados = categoriaSelecionada === 'todas' 
    ? artigos 
    : artigos.filter(artigo => artigo.categoria === categoriaSelecionada)

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Educação Financeira
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Aprenda a gerenciar suas finanças com conteúdo prático
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded-lg">
          <Star className="w-4 h-4 text-yellow-500" />
          <span>2 de 4 artigos concluídos</span>
        </div>
      </motion.div>

      {/* Modo Educação Interativa */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-700 p-4 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6">
          <motion.div 
            className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mr-0 sm:mr-4 mb-3 sm:mb-0"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <Brain className="w-6 h-6 text-white" />
          </motion.div>
          <div className="text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              Modo Educação Interativa
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Aprenda de forma prática com lições, simuladores e quizzes
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.button
            onClick={() => navigate('/educacao/licoes')}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group text-center"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <BookOpen className="w-8 h-8 text-blue-500 mb-3 mx-auto" />
            </motion.div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Lições Práticas</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">4 lições interativas sobre finanças</p>
          </motion.button>
          
          <motion.button
            onClick={() => navigate('/educacao/simuladores')}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group text-center"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Calculator className="w-8 h-8 text-green-500 mb-3 mx-auto" />
            </motion.div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Simuladores</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Calculadoras interativas</p>
          </motion.button>
          
          <motion.button
            onClick={() => navigate('/educacao/quiz')}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group text-center sm:col-span-2 lg:col-span-1"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Target className="w-8 h-8 text-purple-500 mb-3 mx-auto" />
            </motion.div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Quiz Financeiro</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Teste seus conhecimentos</p>
          </motion.button>
        </div>
      </motion.div>

      {/* Categorias */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Explore por Categoria</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categorias.map((categoria, index) => (
            <CategoriaCard key={categoria.id} categoria={categoria} index={index} />
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

      {/* Lições em Destaque */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Lições Interativas em Destaque</h2>
          <button 
            onClick={() => navigate('/educacao/licoes')}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1"
          >
            Ver todas <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {educacaoMock.licoes.slice(0, 2).map((licao, index) => (
            <motion.div 
              key={licao.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => navigate(`/educacao/licao/${licao.id}`)}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                  whileHover={{ rotate: 5 }}
                >
                  <span className="text-white font-bold text-lg">{licao.id}</span>
                </motion.div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{licao.tempo}</span>
                </div>
              </div>
              
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {licao.titulo}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                {licao.descricao}
              </p>
              
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  licao.nivel === 'Básico' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {licao.nivel}
                </span>
                <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                  Iniciar lição 
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {artigosFiltrados.map((artigo, index) => (
            <ArtigoCard key={artigo.id} artigo={artigo} index={index} />
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
