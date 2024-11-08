"use client";

import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode"; // Assurez-vous d'avoir installé html5-qrcode
import { Button } from "@/components/ui/button"; // Bouton de shadcn UI ou Tailwind
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Utilisation du composant Dialog pour la pop-up

// Composant de scanner
const BarcodeScanner = ({
    onScanSuccess,
    onScanFailure,
}: {
    onScanSuccess: (decodedText: string) => void;
    onScanFailure?: (error: any) => void;
}) => {
    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
            },
            false
        );

        scanner.render(onScanSuccess, onScanFailure);

        // Cleanup du scanner lors du démontage du composant
        return () => {
            scanner.clear();
        };
    }, [onScanSuccess, onScanFailure]);

    return <div id="reader" style={{ width: "100%", height: "100%" }} />;
};

// Composant principal avec bouton et pop-up
const BarcodeScannerWithPopup = ({ onScanSuccess }: { onScanSuccess: (decodedText: string) => void }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Gestion du succès de scan
    const handleScanSuccess = (decodedText: string) => {
        console.log("Scanned text: ", decodedText);
        onScanSuccess(decodedText); // Transmettre le code scanné au parent
        setIsModalOpen(false); // Ferme la modale après un scan réussi
    };

    // Ouvrir la modale et mettre à jour l'état de chargement
    const openModal = () => {
        setIsModalOpen(true);
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Bouton pour ouvrir la modale */}
            <Button onClick={openModal}>Scanner le code barre d'une article</Button>

            {/* Modale avec le scanner */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Scanner le Code-Barres</DialogTitle>
                    </DialogHeader>

                    {/* Scanner de code-barres */}
                    <div className="w-full h-[300px] mt-4">
                        <BarcodeScanner onScanSuccess={handleScanSuccess} />
                    </div>

                    <Button onClick={() => setIsModalOpen(false)} className="mt-4">
                        Annuler
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BarcodeScannerWithPopup;
