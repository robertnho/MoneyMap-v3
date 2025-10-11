import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, BookOpen, TrendingUp, PiggyBank, Shield, Target, Lightbulb, Play, Clock, CheckCircle, Star, GraduationCap, Zap, Calendar } from 'lucide-react'

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
    blue: 'from-indigo-500 to-sky-400',
    red: 'from-red-500 to-pink-400',
    green: 'from-emerald-500 to-teal-400',
    purple: 'from-purple-500 to-violet-400'
  }

  const Icon = categoria.icone

  return (
    <div className="group cursor-pointer rounded-2xl border border-zinc-200/60 bg-white/70 backdrop-blur-md shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl p-6 dark:border-white/10 dark:bg-zinc-900/70">
      <div className="flex flex-col items-center text-center">
        <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${iconMap[categoria.cor]} shadow-md transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
        
        <h3 className="mb-2 text-lg font-semibold text-zinc-800 dark:text-white">{categoria.titulo}</h3>
        <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{categoria.descricao}</p>
        
        <div className="mt-auto flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-100 to-indigo-100 px-3 py-1 text-xs font-medium text-violet-700 dark:from-violet-900/30 dark:to-indigo-900/30 dark:text-violet-300">
          <BookOpen className="h-3 w-3" />
          <span>{categoria.artigos} artigos</span>
        </div>
      </div>
    </div>
  )
}

