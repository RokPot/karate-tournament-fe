import { Button } from "@mui/material";
import { useRouter } from "next/router";

import { RouteConfig } from "@/config/route.config";
import { useAuthRoles } from "@/hooks/useAuthRoles";
import { useEffect } from "react";

const HomePage = () => {
    const router = useRouter();
    const { isAdmin, isClubOwner } = useAuthRoles();
    console.log(isAdmin, isClubOwner);
    useEffect(() => {
        if (isClubOwner) {
            router.push(RouteConfig.myClub);
        }
    }, [isAdmin, isClubOwner])
    return (
        <div className="flex flex-col items-center justify-center gap-4 p-10">
            <h1 className="text-2xl font-bold">Welcome to Karate Tournament Manager</h1>
            <Button variant="contained" onClick={() => router.push(RouteConfig.tournaments)}>
                View Tournaments
            </Button>
        </div>
    );
};

export default HomePage;