export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      acompanhamento_os: {
        Row: {
          data_conclusao: string | null
          data_criacao: string | null
          data_inicio: string | null
          etapa_id: string | null
          id: string
          observacoes: string | null
          ordem_servico_id: string | null
          status: string | null
        }
        Insert: {
          data_conclusao?: string | null
          data_criacao?: string | null
          data_inicio?: string | null
          etapa_id?: string | null
          id?: string
          observacoes?: string | null
          ordem_servico_id?: string | null
          status?: string | null
        }
        Update: {
          data_conclusao?: string | null
          data_criacao?: string | null
          data_inicio?: string | null
          etapa_id?: string | null
          id?: string
          observacoes?: string | null
          ordem_servico_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "acompanhamento_os_etapa_id_fkey"
            columns: ["etapa_id"]
            isOneToOne: false
            referencedRelation: "etapas_producao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "acompanhamento_os_ordem_servico_id_fkey"
            columns: ["ordem_servico_id"]
            isOneToOne: false
            referencedRelation: "ordens_servico"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          ativo: boolean | null
          cep: string | null
          cidade: string | null
          data_cadastro: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          telefone: string | null
        }
        Insert: {
          ativo?: boolean | null
          cep?: string | null
          cidade?: string | null
          data_cadastro?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome: string
          telefone?: string | null
        }
        Update: {
          ativo?: boolean | null
          cep?: string | null
          cidade?: string | null
          data_cadastro?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          telefone?: string | null
        }
        Relationships: []
      }
      configuracoes: {
        Row: {
          categoria: string
          chave: string
          descricao: string | null
          id: string
          valor: string
        }
        Insert: {
          categoria: string
          chave: string
          descricao?: string | null
          id?: string
          valor: string
        }
        Update: {
          categoria?: string
          chave?: string
          descricao?: string | null
          id?: string
          valor?: string
        }
        Relationships: []
      }
      etapas_producao: {
        Row: {
          ativo: boolean | null
          data_criacao: string | null
          descricao: string | null
          id: string
          nome: string
          ordem: number
        }
        Insert: {
          ativo?: boolean | null
          data_criacao?: string | null
          descricao?: string | null
          id?: string
          nome: string
          ordem: number
        }
        Update: {
          ativo?: boolean | null
          data_criacao?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          ordem?: number
        }
        Relationships: []
      }
      itens_orcamento: {
        Row: {
          cor: string | null
          descricao_personalizada: string | null
          id: string
          observacoes: string | null
          orcamento_id: string | null
          preco_total: number
          preco_unitario: number
          produto_id: string | null
          quantidade: number
          tamanho: string | null
        }
        Insert: {
          cor?: string | null
          descricao_personalizada?: string | null
          id?: string
          observacoes?: string | null
          orcamento_id?: string | null
          preco_total: number
          preco_unitario: number
          produto_id?: string | null
          quantidade?: number
          tamanho?: string | null
        }
        Update: {
          cor?: string | null
          descricao_personalizada?: string | null
          id?: string
          observacoes?: string | null
          orcamento_id?: string | null
          preco_total?: number
          preco_unitario?: number
          produto_id?: string | null
          quantidade?: number
          tamanho?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "itens_orcamento_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "orcamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_orcamento_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_ordem_servico: {
        Row: {
          cor: string | null
          descricao_personalizada: string | null
          id: string
          observacoes: string | null
          ordem_servico_id: string | null
          preco_total: number
          preco_unitario: number
          produto_id: string | null
          quantidade: number
          status_item: string | null
          tamanho: string | null
        }
        Insert: {
          cor?: string | null
          descricao_personalizada?: string | null
          id?: string
          observacoes?: string | null
          ordem_servico_id?: string | null
          preco_total: number
          preco_unitario: number
          produto_id?: string | null
          quantidade?: number
          status_item?: string | null
          tamanho?: string | null
        }
        Update: {
          cor?: string | null
          descricao_personalizada?: string | null
          id?: string
          observacoes?: string | null
          ordem_servico_id?: string | null
          preco_total?: number
          preco_unitario?: number
          produto_id?: string | null
          quantidade?: number
          status_item?: string | null
          tamanho?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "itens_ordem_servico_ordem_servico_id_fkey"
            columns: ["ordem_servico_id"]
            isOneToOne: false
            referencedRelation: "ordens_servico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_ordem_servico_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      orcamentos: {
        Row: {
          cliente_id: string | null
          data_orcamento: string | null
          data_validade: string | null
          descricao: string | null
          id: string
          numero_orcamento: string
          observacoes: string | null
          status: string | null
          valor_total: number
        }
        Insert: {
          cliente_id?: string | null
          data_orcamento?: string | null
          data_validade?: string | null
          descricao?: string | null
          id?: string
          numero_orcamento: string
          observacoes?: string | null
          status?: string | null
          valor_total: number
        }
        Update: {
          cliente_id?: string | null
          data_orcamento?: string | null
          data_validade?: string | null
          descricao?: string | null
          id?: string
          numero_orcamento?: string
          observacoes?: string | null
          status?: string | null
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "orcamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      ordens_servico: {
        Row: {
          cliente_id: string | null
          data_criacao: string | null
          data_entrega: string | null
          data_prevista_entrega: string | null
          descricao: string | null
          id: string
          numero_os: string
          observacoes: string | null
          orcamento_id: string | null
          status: string | null
          valor_total: number
        }
        Insert: {
          cliente_id?: string | null
          data_criacao?: string | null
          data_entrega?: string | null
          data_prevista_entrega?: string | null
          descricao?: string | null
          id?: string
          numero_os: string
          observacoes?: string | null
          orcamento_id?: string | null
          status?: string | null
          valor_total: number
        }
        Update: {
          cliente_id?: string | null
          data_criacao?: string | null
          data_entrega?: string | null
          data_prevista_entrega?: string | null
          descricao?: string | null
          id?: string
          numero_os?: string
          observacoes?: string | null
          orcamento_id?: string | null
          status?: string | null
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "ordens_servico_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordens_servico_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "orcamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          ativo: boolean | null
          categoria: string | null
          data_criacao: string | null
          descricao: string | null
          id: string
          nome: string
          preco_base: number
          tempo_producao_dias: number | null
        }
        Insert: {
          ativo?: boolean | null
          categoria?: string | null
          data_criacao?: string | null
          descricao?: string | null
          id?: string
          nome: string
          preco_base: number
          tempo_producao_dias?: number | null
        }
        Update: {
          ativo?: boolean | null
          categoria?: string | null
          data_criacao?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          preco_base?: number
          tempo_producao_dias?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
