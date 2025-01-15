import { ModeToggle } from "@/components/ui/mode-toggle";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
    return (
        <section className="w-full min-h-screen flex flex-col-reverse lg:flex-row items-center justify-between p-6 lg:p-12">
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-start text-left space-y-6">
                <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                    Bienvenue sur NutriFit
                </h1>
                <p className="text-lg text-muted-foreground">
                    Votre compagnon intelligent pour atteindre vos objectifs de santé, avec des plans personnalisés, des
                    recettes sur-mesure et des programmes de fitness adaptés à vos besoins.{" "}
                </p>
                <div className="space-x-4">
                    <Link href="/auth/sign-in">
                        <Button>Sign In</Button>
                    </Link>

                    <Link href="/auth/sign-up">
                        <Button variant="outline">Sign Up</Button>
                    </Link>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                <Image
                    src="/phone_mockups.png"
                    alt="Hero Image"
                    width={600}
                    height={600}
                    className="object-contain w-full h-auto"
                />
            </div>
        </section>
    );
}
