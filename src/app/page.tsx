import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <>
            <section className="w-full min-h-[150vh] flex flex-col items-center justify-center p-6 space-y-12 mt-24">
                <div className="w-full flex flex-col justify-center items-center text-center space-y-6">
                    <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                        Bienvenue sur NutriFit
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Votre compagnon intelligent pour atteindre vos objectifs de santé, avec des plans personnalisés,
                        des recettes sur-mesure et des programmes de fitness adaptés à vos besoins.
                    </p>
                    <div className="space-x-4">
                        <Link href="/auth/sign-in">
                            <Button>Connexion</Button>
                        </Link>

                        <Link href="/auth/sign-up">
                            <Button variant="outline">Inscription</Button>
                        </Link>
                    </div>
                </div>

                <div className="w-full h-[90vh] flex justify-center">
                    <Image
                        src="/laptop_mockup_dashboard.png"
                        alt="Hero Image"
                        width={1600}
                        height={1600}
                        className="object-contain w-full h-auto"
                    />
                </div>
            </section>

            <section className="w-full h-[100vh]  flex flex-col-reverse lg:flex-row items-center justify-between p-6 lg:p-12">
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-start text-left space-y-6">
                    <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                        Rejoignez NutriFit
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Une solution innovante pour améliorer votre bien-être, accessible sur iOS et via le web.
                        Transformez votre santé dès aujourd'hui.
                    </p>
                    <div className="space-x-4 flex items-center ">
                        <Link href="/auth/sign-up">
                            <Button variant="outline">Essayez Nutrifit</Button>
                        </Link>
                        <Link href="https://www.apple.com/fr/app-store/" passHref={true}>
                            <Image
                                src="/Download_on_the_App_Store_Badge.png"
                                alt="Hero Image"
                                width={100}
                                height={40}
                                className="object-contain w-full h-auto"
                            />
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
        </>
    );
}
