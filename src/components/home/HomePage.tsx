import { Button } from "@mui/material";
import { useRouter } from "next/router";

import { RouteConfig } from "@/config/route.config";

const HomePage = () => {
    const router = useRouter();

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