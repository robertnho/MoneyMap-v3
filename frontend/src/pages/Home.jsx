import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PiggyBank,
  TrendingUp,
  Shield,
  Target,
  BookOpen,
  Users,
  Zap,
  Star,
  ArrowRight,
  ChevronRight,
  BarChart3,
  CheckCircle
} from "lucide-react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDemoAccess = async () => {
    setLoading(true);
    localStorage.setItem("demoMode", "true");
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="container max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <PiggyBank className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">MoneyMapp</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDemoAccess}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
            >
              Demonstração
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Fazer Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-28 px-6 text-center bg-gradient-to-r from-blue-600 to-purple-700 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">MoneyMapp TCC</h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">
            A plataforma de educação financeira que transforma sua vida
          </h2>
          <p className="text-lg opacity-90 mb-10 max-w-2xl mx-auto">
            Controle suas finanças, defina metas e aprenda a investir com uma experiência
            simples, moderna e intuitiva — feita especialmente para jovens estudantes e profissionais.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleDemoAccess}
              disabled={loading}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              Entrar em demonstração
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-transparent border-2 border-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105 shadow-lg"
            >
              Fazer login
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-white dark:bg-gray-900">
        <div className="container max-w-7xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-14">O que você encontra no MoneyMapp</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { icon: <PiggyBank className="w-10 h-10 text-blue-600" />, title: "Controle de Finanças", desc: "Monitore receitas e despesas em tempo real." },
              { icon: <Target className="w-10 h-10 text-green-600" />, title: "Metas Financeiras", desc: "Defina objetivos e acompanhe o progresso." },
              { icon: <TrendingUp className="w-10 h-10 text-purple-600" />, title: "Relatórios Visuais", desc: "Gráficos e dashboards para insights rápidos." },
              { icon: <BookOpen className="w-10 h-10 text-orange-600" />, title: "Educação Financeira", desc: "Aprenda com artigos e dicas de especialistas." }
            ].map((f, i) => (
              <div key={i} className="p-6 text-center rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-2 bg-gray-50 dark:bg-gray-800">
                <div className="mb-4 flex justify-center">{f.icon}</div>
                <h4 className="text-xl font-semibold mb-2">{f.title}</h4>
                <p className="text-gray-600 dark:text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-800">
        <div className="container max-w-7xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-12">Resultados que importam</h3>
          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <h4 className="text-5xl font-extrabold text-blue-600">+5.000</h4>
              <p className="text-gray-600 dark:text-gray-400">Usuários impactados</p>
            </div>
            <div>
              <h4 className="text-5xl font-extrabold text-green-600">92%</h4>
              <p className="text-gray-600 dark:text-gray-400">Atingiram suas metas</p>
            </div>
            <div>
              <h4 className="text-5xl font-extrabold text-purple-600">+R$ 1M</h4>
              <p className="text-gray-600 dark:text-gray-400">Economizados pelos usuários</p>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20 px-6 bg-white dark:bg-gray-900">
        <div className="container max-w-7xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-14">O que nossos usuários dizem</h3>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { name: "Maria Silva", desc: "Estudante", color: "bg-blue-500", text: "O MoneyMapp transformou minha forma de economizar e entender meu dinheiro!" },
              { name: "João Santos", desc: "Profissional", color: "bg-green-500", text: "As metas e relatórios visuais me ajudaram a ter clareza sobre minhas finanças." },
              { name: "Ana Costa", desc: "Recém-formada", color: "bg-purple-500", text: "Consegui juntar para minha primeira casa! Simplesmente incrível." }
            ].map((user, i) => (
              <div key={i} className="p-8 rounded-xl bg-gray-50 dark:bg-gray-800 shadow hover:shadow-lg transition-all">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 italic">"{user.text}"</p>
                <div className="flex items-center">
                  <div className={`w-10 h-10 ${user.color} rounded-full flex items-center justify-center text-white font-semibold`}>
                    {user.name[0]}
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-4xl font-bold mb-6">Pronto para mudar sua vida financeira?</h3>
          <p className="text-lg mb-10 opacity-90">Experimente agora o MoneyMapp e descubra como organizar seu dinheiro pode ser simples e motivador.</p>
          <button
            onClick={handleDemoAccess}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg inline-flex items-center gap-2"
          >
            Comece agora
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 px-6">
        <div className="container max-w-7xl mx-auto text-center space-y-3">
          <span className="text-xl font-bold">MoneyMapp</span>
          <p className="text-gray-400">© 2024 MoneyMapp TCC. Todos os direitos reservados.</p>
          <p className="text-gray-500 text-sm">Desenvolvido como Trabalho de Conclusão de Curso - TI</p>
        </div>
      </footer>
    </div>
  );
}
