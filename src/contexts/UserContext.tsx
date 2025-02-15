import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { IUser } from "../stores/usuarios/interface";
import { me } from "../stores/login/service";
import { useToast } from '@chakra-ui/react';

interface IUserContext {
    user: IUser;
    setUser: (user: IUser) => void;
}

const UserContext = createContext<IUserContext>({} as IUserContext);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
    const [user, setUser] = useState<IUser>({} as IUser);
    const toast = useToast();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (!localStorage.getItem("token")) {
                    toast({
                        title: "Usuário não autenticado",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                        position: "top-right"
                    })
                }
                const response = await me();
                setUser(response);
            } catch (error) {
                console.log(error);
                toast({
                    title: "Usuário não autenticado",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top-right"
                })
            }
        }
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("O useUser deve ser usado dentro de um UserProvider");
    return context;
}

export default UserContext;