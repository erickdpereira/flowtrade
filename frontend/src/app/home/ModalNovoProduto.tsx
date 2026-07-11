'use client';
import { useState } from 'react';
import { Plus, X, Package, DollarSign } from 'lucide-react';
import { criarProduto } from '../actions'; // Puxa a ação segura que você acabou de criar

export default function ModalNovoProduto() {
  const [isOpen, setIsOpen] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    const formData = new FormData(e.currentTarget);
    const resultado = await criarProduto(formData);

    if (resultado?.erro) {
      setErro(resultado.erro);
    } else {
      setIsOpen(false); // Fecha o modal instantaneamente se der certo
    }
    setCarregando(false);
  };

  return (
    <>
      {/* Botão que fica na tela principal */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]"
      >
        <Plus size={20} />
        Novo Produto
      </button>

      {/* A Janela Modal (só aparece se isOpen for true) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1120]/80 backdrop-blur-sm">
          <div className="bg-[#1e293b] border border-slate-700 w-full max-w-md rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.8)] relative animate-in fade-in zoom-in duration-200">
            
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-black text-white mb-6 tracking-tight">Cadastrar Produto</h2>

            {erro && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-400 text-sm rounded-lg text-center">
                {erro}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-300 ml-1">Nome do Produto</label>
                <div className="relative mt-1">
                  <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    name="nome"
                    type="text"
                    required
                    placeholder="Ex: Teclado Mecânico"
                    className="w-full bg-[#0f172a]/80 border border-slate-700 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 ml-1">Categoria</label>
                <div className="relative mt-1">
                  <select
                    name="categoria"
                    required
                    className="w-full bg-[#0f172a]/80 border border-slate-700 text-white rounded-xl pl-4 pr-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Selecione uma categoria
                    </option>
                    {/* TODO: aqui vamos carregar a lista de categorias da API */}
                    <option value="">(Crie/Selecione na tela Categorias)</option>
                  </select>

                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 ml-1">Preço de Venda (R$)</label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    name="preco"
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    className="w-full bg-[#0f172a]/80 border border-slate-700 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>


              <button
                type="submit"
                disabled={carregando}
                className="w-full mt-8 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                {carregando ? 'Salvando...' : 'Salvar no Estoque'}
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
}