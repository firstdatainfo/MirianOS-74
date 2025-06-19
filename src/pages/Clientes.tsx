"use client"

import type React from "react"
import { useState } from "react"
import Header from "@/components/Header"
import Sidebar from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Users,
  UserPlus,
  Search,
  Edit,
  Trash2,
  X,
  Eye,
  EyeOff,
  MoreVertical,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  BadgeIcon as IdCard,
  User,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useInputMask } from "@/hooks/useInputMask"
import { useClientes, type Cliente } from "@/hooks/useClientes"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"

const Clientes = () => {
  // Hooks e estados
  const { maskCEP, maskTelefone, maskCPF, maskCNPJ, maskRG } = useInputMask()
  const { clientes, loading, error, addCliente, updateCliente, deleteCliente } = useClientes()

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [busca, setBusca] = useState("")

  const [activeTab, setActiveTab] = useState<"fisica" | "juridica">("fisica")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [buscandoCep, setBuscandoCep] = useState(false)
  const [reducedWidth, setReducedWidth] = useState(false)
  const [formData, setFormData] = useState<Partial<Cliente>>({
    tipo: "fisica",
    nome: "",
    cpf: "",
    rg: "",
    data_nascimento: "",
    razao_social: "",
    nome_fantasia: "",
    cnpj: "",
    inscricao_estadual: "",
    telefone: "",
    email: "",
    endereco: "",
    bairro: "",
    cep: "",
    cidade: "",
    estado: "",
    ativo: true,
  })

  // Funções auxiliares
  const resetForm = () => {
    setFormData({
      tipo: "fisica",
      nome: "",
      cpf: "",
      rg: "",
      data_nascimento: "",
      razao_social: "",
      nome_fantasia: "",
      cnpj: "",
      inscricao_estadual: "",
      telefone: "",
      email: "",
      endereco: "",
      bairro: "",
      cep: "",
      cidade: "",
      estado: "",
      ativo: true,
    })
    setActiveTab("fisica")
    setEditingId(null)
  }

  // Função para validar CPF
  const validarCPF = (cpf: string) => {
    cpf = cpf.replace(/[\D]/g, "")
    if (cpf.length !== 11) return false

    // Validação de dígitos repetidos
    if (/^(\d)\1{10}$/.test(cpf)) return false

    // Validação do primeiro dígito verificador
    let soma = 0
    for (let i = 0; i < 9; i++) {
      soma += Number.parseInt(cpf.charAt(i)) * (10 - i)
    }
    let resto = (soma * 10) % 11
    if (resto === 10 || resto === 11) resto = 0
    if (resto !== Number.parseInt(cpf.charAt(9))) return false

    // Validação do segundo dígito verificador
    soma = 0
    for (let i = 0; i < 10; i++) {
      soma += Number.parseInt(cpf.charAt(i)) * (11 - i)
    }
    resto = (soma * 10) % 11
    if (resto === 10 || resto === 11) resto = 0
    if (resto !== Number.parseInt(cpf.charAt(10))) return false

    return true
  }

  // Função para validar CNPJ
  const validarCNPJ = (cnpj: string) => {
    cnpj = cnpj.replace(/[\D]/g, "")
    if (cnpj.length !== 14) return false

    // Validação de dígitos repetidos
    if (/^(\d)\1{13}$/.test(cnpj)) return false

    // Validação do primeiro dígito verificador
    let tamanho = cnpj.length - 2
    let numeros = cnpj.substring(0, tamanho)
    const digitos = cnpj.substring(tamanho)
    let soma = 0
    let pos = tamanho - 7

    for (let i = tamanho; i >= 1; i--) {
      soma += Number.parseInt(numeros.charAt(tamanho - i)) * pos--
      if (pos < 2) pos = 9
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
    if (resultado !== Number.parseInt(digitos.charAt(0))) return false

    // Validação do segundo dígito verificador
    tamanho = tamanho + 1
    numeros = cnpj.substring(0, tamanho)
    soma = 0
    pos = tamanho - 7

    for (let i = tamanho; i >= 1; i--) {
      soma += Number.parseInt(numeros.charAt(tamanho - i)) * pos--
      if (pos < 2) pos = 9
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
    if (resultado !== Number.parseInt(digitos.charAt(1))) return false

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Validação de CPF/CNPJ
      if (activeTab === "fisica" && formData.cpf && !validarCPF(formData.cpf)) {
        toast.error("CPF inválido")
        return
      }

      if (activeTab === "juridica" && formData.cnpj && !validarCNPJ(formData.cnpj)) {
        toast.error("CNPJ inválido")
        return
      }
      // Validação básica
      if (!formData.nome) {
        toast.error("O nome é obrigatório")
        return
      }

      // Validação de CNPJ obrigatório para pessoa jurídica
      if (activeTab === "juridica" && !formData.cnpj) {
        toast.error("O CNPJ é obrigatório para pessoa jurídica")
        return
      }

      // Validação de e-mail
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast.error("Por favor, insira um e-mail válido")
        return
      }

      // Prepara os dados com base no tipo de cliente
      const dadosCliente: Omit<Cliente, "id" | "data_cadastro"> = {
        ...formData,
        tipo: activeTab,
        // Garante que campos vazios sejam null
        nome: formData.nome.trim(),
        telefone: formData.telefone?.trim() || null,
        email: formData.email?.trim() || null,
        endereco: formData.endereco?.trim() || null,
        bairro: formData.bairro?.trim() || null,
        cep: formData.cep?.replace(/\D/g, "") || null,
        cidade: formData.cidade?.trim() || null,
        estado: formData.estado?.trim().toUpperCase() || null,
        ativo: formData.ativo ?? true,
        // Campos específicos para pessoa física
        cpf: activeTab === "fisica" ? formData.cpf?.replace(/\D/g, "") || null : null,
        rg: activeTab === "fisica" ? formData.rg?.trim() || null : null,
        data_nascimento: activeTab === "fisica" ? formData.data_nascimento || null : null,
        // Campos específicos para pessoa jurídica
        razao_social: activeTab === "juridica" ? formData.razao_social?.trim() || null : null,
        nome_fantasia: activeTab === "juridica" ? formData.nome_fantasia?.trim() || null : null,
        cnpj: activeTab === "juridica" ? formData.cnpj?.replace(/\D/g, "") || null : null,
        inscricao_estadual: activeTab === "juridica" ? formData.inscricao_estadual?.trim() || null : null,
      }

      setIsSubmitting(true)
      if (editingId) {
        await updateCliente(editingId, dadosCliente)
        toast.success("Cliente atualizado com sucesso!")
      } else {
        await addCliente(dadosCliente)
        toast.success("Cliente adicionado com sucesso!")
      }

      resetForm()
      setShowForm(false)
    } catch (error) {
      console.error("Erro ao salvar cliente:", error)
      toast.error("Erro ao salvar cliente. Por favor, tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (cliente: Cliente) => {
    setActiveTab(cliente.tipo || "fisica")
    setFormData({
      tipo: cliente.tipo || "fisica",
      nome: cliente.nome || "",
      telefone: cliente.telefone || "",
      email: cliente.email || "",
      endereco: cliente.endereco || "",
      bairro: cliente.bairro || "",
      cep: cliente.cep || "",
      cidade: cliente.cidade || "",
      estado: cliente.estado || "",
      ativo: cliente.ativo ?? true,
      // Campos específicos para pessoa física
      cpf: cliente.cpf || "",
      rg: cliente.rg || "",
      data_nascimento: cliente.data_nascimento || "",
      // Campos específicos para pessoa jurídica
      razao_social: cliente.razao_social || "",
      nome_fantasia: cliente.nome_fantasia || "",
      cnpj: cliente.cnpj || "",
      inscricao_estadual: cliente.inscricao_estadual || "",
    })
    setEditingId(cliente.id)
    setShowForm(true)
  }

  const handleTabChange = (tab: "fisica" | "juridica") => {
    setActiveTab(tab)
    setFormData((prev) => ({
      ...prev,
      tipo: tab,
    }))
  }

  const handleDelete = async (id: string) => {
    // Encontra o cliente para mostrar o nome na mensagem de confirmação
    const cliente = clientes.find((c) => c.id === id)

    if (!cliente) {
      toast.error("Cliente não encontrado")
      return
    }

    // Mostra um diálogo de confirmação
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir o cliente "${cliente.nome}"?\n\n` + "Esta ação não pode ser desfeita.",
    )

    if (!confirmDelete) return

    try {
      await deleteCliente(id)
      toast.success("Cliente excluído com sucesso!")
    } catch (error) {
      console.error("Erro ao excluir cliente:", error)
      toast.error("Erro ao excluir cliente. Tente novamente.")
    }
  }

  const toggleStatus = async (cliente: Cliente) => {
    try {
      await updateCliente(cliente.id, { ativo: !cliente.ativo })
      toast.success(`Cliente ${cliente.ativo ? "desativado" : "ativado"} com sucesso!`)
    } catch (error) {
      console.error("Erro ao atualizar status do cliente:", error)
      toast.error("Erro ao atualizar status do cliente. Tente novamente.")
    }
  }

  const buscarEnderecoPorCEP = async (cep: string) => {
    try {
      const cepLimpo = cep.replace(/\D/g, "")
      if (cepLimpo.length !== 8) return

      setBuscandoCep(true)

      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const data = await response.json()

      if (data.erro) {
        toast.error("CEP não encontrado")
        return
      }

      setFormData((prev) => ({
        ...prev,
        cep: cepLimpo,
        endereco: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        estado: data.uf || "",
      }))

      toast.success("Endereço preenchido automaticamente")
    } catch (error) {
      console.error("Erro ao buscar endereço:", error)
      toast.error("Erro ao buscar endereço. Verifique o CEP e tente novamente.")
    } finally {
      setBuscandoCep(false)
    }
  }

  // Função para formatar telefone com máscara dinâmica
  const formatarTelefone = (value: string) => {
    const numeros = value.replace(/\D/g, "")

    if (numeros.length <= 10) {
      // Formato para telefone fixo: (00) 0000-0000
      return numeros
        .replace(/(\d{0,2})/, "($1")
        .replace(/(\(\d{2})(\d)/, "$1) $2")
        .replace(/(\d{4})(\d{1,4})/, "$1-$2")
        .replace(/(-\d{4})\d+?$/, "$1")
    } else {
      // Formato para celular: (00) 00000-0000
      return numeros
        .replace(/(\d{0,2})/, "($1")
        .replace(/(\(\d{2})(\d)/, "$1) $2")
        .replace(/(\d{5})(\d{1,4})/, "$1-$2")
        .replace(/(-\d{4})\d+?$/, "$1")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    // Se for o campo de CEP, remove formatação e busca o endereço se tiver 8 dígitos
    if (field === "cep") {
      const cepLimpo = value.replace(/\D/g, "")
      setFormData((prev) => ({
        ...prev,
        cep: cepLimpo,
      }))

      if (cepLimpo.length === 8) {
        buscarEnderecoPorCEP(cepLimpo)
      }
      return
    }

    // Se for telefone, aplica a máscara de formatação
    if (field === "telefone") {
      const telefoneLimpo = value.replace(/\D/g, "")
      setFormData((prev) => ({
        ...prev,
        telefone: telefoneLimpo,
      }))
      return
    }

    // Para CPF, CNPJ e RG, apenas remove caracteres não numéricos
    if (["cpf", "cnpj", "rg"].includes(field)) {
      setFormData((prev) => ({
        ...prev,
        [field]: value.replace(/\D/g, ""),
      }))
      return
    }

    // Para os demais campos, apenas atualiza o valor
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Filtra os clientes com base na busca
  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (cliente.email && cliente.email.toLowerCase().includes(busca.toLowerCase())) ||
      (cliente.telefone && cliente.telefone.includes(busca)),
  )

  const handleViewDetails = (cliente: Cliente) => {
    // For now, just log and toast. Later, this can open a modal or navigate.
    console.log("Visualizando detalhes do cliente:", cliente)
    toast.info(`Detalhes de: ${cliente.nome}`, {
      description: `Tipo: ${cliente.tipo || "N/A"}, Email: ${cliente.email || "N/A"}, Tel: ${cliente.telefone || "N/A"}`,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex overflow-hidden relative">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 bg-grid-primary/10 mask-gradient-to-b pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-primary/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-secondary/20 rounded-full blur-3xl animate-pulse-slow" />
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6 space-y-6 relative z-10 container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-primary rounded-lg shadow-neon-primary/30">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-glow">
                Gestão de Clientes
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-72 md:w-auto">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Buscar clientes..."
                  className="pl-10 w-full bg-white/60 border-white/30 backdrop-blur-sm focus:border-primary/30 focus:shadow-neon-primary/20 transition-all duration-300"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
              <Button
                onClick={() => {
                  resetForm()
                  setShowForm(true)
                }}
                className="w-full sm:w-auto bg-gradient-primary text-white hover:shadow-neon-primary/50 transition-all duration-300 hover:scale-105 shadow-md"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Novo Cliente
              </Button>
            </div>
          </div>

          {/* Formulário de cadastro/edição */}
          {showForm && (
            <Card className="animate-fade-in bg-white/80 backdrop-blur-sm border border-white/20 shadow-neon-primary/10 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{editingId ? "Editar Cliente" : "Novo Cliente"}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="pt-3">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Abas para selecionar o tipo de cliente */}
                  <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                      <button
                        type="button"
                        onClick={() => handleTabChange("fisica")}
                        className={`${
                          activeTab === "fisica"
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                      >
                        Pessoa Física
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTabChange("juridica")}
                        className={`${
                          activeTab === "juridica"
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                      >
                        Pessoa Jurídica
                      </button>
                    </nav>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Campos comuns */}
                    <h3 className="text-md font-semibold mt-4 mb-3 text-gray-700 border-b pb-2 col-span-1 sm:col-span-2">
                      {activeTab === "fisica" ? "Dados Pessoais" : "Dados Empresariais"}
                    </h3>
                    <div>
                      <Label htmlFor="nome">{activeTab === "fisica" ? "Nome Completo *" : "Nome Fantasia *"}</Label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          id="nome"
                          className="pl-10 bg-white/50 border border-white/20 focus:border-primary/20 focus:shadow-neon-primary/20 transition-all duration-300 backdrop-blur-sm"
                          value={formData.nome}
                          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {/* Campo Razão Social (apenas PJ) */}
                    {activeTab === "juridica" && (
                      <div>
                        <Label htmlFor="razao_social">Razão Social *</Label>
                        <div className="relative mt-1">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Briefcase className="h-4 w-4 text-gray-400" />
                          </div>
                          <Input
                            id="razao_social"
                            className="pl-10 bg-white/50 border border-white/20 focus:border-primary/20 focus:shadow-neon-primary/20 transition-all duration-300 backdrop-blur-sm"
                            value={formData.razao_social || ""}
                            onChange={(e) => setFormData({ ...formData, razao_social: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    )}

                    {/* Campo CPF/CNPJ */}
                    <div>
                      <Label htmlFor={activeTab === "fisica" ? "cpf" : "cnpj"}>
                        {activeTab === "fisica" ? "CPF" : "CNPJ *"}
                      </Label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <IdCard className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          id={activeTab === "fisica" ? "cpf" : "cnpj"}
                          className="pl-10 bg-white/50 border border-white/20 focus:border-primary/20 focus:shadow-neon-primary/20 transition-all duration-300 backdrop-blur-sm"
                          value={
                            activeTab === "fisica"
                              ? formData.cpf
                                ? maskCPF(formData.cpf)
                                : ""
                              : formData.cnpj
                                ? maskCNPJ(formData.cnpj)
                                : ""
                          }
                          onChange={(e) => {
                            if (activeTab === "fisica") {
                              setFormData({ ...formData, cpf: e.target.value.replace(/\D/g, "") })
                            } else {
                              setFormData({ ...formData, cnpj: e.target.value.replace(/\D/g, "") })
                            }
                          }}
                          placeholder={activeTab === "fisica" ? "000.000.000-00" : "00.000.000/0000-00"}
                          required={activeTab === "juridica"}
                        />
                      </div>
                    </div>

                    {/* Campo RG/Inscrição Estadual */}
                    <div>
                      <Label htmlFor={activeTab === "fisica" ? "rg" : "inscricao_estadual"}>
                        {activeTab === "fisica" ? "RG" : "Inscrição Estadual"}
                      </Label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <IdCard className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          id={activeTab === "fisica" ? "rg" : "inscricao_estadual"}
                          className="pl-10 bg-white/50 border border-white/20 focus:border-primary/20 focus:shadow-neon-primary/20 transition-all duration-300 backdrop-blur-sm"
                          value={
                            activeTab === "fisica"
                              ? formData.rg
                                ? maskRG(formData.rg)
                                : ""
                              : formData.inscricao_estadual || ""
                          }
                          onChange={(e) => {
                            if (activeTab === "fisica") {
                              setFormData({ ...formData, rg: e.target.value.replace(/\D/g, "") })
                            } else {
                              setFormData({ ...formData, inscricao_estadual: e.target.value })
                            }
                          }}
                          placeholder={activeTab === "fisica" ? "00.000.000-0" : "Inscrição Estadual"}
                        />
                      </div>
                    </div>

                    {/* Campo Data de Nascimento (apenas PF) */}
                    {activeTab === "fisica" && (
                      <div>
                        <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                        <Input
                          id="data_nascimento"
                          type="date"
                          className="bg-white/50 border border-white/20 focus:border-primary/20 focus:shadow-neon-primary/20 transition-all duration-300 backdrop-blur-sm"
                          value={formData.data_nascimento || ""}
                          onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
                        />
                      </div>
                    )}

                    <h3 className="text-md font-semibold mt-4 mb-3 text-gray-700 border-b pb-2 col-span-1 sm:col-span-2">
                      Informações de Contato
                    </h3>
                    <div>
                      <Label htmlFor="telefone">Telefone *</Label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-4 w-4 text-gray-400" />
                        </div>
                        {/* The +55 prefix can be an inner absolute span or part of the input's left padding design */}
                        <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
                          +55
                        </span>
                        <Input
                          id="telefone"
                          className="pl-[calc(2.5rem+25px)] bg-white/50 border border-white/20 focus:border-primary/20 focus:shadow-neon-primary/20 transition-all duration-300 backdrop-blur-sm" // Adjusted padding
                          value={formData.telefone ? formatarTelefone(formData.telefone) : ""}
                          onChange={(e) => handleInputChange("telefone", e.target.value)}
                          placeholder="(00) 00000-0000"
                          required
                        />
                      </div>
                    </div>

                    {/* Campo E-mail */}
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          id="email"
                          type="email"
                          className="pl-10 bg-white/50 border border-white/20 focus:border-primary/20 focus:shadow-neon-primary/20 transition-all duration-300 backdrop-blur-sm"
                          value={formData.email || ""}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <h3 className="text-md font-semibold mt-4 mb-3 text-gray-700 border-b pb-2 col-span-1 sm:col-span-2">
                      Endereço
                    </h3>
                    {/* Campo CEP */}
                    <div>
                      <Label htmlFor="cep">CEP</Label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          id="cep"
                          className="pl-10 bg-white/50 border border-white/20 focus:border-primary/20 focus:shadow-neon-primary/20 transition-all duration-300 backdrop-blur-sm"
                          value={formData.cep ? maskCEP(formData.cep) : ""}
                          onChange={(e) => setFormData({ ...formData, cep: e.target.value.replace(/\D/g, "") })}
                          placeholder="00000-000"
                        />
                        {buscandoCep && (
                          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
                        )}
                      </div>
                    </div>

                    {/* Campo Endereço */}
                    <div>
                      <Label htmlFor="endereco">Endereço</Label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          id="endereco"
                          className="pl-10 bg-white/50 border border-white/20 focus:border-primary/20 focus:shadow-neon-primary/20 transition-all duration-300 backdrop-blur-sm"
                          value={formData.endereco || ""}
                          onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bairro">Bairro</Label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          id="bairro"
                          className="pl-10 bg-white/50 border border-white/20 focus:border-primary/20 focus:shadow-neon-primary/20 transition-all duration-300 backdrop-blur-sm"
                          value={formData.bairro || ""}
                          onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Campo Cidade */}
                    <div>
                      <Label htmlFor="cidade">Cidade</Label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          id="cidade"
                          className="pl-10 bg-white/50 border border-white/20 focus:border-primary/20 focus:shadow-neon-primary/20 transition-all duration-300 backdrop-blur-sm"
                          value={formData.cidade || ""}
                          onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Campo Estado */}
                    <div>
                      <Label htmlFor="estado">Estado</Label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          id="estado"
                          className="pl-10 bg-white/50 border border-white/20 focus:border-primary/20 focus:shadow-neon-primary/20 transition-all duration-300 backdrop-blur-sm"
                          value={formData.estado || ""}
                          onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                          maxLength={2}
                          placeholder="UF"
                        />
                      </div>
                    </div>

                    {/* Checkbox Ativo */}
                    <div className="flex items-center space-x-3 col-span-1 sm:col-span-2 pt-2">
                      <Switch
                        id="ativo"
                        checked={!!formData.ativo}
                        onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                        aria-label="Status do cliente"
                      />
                      <Label htmlFor="ativo" className="mb-0">
                        Cliente Ativo
                      </Label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowForm(false)
                        resetForm()
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className={`w-full ${isSubmitting ? "bg-primary/70" : "bg-primary hover:bg-primary/90"} text-white`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processando...
                        </>
                      ) : (
                        <>{editingId ? "Atualizar" : "Adicionar"}</>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Lista de clientes */}
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-neon-primary/10">
            <CardContent className="p-0">
              <div className="w-full overflow-x-auto">
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">{error}</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Nome/Razão Social</TableHead>
                        <TableHead>CPF/CNPJ</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>E-mail</TableHead>
                        <TableHead>Bairro</TableHead>
                        <TableHead>Cidade/UF</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClientes.length > 0 ? (
                        filteredClientes.map((cliente) => (
                          <TableRow key={cliente.id}>
                            <TableCell>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  cliente.tipo === "fisica"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-purple-100 text-purple-800"
                                }`}
                              >
                                {cliente.tipo === "fisica" ? "PF" : "PJ"}
                              </span>
                            </TableCell>
                            <TableCell className="font-medium">
                              {cliente.tipo === "fisica" ? cliente.nome : cliente.razao_social || cliente.nome}
                              {cliente.tipo === "juridica" && cliente.nome_fantasia && (
                                <div className="text-xs text-gray-500">{cliente.nome_fantasia}</div>
                              )}
                            </TableCell>
                            <TableCell>
                              {cliente.tipo === "fisica" ? cliente.cpf || "-" : cliente.cnpj || "-"}
                            </TableCell>
                            <TableCell>{cliente.telefone ? formatarTelefone(cliente.telefone) : "-"}</TableCell>
                            <TableCell className="truncate max-w-[150px]" title={cliente.email}>
                              {cliente.email || "-"}
                            </TableCell>
                            <TableCell className="truncate max-w-[100px]" title={cliente.bairro}>
                              {cliente.bairro || "-"}
                            </TableCell>
                            <TableCell
                              className="truncate max-w-[100px]"
                              title={cliente.cidade ? `${cliente.cidade}/${cliente.estado}` : "-"}
                            >
                              {cliente.cidade ? `${cliente.cidade}/${cliente.estado}` : "-"}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`px-2.5 py-1 text-xs font-semibold rounded-full text-white shadow-md ${
                                  cliente.ativo
                                    ? "bg-gradient-success shadow-neon-success/40"
                                    : "bg-gradient-danger shadow-neon-danger/40"
                                }`}
                              >
                                {cliente.ativo ? "Ativo" : "Inativo"}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={() => handleViewDetails(cliente)}
                                  >
                                    <Eye className="h-4 w-4 text-blue-500" />
                                    <span>Ver Detalhes</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={() => handleEdit(cliente)}
                                  >
                                    <Edit className="h-4 w-4 text-blue-600" />
                                    <span>Editar</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={() => toggleStatus(cliente)}
                                  >
                                    {cliente.ativo ? (
                                      <>
                                        <EyeOff className="h-4 w-4 text-yellow-600" />
                                        <span>Desativar</span>
                                      </>
                                    ) : (
                                      <>
                                        <Eye className="h-4 w-4 text-green-600" />
                                        <span>Ativar</span>
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-700"
                                    onClick={() => handleDelete(cliente.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span>Excluir</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={9} className="h-24 text-center">
                            Nenhum cliente encontrado
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

export default Clientes
