import * as XLSX from 'xlsx';

export interface ExcelRow {
  nome: string;
  email: string;
  empresa?: string;
  telefone?: string;
}

export interface ImportResult {
  success: boolean;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  errors: string[];
  data?: ExcelRow[];
}

/**
 * Processa um arquivo Excel e retorna os dados validados
 */
export async function processExcelFile(file: File): Promise<ImportResult> {
  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);
    
    const validRows: ExcelRow[] = [];
    const errors: string[] = [];
    
    jsonData.forEach((row, index) => {
      const rowNumber = index + 2;
      
      const nome = 
        row.nome || 
        row.Nome || 
        row.NOME || 
        row.name || 
        row.Name;
        
      const email = 
        row.email || 
        row.Email || 
        row.EMAIL || 
        row['e-mail'];
      
      if (!nome || nome.trim() === '') {
        errors.push(`Linha ${rowNumber}: Nome não encontrado`);
        return;
      }
      
      if (!email || email.trim() === '') {
        errors.push(`Linha ${rowNumber}: Email não encontrado`);
        return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errors.push(`Linha ${rowNumber}: Email inválido (${email})`);
        return;
      }
      
      validRows.push({
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        empresa: row.empresa || row.Empresa || row.company || '',
        telefone: row.telefone || row.Telefone || row.phone || '',
      });
    });
    
    return {
      success: errors.length === 0,
      totalRows: jsonData.length,
      validRows: validRows.length,
      invalidRows: errors.length,
      errors,
      data: validRows.length > 0 ? validRows : undefined,
    };
    
  } catch (error) {
    console.error('Erro ao processar Excel:', error);
    return {
      success: false,
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      errors: ['Erro ao ler arquivo Excel. Verifique o formato.'],
    };
  }
}

/**
 * Valida se o arquivo é um Excel válido
 */
export function isValidExcelFile(file: File): boolean {
  const validTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
  ];
  
  const validExtensions = ['.xlsx', '.xls', '.csv'];
  const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
  
  return validTypes.includes(file.type) || validExtensions.includes(fileExtension);
}

/**
 * Cria um template Excel de exemplo
 */
export function createExcelTemplate(): Blob {
  const data = [
    { nome: 'João Silva', email: 'joao@example.com', empresa: 'Empresa X', telefone: '(11) 98765-4321' },
    { nome: 'Maria Santos', email: 'maria@example.com', empresa: 'Empresa Y', telefone: '(11) 91234-5678' },
  ];
  
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Convidados');
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
}
