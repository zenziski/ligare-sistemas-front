import moment from "moment";
import { TOKEN_KEY, USER_KEY } from "./constants";
import { utils, writeFile } from "xlsx";

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
          Data: new Date(ponto.registration).toLocaleDateString(),
          Registro: new Date(ponto.registration).toLocaleTimeString(),
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
        Data: new Date(ponto.registration).toLocaleDateString(),
        Registro: new Date(ponto.registration).toLocaleTimeString(),
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
}
