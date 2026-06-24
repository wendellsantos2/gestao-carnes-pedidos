export const OUTRO_ESTADO = '__OUTRO_ESTADO__'
export const OUTRO_CIDADE = '__OUTRO_CIDADE__'

export const LABEL_OUTRO_ESTADO = 'Outro (informar UF)'
export const LABEL_OUTRO_CIDADE = 'Outro (informar cidade)'

export interface EstadoBrasil {
  uf: string
  nome: string
}

export const ESTADOS_BRASIL: EstadoBrasil[] = [
  { uf: 'AC', nome: 'Acre' },
  { uf: 'AL', nome: 'Alagoas' },
  { uf: 'AP', nome: 'Amapá' },
  { uf: 'AM', nome: 'Amazonas' },
  { uf: 'BA', nome: 'Bahia' },
  { uf: 'CE', nome: 'Ceará' },
  { uf: 'DF', nome: 'Distrito Federal' },
  { uf: 'ES', nome: 'Espírito Santo' },
  { uf: 'GO', nome: 'Goiás' },
  { uf: 'MA', nome: 'Maranhão' },
  { uf: 'MT', nome: 'Mato Grosso' },
  { uf: 'MS', nome: 'Mato Grosso do Sul' },
  { uf: 'MG', nome: 'Minas Gerais' },
  { uf: 'PA', nome: 'Pará' },
  { uf: 'PB', nome: 'Paraíba' },
  { uf: 'PR', nome: 'Paraná' },
  { uf: 'PE', nome: 'Pernambuco' },
  { uf: 'PI', nome: 'Piauí' },
  { uf: 'RJ', nome: 'Rio de Janeiro' },
  { uf: 'RN', nome: 'Rio Grande do Norte' },
  { uf: 'RS', nome: 'Rio Grande do Sul' },
  { uf: 'RO', nome: 'Rondônia' },
  { uf: 'RR', nome: 'Roraima' },
  { uf: 'SC', nome: 'Santa Catarina' },
  { uf: 'SP', nome: 'São Paulo' },
  { uf: 'SE', nome: 'Sergipe' },
  { uf: 'TO', nome: 'Tocantins' },
]

export const CIDADES_POR_ESTADO: Record<string, string[]> = {
  AC: ['Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira'],
  AL: ['Maceió', 'Arapiraca', 'Palmeira dos Índios'],
  AP: ['Macapá', 'Santana', 'Laranjal do Jari'],
  AM: ['Manaus', 'Parintins', 'Itacoatiara'],
  BA: ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Ilhéus', 'Juazeiro'],
  CE: ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Sobral'],
  DF: ['Brasília'],
  ES: ['Vitória', 'Vila Velha', 'Serra', 'Cariacica', 'Linhares'],
  GO: ['Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde'],
  MA: ['São Luís', 'Imperatriz', 'Timon', 'Caxias'],
  MT: ['Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop'],
  MS: ['Campo Grande', 'Dourados', 'Três Lagoas', 'Corumbá'],
  MG: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim', 'Montes Claros'],
  PA: ['Belém', 'Ananindeua', 'Santarém', 'Marabá'],
  PB: ['João Pessoa', 'Campina Grande', 'Patos', 'Bayeux'],
  PR: ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel', 'Foz do Iguaçu'],
  PE: ['Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Caruaru', 'Petrolina'],
  PI: ['Teresina', 'Parnaíba', 'Picos', 'Floriano'],
  RJ: ['Rio de Janeiro', 'Niterói', 'Duque de Caxias', 'São Gonçalo', 'Nova Iguaçu', 'Campos dos Goytacazes'],
  RN: ['Natal', 'Mossoró', 'Parnamirim', 'São Gonçalo do Amarante'],
  RS: ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Canoas', 'Santa Maria', 'Novo Hamburgo'],
  RO: ['Porto Velho', 'Ji-Paraná', 'Ariquemes', 'Vilhena'],
  RR: ['Boa Vista', 'Rorainópolis', 'Caracaraí'],
  SC: ['Florianópolis', 'Joinville', 'Blumenau', 'São José', 'Chapecó', 'Itajaí'],
  SP: ['São Paulo', 'Campinas', 'Santos', 'São Bernardo do Campo', 'Sorocaba', 'Ribeirão Preto', 'Osasco'],
  SE: ['Aracaju', 'Nossa Senhora do Socorro', 'Lagarto', 'Itabaiana'],
  TO: ['Palmas', 'Araguaína', 'Gurupi', 'Porto Nacional'],
}

export function listarCidadesPorEstado(uf: string): string[] {
  return CIDADES_POR_ESTADO[uf] ?? []
}

export function isEstadoValido(uf: string): boolean {
  return ESTADOS_BRASIL.some((estado) => estado.uf === uf)
}

export function isCidadeValidaParaEstado(cidade: string, uf: string): boolean {
  return listarCidadesPorEstado(uf).includes(cidade)
}

export function isOutroEstado(value: string): boolean {
  return value === OUTRO_ESTADO
}

export function isOutroCidade(value: string): boolean {
  return value === OUTRO_CIDADE
}

export interface CompradorLocalidadeInput {
  estadoSelecionado: string
  estadoCustom: string
  cidadeSelecionada: string
  cidadeCustom: string
}

export function resolveCompradorLocalidade(input: CompradorLocalidadeInput): {
  estado: string
  cidade: string
} {
  const estado = isOutroEstado(input.estadoSelecionado)
    ? input.estadoCustom.trim().toUpperCase()
    : input.estadoSelecionado

  const cidade = isOutroCidade(input.cidadeSelecionada)
    ? input.cidadeCustom.trim()
    : input.cidadeSelecionada

  return { estado, cidade }
}

export function inicializarLocalidadeComprador(comprador?: {
  estado: string
  cidade: string
} | null): CompradorLocalidadeInput {
  if (!comprador) {
    return {
      estadoSelecionado: '',
      estadoCustom: '',
      cidadeSelecionada: '',
      cidadeCustom: '',
    }
  }

  const estadoNaLista = isEstadoValido(comprador.estado)
  const cidades = estadoNaLista ? listarCidadesPorEstado(comprador.estado) : []
  const cidadeNaLista = cidades.includes(comprador.cidade)

  return {
    estadoSelecionado: estadoNaLista ? comprador.estado : OUTRO_ESTADO,
    estadoCustom: estadoNaLista ? '' : comprador.estado,
    cidadeSelecionada: cidadeNaLista ? comprador.cidade : OUTRO_CIDADE,
    cidadeCustom: cidadeNaLista ? '' : comprador.cidade,
  }
}
