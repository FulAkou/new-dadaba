"use client";

import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import toast from "react-hot-toast";

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const confirmed = searchParams.get("confirmed");
  const error = searchParams.get("error");

  useEffect(() => {
    if (confirmed === "1") {
      toast.success(
        "Votre email a été confirmé avec succès ! Vous pouvez maintenant vous connecter."
      );
      router.push("/login");
    } else if (confirmed === "0" || error) {
      toast.error(error || "Le lien de confirmation est invalide ou a expiré.");
      router.push("/login"); // Even if error, go to login so they can request a new one
    } else {
      // Default fallback if someone hits /auth directly
      router.push("/login");
    }
  }, [confirmed, error, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
      <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
      <p className="text-secondary-500 font-bold font-outfit uppercase tracking-widest text-xs">
        Vérification en cours...
      </p>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
        </div>
      }
    >
      <AuthPageContent />
    </Suspense>
  );
}
