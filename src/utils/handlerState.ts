export const handlerState = (handler: React.Dispatch<React.SetStateAction<any>>, key: string, value: any) => {
    handler((state: any) => ({ ...state, [key]: value }));
}