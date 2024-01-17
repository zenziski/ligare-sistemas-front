import moment from 'moment'
import { TOKEN_KEY, USER_KEY } from './constants'

export default class Helpers {
    static get user(): IAuth | null {
        return toAppUser(this.getUserLocalstorage())
    }

    static setTokenLocalStorage(token: string): void {
        localStorage.setItem(TOKEN_KEY, token)
    }

    static setUserLocalStorage(user: IApiUser): void {
        localStorage.setItem(USER_KEY, JSON.stringify(user))
    }

    static getToken(): string {
        const token = localStorage.getItem(TOKEN_KEY)
        return token || ''
    }

    static isAuth(): boolean {
        return !!localStorage.getItem(TOKEN_KEY)
    }

    static getUserLocalstorage(): IApiUser | null {
        const userStr = localStorage.getItem(USER_KEY)
        if (userStr) {
            return JSON.parse(userStr)
        }
        return null
    }

    static toViewDate(date: string): string {
        if (date == null) return ''

        const viewDate = moment(date).format('DD/MM/YYYY')
        return viewDate
    }

    static toViewDateAndTime(date: string): string {
        if (date == null) return ''

        const viewDate = moment(date).format('DD/MM/YYYY HH:mm')
        return viewDate
    }

    static toBrazilianCurrency(value: string | number | undefined): string {
        return value?.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) || ''
    }

    static isCpf(cpf: string): boolean {
        if (cpf === undefined) return false

        if (cpf.length <= 14) return true
        else return false
    }

    static removeBeginningZeros(value: string | undefined): string {
        return value !== undefined ? value.replace(/^0+/, '') : ''
    }

    static isDateValid = (dateStr: string): boolean => new Date(dateStr).toString() !== 'Invalid Date'
}