function ArtigoCard({ artigo }) {
  const navigate = useNavigate()

  return (
    <div 
      className="group cursor-pointer rounded-2xl border border-zinc-200/60 bg-white/70 backdrop-blur-sm shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl p-6 dark:border-white/10 dark:bg-zinc-900/70"
      onClick={() => navigate(`/educacao/artigo/${artigo.id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-zinc-800 dark:text-white pr-4 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{artigo.titulo}</h3>
        {artigo.concluido ? (
          <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
        ) : (
          <Play className="w-6 h-6 text-violet-500 flex-shrink-0" />
        )}
      </div>
      
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
          <Clock className="w-4 h-4" />
          <span>{artigo.tempo}</span>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${
          artigo.dificuldade === 'Iniciante' 
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' 
            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
        }`}>
          {artigo.dificuldade}
        </span>
      </div>
      
      <p className="text-zinc-600 dark:text-zinc-300 text-sm mb-6 leading-relaxed">
        {artigo.conteudo.substring(0, 180)}...
      </p>
      
      <button className={`w-full rounded-xl py-3 px-4 font-medium text-sm transition-all duration-200 ${
        artigo.concluido
          ? 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
          : 'bg-gradient-to-r from-indigo-500 to-sky-400 text-white shadow-md hover:opacity-90 hover:-translate-y-0.5'
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
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Fundo full-bleed */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-200 via-indigo-200 to-blue-300 dark:from-zinc-950 dark:via-violet-950/20 dark:to-purple-950/30" />
        <div className="absolute -top-24 -left-24 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r from-violet-400/20 to-purple-500/20 blur-3xl" />
        <div
          className="absolute -bottom-32 -right-32 h-80 w-80 animate-pulse rounded-full bg-gradient-to-r from-indigo-400/20 to-violet-500/20 blur-3xl"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute left-1/4 top-1/3 h-64 w-64 animate-pulse rounded-full bg-gradient-to-r from-purple-400/10 to-fuchsia-400/10 blur-2xl"
          style={{ animationDelay: '4s' }}
        />
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.9) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-20 w-full border-b border-zinc-200/60 bg-white/90 backdrop-blur-xl shadow-lg shadow-zinc-100/50 dark:border-white/10 dark:bg-zinc-900/90 dark:shadow-zinc-900/50">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="text-center">
              <h1 className="bg-gradient-to-r from-zinc-900 to-zinc-700 bg-clip-text text-3xl font-bold text-transparent dark:from-zinc-100 dark:to-zinc-300">
                Educação Financeira
              </h1>
              <p className="flex items-center justify-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span>
                Aprenda a gerenciar suas finanças com conteúdo prático
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-zinc-200/60 bg-white/70 backdrop-blur-sm px-4 py-2 shadow-sm dark:border-white/10 dark:bg-zinc-800/70">
            <Star className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">2 de 4 artigos concluídos</span>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="mx-auto max-w-[1600px] px-6 pb-6 lg:px-8 space-y-8">
        {/* Seção Categorias */}
        <div className="pt-6">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-2">📚 Explore por Categoria</h2>
            <p className="text-zinc-600 dark:text-zinc-400">Escolha o tema que mais se adequa às suas necessidades</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categorias.map((categoria) => (
              <CategoriaCard key={categoria.id} categoria={categoria} />
            ))}
          </div>
        </div>

        {/* Dicas Rápidas do Dia */}
        <div className="group rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 dark:border-emerald-800/30">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">💡 Dicas Rápidas do Dia</h3>
              <p className="text-sm text-emerald-600/70 dark:text-emerald-400/70">Pequenas mudanças, grandes resultados</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dicasRapidas.map((dica, index) => {
              const emojis = ['💰', '📅', '🎯', '💡', '📚']
              return (
                <div key={index} className="rounded-xl bg-white/60 backdrop-blur-sm border border-white/20 p-4 dark:bg-zinc-800/60">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 text-lg dark:from-emerald-900/30 dark:to-teal-900/30">
                      <span>{emojis[index]}</span>
                    </div>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{dica}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Artigos Recomendados */}
        <div>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-2">📖 Artigos Recomendados</h2>
              <p className="text-zinc-600 dark:text-zinc-400">Conteúdo selecionado para acelerar seu aprendizado</p>
            </div>
            
            <select 
              value={categoriaSelecionada}
              onChange={(e) => setCategoriaSelecionada(e.target.value)}
              className="rounded-xl border border-zinc-200/60 bg-white/80 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm backdrop-blur transition-all duration-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:border-white/10 dark:bg-zinc-800/80 dark:text-zinc-300"
            >
              <option value="todas">Todas as categorias</option>
              <option value="orcamento">Orçamento</option>
              <option value="dividas">Dívidas</option>
              <option value="reserva">Reserva de Emergência</option>
              <option value="investimentos">Investimentos</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {artigosFiltrados.map((artigo) => (
              <ArtigoCard key={artigo.id} artigo={artigo} />
            ))}
          </div>
        </div>

        {/* Progresso */}
        <div className="rounded-2xl border border-zinc-200/60 bg-white/70 backdrop-blur-sm shadow-lg p-6 dark:border-white/10 dark:bg-zinc-900/70">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">📊 Seu Progresso</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Acompanhe sua jornada de aprendizado</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Artigos Concluídos</span>
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">2 de 4 (50%)</span>
              </div>
              <div className="h-3 w-full rounded-full bg-zinc-200 dark:bg-zinc-700">
                <div className="h-3 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-700" style={{ width: '50%' }}></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 p-4 dark:from-indigo-900/20 dark:to-blue-900/20">
                <div className="mb-1 flex items-center justify-center gap-1">
                  <Clock className="h-4 w-4 text-indigo-500" />
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">12</p>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Minutos de leitura</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 p-4 dark:from-emerald-900/20 dark:to-teal-900/20">
                <div className="mb-1 flex items-center justify-center gap-1">
                  <Star className="h-4 w-4 text-emerald-500" />
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">85</p>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Pontos XP ganhos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Frase Motivacional */}
        <div className="text-center italic text-zinc-500 dark:text-zinc-400 mt-8 mb-4">
          💬 "O conhecimento é o primeiro passo para a liberdade financeira."
        </div>

        {/* Rodapé */}
        <div className="pt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
          © 2024 MoneyMapp TCC. Todos os direitos reservados.
        </div>
      </div>
    </div>
  )
}
