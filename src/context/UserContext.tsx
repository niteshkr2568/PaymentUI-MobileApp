
import React, { createContext, useState, ReactNode } from 'react';

export interface User {
    name: string;
    email: string;
    avatar: any; // Changed to any to support require() and uri string
}

interface UserContextType {
    user: User;
    updateUser: (data: Partial<User>) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>({
        name: 'Nitesh Kumar',
        email: 'nitesh@example.com',
        avatar: require('../assets/avatar.jpg'),
    });

    const updateUser = (data: Partial<User>) => {
        setUser(prev => ({ ...prev, ...data }));
    };

    return (
        <UserContext.Provider value={{ user, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};
