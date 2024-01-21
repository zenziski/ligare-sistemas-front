export interface DashboardState {
    totalConstructions: number;
    totalAdministrationCost: number;
    totalAlreadyPaid: number;
    totalFutureValuePerMonth: number;
    maxMonths: number;
    administrationPaymentPerConstruction: AdministrationPaymentPerConstruction[];
}

export interface AdministrationPaymentPerConstruction {
    name: string;
    totalValue: number;
    paid: number;
    installments: number;
    futureValue: number;
    futureValuePerMonth: number;
    installmentsToPay: number;
    futurePayments: { [key: string]: number };
}