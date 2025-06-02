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
      orcamentos: {
        Row: {
          id: string;
          cliente: string;
          servico: string;
          valor: number;
          status: string;
          validade: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          cliente: string;
          servico: string;
          valor: number;
          status?: string;
          validade?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          cliente?: string;
          servico?: string;
          valor?: number;
          status?: string;
          validade?: string;
          created_at?: string;
        };
      };
      ordens_servico: {
        Row: {
          id: string;
          cliente: string;
          servico: string;
          valor: number;
          status: string;
          prazo_entrega: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          cliente: string;
          servico: string;
          valor: number;
          status?: string;
          prazo_entrega?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          cliente?: string;
          servico?: string;
          valor?: number;
          status?: string;
          prazo_entrega?: string;
          created_at?: string;
        };
      };
      clientes: {
        Row: {
          id: string;
          nome: string;
          email: string;
          telefone: string;
          cep: string;
          bairro: string;
          ativo: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          email: string;
          telefone: string;
          cep: string;
          bairro: string;
          ativo?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          email?: string;
          telefone?: string;
          cep?: string;
          bairro?: string;
          ativo?: boolean;
          created_at?: string;
        };
      };
      configuracoes: {
        Row: {
          id: string;
          tipo: string;
          valor: string;
          ativo: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          tipo: string;
          valor: string;
          ativo?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          tipo?: string;
          valor?: string;
          ativo?: boolean;
          created_at?: string;
        };
      };
      cores: {
        Row: {
          id: string;
          nome: string;
          codigo_hex: string;
          ativo: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          codigo_hex: string;
          ativo?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          codigo_hex?: string;
          ativo?: boolean;
          created_at?: string;
        };
      };
      item_cores: {
        Row: {
          id: string;
          ordem_id?: string;
          orcamento_id?: string;
          cor_id: string;
          quantidade: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          ordem_id?: string;
          orcamento_id?: string;
          cor_id: string;
          quantidade: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          ordem_id?: string;
          orcamento_id?: string;
          cor_id?: string;
          quantidade?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "item_cores_cor_id_fkey";
            columns: ["cor_id"];
            referencedRelation: "cores";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "item_cores_ordem_id_fkey";
            columns: ["ordem_id"];
            referencedRelation: "ordens_servico";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "item_cores_orcamento_id_fkey";
            columns: ["orcamento_id"];
            referencedRelation: "orcamentos";
            referencedColumns: ["id"];
          }
        ]
      }
      // ... outras tabelas existentes
    }
  }
}
