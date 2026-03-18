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
      bgColor: 'border-l-orange-500',
      active: true,
    },
    {
      id: 'padgorilla',
      title: 'PadGorilla',
      subtitle: 'Praticáveis de Alta Performance',
      description: 'A melhor borracha do mercado para você treinar seus rudimentos em qualquer lugar.',
      link: 'https://padgorilla.com.br/',
      buttonText: 'Garantir o meu',
      bgColor: 'border-l-zinc-300',
      active: true,
    },
    {
      id: 'bixocafe',
      title: 'Blend Blast Beat',
      subtitle: 'Bixo Café x Ric Malaquias',
      description: 'Um café de torra média-escura com a energia necessária para aguentar o bumbo duplo.',
      link: 'https://bixo.cafe/produtos/blast-beat-ric-malaquias-bixo-cafe/',
      buttonText: 'Comprar Café',
      bgColor: 'border-l-amber-700',
      active: true,
    },
    {
      id: 'domene',
      title: 'Domene Cymbals',
      subtitle: 'Pratos Artesanais',
      description: 'Os melhores pratos B20 do Brasil. A vitrine está sendo atualizada com a nova coleção.',
      link: '#',
      buttonText: 'Em Manutenção',
      bgColor: 'border-l-neutral-600',
      active: false,
    }
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <header className="flex items-center justify-between pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-50 tracking-tighter flex items-center gap-3">
            <ShoppingCart size={32} className="text-accent-600" />
            Shop & Parceiros
          </h1>
          <p className="text-sm text-neutral-400 mt-1">Equipamentos, cursos e descontos exclusivos para alunos.</p>
        </div>
      </header>

      {/* Grid Responsivo para a Vitrine */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((item) => (
          <div 
            key={item.id} 
            className={`bg-neutral-900 rounded-3xl p-6 text-neutral-100 shadow-xl border border-neutral-800 border-l-4 ${item.bgColor} flex flex-col justify-between transition-all hover:border-neutral-700 hover:-translate-y-1`}
          >
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-accent-600 mb-1 block">
                {item.subtitle}
              </span>
              <h2 className="text-xl font-bold mb-2 leading-tight text-neutral-50">{item.title}</h2>
              <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
                {item.description}
              </p>
            </div>

            {item.active ? (
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-neutral-50 text-neutral-950 px-4 py-3 rounded-xl text-sm font-bold shadow-sm hover:bg-neutral-200 transition-colors active:scale-95"
              >
                {item.buttonText}
                <ExternalLink size={16} />
              </a>
            ) : (
              <button 
                disabled
                className="w-full flex items-center justify-center gap-2 bg-neutral-800 text-neutral-500 px-4 py-3 rounded-xl text-sm font-bold cursor-not-allowed border border-neutral-700"
              >
                <Wrench size={16} />
                {item.buttonText}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}