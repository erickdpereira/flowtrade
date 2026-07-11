'use server';

// Re-export seguro: em arquivos "use server" o Next permite exportar APENAS funções async.
// Então fazemos wrappers async que delegam para ./action.

export async function realizarLogin(formData: FormData) {
  const mod = await import('./action');
  return mod.realizarLogin(formData);
}

export async function cadastrarLoja(formData: FormData) {
  const mod = await import('./action');
  return mod.cadastrarLoja(formData);
}

export async function criarProduto(formData: FormData) {
  const mod = await import('./action');
  return mod.criarProduto(formData);
}

export async function excluirProduto(id: string) {
  // Para uso em <form action={...}> no Next, a função precisa ter assinatura
  // compatível com server actions: (prevState, formData) => Promise<void>.
  // Como aqui usamos apenas o id, seguimos a assinatura mais comum (formData como opcional).
  const mod = await import('./action');
  return mod.excluirProduto(id);
}


export async function atualizarPrecosEmMassa(alteracoes: Array<{ id: string; preco: number }>) {
  const mod = await import('./action');
  return mod.atualizarPrecosEmMassa(alteracoes);
}

export async function adicionarFuncionario(formData: FormData) {
  const mod = await import('./action');
  return mod.adicionarFuncionario(formData);
}



