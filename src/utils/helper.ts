import moment from "moment";
import { TOKEN_KEY, USER_KEY } from "./constants";
import { utils, writeFile } from "xlsx";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default class Helpers {
  static setTokenLocalStorage(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  static setUserLocalStorage(user: IApiUser): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  static getToken(): string {
    const token = localStorage.getItem(TOKEN_KEY);
    return token || "";
  }

  static isAuth(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  static getUserLocalstorage(): IApiUser | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  static toViewDate(date: string): string {
    if (!date) return "-";
    const d = new Date(date);
    console.log(d);
    const viewDate = moment(date).format("DD/MM/YYYY");
    return viewDate;
  }

  static toViewDate2(date: string): string {
    if (!date) return "-";
    const d = date.split("T")[0];
    console.log(d);

    return d;
  }

  static toViewDateAndTime(date: string): string {
    if (date == null) return "";
    const viewDate = moment(date).format("DD/MM/YYYY HH:mm");
    return viewDate;
  }

  static toBrazilianCurrency(value: string | number | undefined): string {
    return (
      value?.toLocaleString("pt-br", { style: "currency", currency: "BRL" }) ||
      ""
    );
  }

  static isCpf(cpf: string): boolean {
    if (cpf === undefined) return false;

    if (cpf.length <= 14) return true;
    else return false;
  }

  static removeBeginningZeros(value: string | undefined): string {
    return value !== undefined ? value.replace(/^0+/, "") : "";
  }

  static isDateValid = (dateStr: string): boolean =>
    new Date(dateStr).toString() !== "Invalid Date";

  static translateDayOfWeek = (day: string): string => {
    const daysOfWeek: { [key: string]: string } = {
      Sunday: "Domingo",
      Monday: "Segunda-feira",
      Tuesday: "Terça-feira",
      Wednesday: "Quarta-feira",
      Thursday: "Quinta-feira",
      Friday: "Sexta-feira",
      Saturday: "Sábado",
    };
    return daysOfWeek[day] || day;
  };

  static convertData = (data: any) => {
    const horas = Math.floor(Math.abs(data));
    const minutos = Math.floor((Math.abs(data) % 1) * 60);
    const formattedTime = `${String(horas).padStart(2, "0")}:${String(
      minutos
    ).padStart(2, "0")}`;

    return data < 0 ? `-${formattedTime}` : `+${formattedTime}`;
  };

  static generateXlsxFile = (data: any, type: string, filename: string) => {
    if (type === "mensal") {
      data.forEach((userData: any) => {
        const { user, pontos } = userData;
        const { pontos: registros, horasTrabalhadas, saldoHoras } = pontos;

        const formattedData = registros.map((ponto: any) => ({
          Data: new Date(['falta', 'abono'].includes(ponto.type) ? `${ponto.year}-${ponto.month}-${ponto.day}` : ponto.registration).toLocaleDateString(),
          Registro: ['falta', 'abono'].includes(ponto.type) ? 'N/A' : new Date(ponto.registration).toLocaleTimeString(),
          Tipo: ponto.type,
          Corrigido: ponto.isCorrected,
          Pendente: ponto.isPending ? "Sim" : "Não",
        }));

        formattedData.push({
          Data: "Total trabalhado:",
          Registro: this.convertData(horasTrabalhadas),
          Tipo: "",
          Corrigido: "Saldo de horas:",
          Pendente: this.convertData(saldoHoras),
        });

        const worksheet = utils.json_to_sheet(formattedData);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, user);
        writeFile(workbook, `ponto_${user}.xlsx`);
      });
    }
    if (type === "porUsuario") {
      const { pontos, horasTrabalhadas, saldoHoras } = data;

      const formattedData = pontos.map((ponto: any) => ({
        Data: new Date(['falta', 'abono'].includes(ponto.type) ? `${ponto.year}-${ponto.month}-${ponto.day}` : ponto.registration).toLocaleDateString(),
        Registro: ['falta', 'abono'].includes(ponto.type) ? 'N/A' : new Date(ponto.registration).toLocaleTimeString(),
        Tipo: ponto.type,
        Corrigido: ponto.isCorrected || "N/A",
        Pendente: ponto.isPending ? "Sim" : "Não",
      }));

      formattedData.push({
        Data: "Total trabalhado:",
        Registro: this.convertData(horasTrabalhadas),
        Tipo: "",
        Corrigido: "Saldo de horas:",
        Pendente: this.convertData(saldoHoras),
      });

      const worksheet = utils.json_to_sheet(formattedData);
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, "Usuario");
      writeFile(workbook, `${filename}.xlsx`);
    }
  };

  static capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  static generateObraDiaryXlsxFile = (diaryItems: any[], obraName: string) => {
    const formattedData = diaryItems.map((item) => ({
      "Data": new Date(item.createdAt || '').toLocaleDateString('pt-BR'),
      "Descrição": item.description || '',
      "Fornecedor": item.supplier?.name || 'N/A',
      "Valor": this.toBrazilianCurrency(item.value || 0),
      "NF": item.nfNumber || 'N/A',
      "Status": this.getStatusLabel(item.status || ''),
      "Forma de Pagamento": this.getPaymentMethodLabel(item.paymentMethod || ''),
      "Item": item.item || 'N/A',
      "Tipo": item.type || 'N/A',
      "Data de Envio": item.sendDate ? new Date(item.sendDate).toLocaleDateString('pt-BR') : 'N/A',
      "Data de Pagamento": item.paymentDate ? new Date(item.paymentDate).toLocaleDateString('pt-BR') : 'N/A',
      "Observação": item.observation || 'N/A'
    }));

    // Add summary row
    const totalValue = diaryItems.reduce((acc, item) => acc + (item.value || 0), 0);
    formattedData.push({
      "Data": "",
      "Descrição": "TOTAL GERAL",
      "Fornecedor": "",
      "Valor": this.toBrazilianCurrency(totalValue),
      "NF": "",
      "Status": "",
      "Forma de Pagamento": "",
      "Item": "",
      "Tipo": "",
      "Data de Envio": "",
      "Data de Pagamento": "",
      "Observação": `${diaryItems.length} itens`
    });

    const worksheet = utils.json_to_sheet(formattedData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Diário da Obra");
    
    // Generate filename with current date
    const currentDate = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    const sanitizedObraName = obraName.replace(/[^a-zA-Z0-9]/g, '_');
    writeFile(workbook, `diario_obra_${sanitizedObraName}_${currentDate}.xlsx`);
  };

  static getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago'
      case 'toPay': return 'À Pagar'
      case 'sended': return 'Enviado'
      default: return status
    }
  };

  static getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'pix': return 'PIX'
      case 'boleto': return 'Boleto'
      case 'cartao': return 'Cartão'
      case 'transferencia': return 'Transferência'
      default: return method
    }
  };

  static generateMedicaoXlsxFile = (medicoes: any[], tiposMedicao: any[], obraName: string) => {
    if (medicoes.length === 0) {
      throw new Error('Nenhuma medição disponível para exportar');
    }

    // Create formatted data for each medicao
    const formattedData = medicoes.map((medicao, index) => {
      const rowData: any = {
        "Medição": `Medição ${index + 1}`,
        "Data Inicial": this.toViewDate(medicao.initialDate),
        "Data Final": this.toViewDate(medicao.finalDate),
        "Período": `${this.toViewDate(medicao.initialDate)} - ${this.toViewDate(medicao.finalDate)}`
      };

      // Add each tipo de medição as a column
      tiposMedicao.forEach((tipo) => {
        rowData[tipo.name] = this.toBrazilianCurrency(medicao[tipo.name] || 0);
      });

      return rowData;
    });

    // Calculate totals for each tipo
    const totals: any = {
      "Medição": "TOTAL GERAL",
      "Data Inicial": "",
      "Data Final": "",
      "Período": `${medicoes.length} medições`
    };

    tiposMedicao.forEach((tipo) => {
      const total = medicoes.reduce((acc, medicao) => acc + (medicao[tipo.name] || 0), 0);
      totals[tipo.name] = this.toBrazilianCurrency(total);
    });

    formattedData.push(totals);

    const worksheet = utils.json_to_sheet(formattedData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Medições");
    
    // Generate filename with current date
    const currentDate = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    const sanitizedObraName = obraName.replace(/[^a-zA-Z0-9]/g, '_');
    writeFile(workbook, `medicoes_obra_${sanitizedObraName}_${currentDate}.xlsx`);
  };

  static generateObraReportPDF = async (obraData: any, diaryItems: any[], medicoes: any[], tiposMedicao: any[]) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Helper function to convert image to base64 and get dimensions
    const getImageAsBase64 = (url: string): Promise<{base64: string, width: number, height: number}> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function(event) {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const target = event.target as HTMLImageElement;
          canvas.height = target.naturalHeight;
          canvas.width = target.naturalWidth;
          ctx!.drawImage(target, 0, 0);
          const dataURL = canvas.toDataURL('image/png');
          resolve({
            base64: dataURL,
            width: target.naturalWidth,
            height: target.naturalHeight
          });
        };
        img.onerror = reject;
        img.src = url;
      });
    };

    // Get logo as base64 with dimensions
    let logoData: {base64: string, width: number, height: number} | null = null;
    try {
      logoData = await getImageAsBase64('/logo_text.png');
    } catch (error) {
      console.warn('Could not load logo:', error);
    }
    
    // Helper function to add header
    const addHeader = () => {
      // Company header
      doc.setFillColor(255, 202, 26); // Primary yellow
      doc.rect(0, 0, pageWidth, 25, 'F');
      
      // Add logo if available
      if (logoData) {
        try {
          // Calculate proper dimensions maintaining aspect ratio
          const maxWidth = 60; // Maximum width for logo
          const maxHeight = 15; // Maximum height for logo
          const aspectRatio = logoData.width / logoData.height;
          
          let logoWidth = maxWidth;
          let logoHeight = maxWidth / aspectRatio;
          
          // If height exceeds max, scale down based on height
          if (logoHeight > maxHeight) {
            logoHeight = maxHeight;
            logoWidth = maxHeight * aspectRatio;
          }
          
          // Center vertically in header
          const yPos = ( 100 - logoHeight) / 2;
          
          // Add logo on the left side of the header
          doc.addImage(logoData.base64, 'PNG', 10, -1, 30, 30);
        } catch (error) {
          console.warn('Could not add logo to PDF:', error);
          // Fallback to text if logo fails
          doc.setTextColor(85,85,85);
          doc.setFontSize(20);
          doc.setFont('helvetica', 'bold');
          doc.text('LIGARE CONSTRUTORA', 15, 16);
        }
      } else {
        // Fallback to text if no logo
        doc.setTextColor(85,85,85);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('LIGARE CONSTRUTORA', 15, 16);
      }
      
      doc.setTextColor(85,85,85);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Relatório de Obra', pageWidth - 15, 16, { align: 'right' });
      doc.text(new Date().toLocaleDateString('pt-BR'), pageWidth - 15, 21, { align: 'right' });
    };

    // Page 1 - Overview
    addHeader();
    
    let yPos = 35;
    
    // Obra Title
    doc.setTextColor(85, 85, 85);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(obraData.name || 'Nome da Obra', 15, yPos);
    yPos += 10;
    
    // Obra details box
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(248, 250, 252);
    doc.rect(15, yPos, pageWidth - 30, 35, 'FD');
    
    doc.setTextColor(74, 85, 104);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    yPos += 8;
    
    doc.text('Endereço:', 20, yPos);
    doc.text(obraData.constructionAddress || 'Nao informado', 50, yPos);
    yPos += 6;
    
    doc.text('Cliente:', 20, yPos);
    doc.text(obraData.customerId?.name || 'Nao informado', 50, yPos);
    yPos += 6;
    
    doc.text('Data do Relatorio:', 20, yPos);
    doc.text(new Date().toLocaleDateString('pt-BR'), 50, yPos);
    yPos += 6;
    
    doc.text('Status:', 20, yPos);
    const contractType = this.getContractTypeLabel(obraData);
    doc.text(contractType, 50, yPos);
    yPos += 15;
    
    // Financial Summary Section
    doc.setTextColor(85, 85, 85);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('RESUMO FINANCEIRO', 15, yPos);
    yPos += 10;
    
    // Contract values
    if (obraData.contract?.value || obraData.administration?.value) {
      const contractData = [];
      
      if (obraData.contract?.value) {
        contractData.push([
          'Empreitada',
          this.toBrazilianCurrency(obraData.contract.value),
          `${obraData.contract.installments || 0} parcelas`,
          this.toBrazilianCurrency(obraData.contract.monthlyValue || 0)
        ]);
      }
      
      if (obraData.administration?.value) {
        contractData.push([
          'Administração',
          this.toBrazilianCurrency(obraData.administration.value),
          `${obraData.administration.installments || 0} parcelas`,
          this.toBrazilianCurrency(obraData.administration.monthlyValue || 0)
        ]);
      }
      
      // Total contract value
      const totalContract = (obraData.contract?.value || 0) + (obraData.administration?.value || 0);
      contractData.push([
        'TOTAL CONTRATO',
        this.toBrazilianCurrency(totalContract),
        '-',
        '-'
      ]);
      
      autoTable(doc, {
        startY: yPos,
        head: [['Tipo', 'Valor Total', 'Parcelas', 'Valor Mensal']],
        body: contractData,
        theme: 'grid',
        headStyles: {
          fillColor: [43, 108, 176],
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 9,
          textColor: [74, 85, 104]
        },
        columnStyles: {
          1: { halign: 'right' },
          3: { halign: 'right' }
        },
        margin: { left: 15, right: 15 }
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 15;
    }
    
    // Expenses Summary
    if (diaryItems && diaryItems.length > 0) {
      doc.setTextColor(85, 85, 85);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('RESUMO DE GASTOS', 15, yPos);
      yPos += 10;
      
      // Calculate expenses by type
      const expensesByType = diaryItems.reduce((acc, item) => {
        const type = item.type || 'Outros';
        acc[type] = (acc[type] || 0) + (item.value || 0);
        return acc;
      }, {} as any);
      
      const expensesData = Object.entries(expensesByType).map(([type, value]) => [
        type,
        this.toBrazilianCurrency(value as number),
        `${diaryItems.filter(item => (item.type || 'Outros') === type).length} itens`
      ]);
      
      const totalExpenses = diaryItems.reduce((acc, item) => acc + (item.value || 0), 0);
      expensesData.push([
        'TOTAL GASTOS',
        this.toBrazilianCurrency(totalExpenses),
        `${diaryItems.length} itens`
      ]);
      
      autoTable(doc, {
        startY: yPos,
        head: [['Tipo de Gasto', 'Valor', 'Quantidade']],
        body: expensesData,
        theme: 'grid',
        headStyles: {
          fillColor: [56, 161, 105],
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 9,
          textColor: [74, 85, 104]
        },
        columnStyles: {
          1: { halign: 'right' },
          2: { halign: 'center' }
        },
        margin: { left: 15, right: 15 }
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 15;
    }
    
    // Page 2 - Detailed Expenses (if there are diary items)
    if (diaryItems && diaryItems.length > 0) {
      doc.addPage();
      addHeader();
      
      yPos = 35;
      doc.setTextColor(85, 85, 85);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('DETALHAMENTO DE GASTOS', 15, yPos);
      yPos += 10;
      
      // Recent expenses (last 20 items)
      const recentExpenses = diaryItems
        .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());

      const expensesTableData = recentExpenses.map(item => [
        this.toViewDate(item.createdAt || ''),
        item.description || '',
        item.supplier?.name || 'N/A',
        this.toBrazilianCurrency(item.value || 0),
        this.getStatusLabel(item.status || ''),
        item.type || 'N/A'
      ]);
      
      autoTable(doc, {
        startY: yPos,
        head: [['Data', 'Descrição', 'Fornecedor', 'Valor', 'Status', 'Tipo']],
        body: expensesTableData,
        theme: 'striped',
        headStyles: {
          fillColor: [43, 108, 176],
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [74, 85, 104]
        },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 45 },
          2: { cellWidth: 35 },
          3: { cellWidth: 25, halign: 'right' },
          4: { cellWidth: 20, halign: 'center' },
          5: { cellWidth: 25 }
        },
        margin: { left: 15, right: 15 }
      });
      
    }
    
    // Page 3 - Measurements (if there are medicoes)
    if (medicoes && medicoes.length > 0) {
      doc.addPage();
      addHeader();
      
      yPos = 35;
      doc.setTextColor(43, 108, 176);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('MEDIÇÕES REALIZADAS', 15, yPos);
      yPos += 10;
      
      // Create measurements table
      const measurementData = medicoes.map((medicao, index) => {
        const row = [
          `Medição ${index + 1}`,
          this.toViewDate(medicao.initialDate),
          this.toViewDate(medicao.finalDate)
        ];
        
        // Add each measurement type value
        tiposMedicao.forEach(tipo => {
          row.push(this.toBrazilianCurrency(medicao[tipo.name] || 0));
        });
        
        return row;
      });
      
      // Add totals row
      const totalsRow = ['TOTAL', '-', '-'];
      tiposMedicao.forEach(tipo => {
        const total = medicoes.reduce((acc, medicao) => acc + (medicao[tipo.name] || 0), 0);
        totalsRow.push(this.toBrazilianCurrency(total));
      });
      measurementData.push(totalsRow);
      
      const headers = ['Medição', 'Data Inicial', 'Data Final', ...tiposMedicao.map(tipo => tipo.name)];
      
      autoTable(doc, {
        startY: yPos,
        head: [headers],
        body: measurementData,
        theme: 'grid',
        headStyles: {
          fillColor: [128, 90, 213],
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [74, 85, 104]
        },
        margin: { left: 15, right: 15 }
      });
      
    }
    
    // Generate filename and save
    const currentDate = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    const sanitizedObraName = (obraData.name || 'obra').replace(/[^a-zA-Z0-9]/g, '_');
    doc.save(`relatorio_obra_${sanitizedObraName}_${currentDate}.pdf`);
  };

  static getContractTypeLabel = (obra: any) => {
    if (obra?.contract?.value && obra?.administration?.value) {
      return 'Administração + Empreitada'
    } else if (obra?.contract?.value) {
      return 'Empreitada'
    } else if (obra?.administration?.value) {
      return 'Administração'
    }
    return 'Não definido'
  };
}
