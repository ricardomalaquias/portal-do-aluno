import { ExternalLink, ShoppingCart, Wrench } from 'lucide-react';

export default function Shop() {
  const partners = [
    {
      id: 'hotmart',
      title: 'Dominando os Fundamentos da Bateria',
      subtitle: 'Curso Oficial - Ricardo Malaquias',
      description: 'Aprenda os rudimentos, grooves e técnicas essenciais para elevar seu nível na bateria.',
      link: 'https://hotmart.com/pt-br/marketplace/produtos/hagsxd-dominando-os-fundamentos-da-bateria-w3wcc/J102674511C',
      buttonText: 'Acessar Curso',
      bgColor: 'bg-gradient-to-r from-orange-500 to-red-500',
      active: true,
    },
    {
      id: 'padgorilla',
      title: 'PadGorilla',
      subtitle: 'Praticáveis de Alta Performance',
      description: 'A melhor borracha do mercado para você treinar seus rudimentos em qualquer lugar.',
      link: 'https://padgorilla.com.br/',
      buttonText: 'Garantir o meu',
      bgColor: 'bg-gradient-to-r from-zinc-800 to-black',
      active: true,
    },
    {
      id: 'bixocafe',
      title: 'Blend Blast Beat',
      subtitle: 'Bixo Café x Ric Malaquias',
      description: 'Um café de torra média-escura com a energia necessária para aguentar o bumbo duplo.',
      link: 'https://bixo.cafe/produtos/blast-beat-ric-malaquias-bixo-cafe/',
      buttonText: 'Comprar Café',
      bgColor: 'bg-gradient-to-r from-amber-700 to-yellow-900',
      active: true,
    },
    {
      id: 'domene',
      title: 'Domene Cymbals',
      subtitle: 'Pratos Artesanais',
      description: 'Os melhores pratos B20 do Brasil. A vitrine está sendo atualizada com a nova coleção.',
      link: '#',
      buttonText: 'Em Manutenção',
      bgColor: 'bg-gradient-to-r from-gray-400 to-gray-500',
      active: false,
    }
  ];

  return (
    <div className="space-y-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ShoppingCart size={24} className="text-indigo-600" />
          Shop & Parceiros
        </h1>
        <p className="text-sm text-gray-500">Equipamentos, cursos e descontos exclusivos.</p>
      </header>

      <div className="space-y-4">
        {partners.map((item) => (
          <div 
            key={item.id} 
            className={`${item.bgColor} rounded-2xl p-5 text-white shadow-md relative overflow-hidden`}
          >
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              <span className="text-[10px] uppercase tracking-wider font-bold opacity-80 mb-1 block">
                {item.subtitle}
              </span>
              <h2 className="text-xl font-bold mb-2 leading-tight">{item.title}</h2>
              <p className="text-sm opacity-90 mb-4 line-clamp-2">
                {item.description}
              </p>

              {item.active ? (
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-100 transition-colors active:scale-95"
                >
                  {item.buttonText}
                  <ExternalLink size={16} />
                </a>
              ) : (
                <button 
                  disabled
                  className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-bold cursor-not-allowed border border-white/30"
                >
                  <Wrench size={16} />
                  {item.buttonText}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}