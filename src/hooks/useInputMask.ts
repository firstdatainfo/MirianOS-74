import { useState } from 'react';

export const useInputMask = () => {
  // Máscara para CEP (00000-000)
  const maskCEP = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substr(0, 9);
  };

  // Máscara para telefone ((00) 00000-0000)
  const maskTelefone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  // Máscara para RG (00.000.000-0)
  const maskRG = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .substr(0, 12);
  };

  // Máscara para CPF (000.000.000-00)
  const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .substr(0, 14);
  };

  // Máscara para CNPJ (00.000.000/0000-00)
  const maskCNPJ = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .substr(0, 18);
  };

  // Máscara dinâmica para CPF/CNPJ
  const maskCPFCNPJ = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue.length <= 11 ? maskCPF(cleanValue) : maskCNPJ(cleanValue);
  };

  return {
    maskCEP,
    maskTelefone,
    maskRG,
    maskCPF,
    maskCNPJ,
    maskCPFCNPJ
  };
};
