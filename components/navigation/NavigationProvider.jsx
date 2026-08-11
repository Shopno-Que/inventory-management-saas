"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import {
    usePathname,
    useRouter,
} from "next/navigation";
import FullPageSpinner from "@/components/skeleton/FullPageSpinner";

const NavigationContext = createContext(null);

export function NavigationProvider({ children }) {
    const router = useRouter();
    const pathname = usePathname();

    const [navigating, setNavigating] = useState(false);

    useEffect(() => {
        setNavigating(false);
    }, [pathname]);

    const push = (url) => {
        setNavigating(true);
        router.push(url);
    };

    const replace = (url) => {
        setNavigating(true);
        router.replace(url);
    };

    const back = () => {
        setNavigating(true);
        router.back();
    };

    return (
        <NavigationContext.Provider
            value={{
                push,
                replace,
                back,
                navigating,
            }}
        >
            {children}

            {navigating && (
                <div className="fixed inset-0 z-[9999] bg-base-100">
                    <FullPageSpinner />
                </div>
            )}
        </NavigationContext.Provider>
    );
}

export function useNavigation() {
    const context = useContext(NavigationContext);

    if (!context) {
        throw new Error(
            "useNavigation must be used inside NavigationProvider",
        );
    }

    return context;
}