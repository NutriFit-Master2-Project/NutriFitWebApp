"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthContext";
import { CircleUser, CookingPot, Dumbbell, LineChart, LogOut, Refrigerator, ScanBarcode, Soup } from "lucide-react";
import Link from "next/link";

export function Navigation() {
    const { signOut, user, token } = useAuth();
    const isAuthenticated = user && token;

    return (
        <TooltipProvider delayDuration={0}>
            <aside className="fixed sm:inset-y-0 sm:left-0 bottom-0 left-0 right-0 sm:w-14 flex-col border-t sm:border-t-0 sm:border-r bg-background flex z-10">
                <nav className="flex sm:flex-col items-center justify-around sm:justify-start gap-4 px-2 py-2 sm:py-4">
                    <Link
                        href="/"
                        className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                    >
                        <img
                            src="/logo.png"
                            alt="NutriFit Logo"
                            className="h-5 w-5 transition-all group-hover:scale-110"
                        />
                        <span className="sr-only">NutriFit Home</span>
                    </Link>

                    {isAuthenticated && (
                        <>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href="/dashboard"
                                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                                    >
                                        <LineChart className="h-5 w-5" />
                                        <span className="sr-only">Tableau de bord</span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">Tableau de bord</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href="/nutrition/food-scanner"
                                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                                    >
                                        <ScanBarcode className="h-5 w-5" />
                                        <span className="sr-only">Scanner un aliment</span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">Scanner un aliment</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href="/nutrition/product-list"
                                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                                    >
                                        <Refrigerator className="h-5 w-5" />
                                        <span className="sr-only">Dans mon frigot</span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">Dans mon frigot</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href="/nutrition/daily-entries"
                                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                                    >
                                        <Soup className="h-5 w-5" />
                                        <span className="sr-only">Repas</span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">Repas</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href="/nutrition/recomended-dish"
                                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                                    >
                                        <CookingPot />
                                        <span className="sr-only">Generation de repas</span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">Generation de repas</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href="/training/list"
                                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                                    >
                                        <Dumbbell className="h-5 w-5" />
                                        <span className="sr-only">Entrainement</span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">Entrainement</TooltipContent>
                            </Tooltip>
                        </>
                    )}
                </nav>
                {isAuthenticated && (
                    <nav className="hidden sm:flex sm:mt-auto flex-col items-center gap-4 px-2 sm:py-4">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div onClick={signOut} className="cursor-pointer">
                                    <LogOut />
                                    <span className="sr-only">Déconnexion</span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="right">Déconnexion</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="/update-user-info"
                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                                >
                                    <CircleUser />
                                    <span className="sr-only">Mes informations</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">Mes informations</TooltipContent>
                        </Tooltip>
                    </nav>
                )}
            </aside>
        </TooltipProvider>
    );
}
