"use client";

import {
  useContext,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { isAddress } from "ethers";

import { TransactionContext } from "@/context/TransactionContext";
import { Loader } from "@/components";
import { cn } from "@/utils/cn";
import useWalletInfo from "@/hooks/useWalletInfo";
import type { FormData } from "@/types";

interface InputProps {
  placeholder: string;
  name: keyof FormData;
  type: string;
  value?: string;
  error?: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>, name: keyof FormData) => void;
}

const Input = ({
  placeholder,
  name,
  type,
  value,
  error,
  handleChange,
}: InputProps) => (
  <div className="w-full">
    <input
      placeholder={placeholder}
      type={type}
      step={type === "number" ? "0.0001" : undefined}
      value={value}
      onChange={(e) => handleChange(e, name)}
      autoComplete="off"
      className={cn(
        "my-2 w-full rounded-lg p-3 outline-none bg-transparent text-white",
        "border text-sm white-glassmorphism transition-colors",
        error
          ? "border-red-500/50 focus:border-red-500"
          : "border-white/10 focus:border-white/30"
      )}
    />
    {error && (
      <p className="text-red-400 text-xs flex items-center gap-1 -mt-1 mb-2">
        <AlertCircle size={12} />
        {error}
      </p>
    )}
  </div>
);

const TransferForm = () => {
  const {
    currentAccount,
    connectWallet,
    handleChange,
    sendTransaction,
    formData,
    isLoading,
  } = useContext(TransactionContext)!;

  const { balance } = useWalletInfo(currentAccount ?? "");
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [success, setSuccess] = useState(false);

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormData, string>> = {};

    if (!formData.addressTo) {
      next.addressTo = "Adresse requise";
    } else if (!isAddress(formData.addressTo)) {
      next.addressTo = "Adresse Ethereum invalide";
    }

    if (!formData.amount) {
      next.amount = "Montant requis";
    } else {
      const amount = Number(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        next.amount = "Le montant doit être supérieur à 0";
      } else if (amount > Number(balance)) {
        next.amount = `Solde insuffisant (max ${Number(balance).toFixed(4)} ETH)`;
      }
    }

    if (!formData.keyword) next.keyword = "Mot-clé requis";
    if (!formData.message) next.message = "Message requis";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await sendTransaction();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  const fillMax = () => {
    if (!balance) return;
    // Garde une petite marge pour le gas
    const max = Math.max(0, Number(balance) - 0.0005);
    handleChange(
      { target: { value: max.toFixed(6) } } as ChangeEvent<HTMLInputElement>,
      "amount"
    );
  };

  const amountInUsd = 0; // à brancher sur le prix ETH si tu veux

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 w-full flex flex-col blue-glassmorphism"
    >
      <h2 className="text-white text-xl font-semibold mb-4">
        Nouveau transfert
      </h2>

      <Input
        placeholder="Adresse du destinataire (0x...)"
        name="addressTo"
        type="text"
        value={formData.addressTo}
        error={errors.addressTo}
        handleChange={handleChange}
      />

      <div className="relative">
        <Input
          placeholder="Montant (ETH)"
          name="amount"
          type="number"
          value={formData.amount}
          error={errors.amount}
          handleChange={handleChange}
        />
        <button
          type="button"
          onClick={fillMax}
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2",
            "text-[#2952e3] hover:text-[#2546bd] text-xs font-semibold",
            "px-2 py-1 rounded transition-colors"
          )}
        >
          MAX
        </button>
      </div>

      {formData.amount && !errors.amount && (
        <p className="text-white/40 text-xs -mt-1 mb-2">
          ≈ {amountInUsd.toFixed(2)} USD
        </p>
      )}

      <Input
        placeholder="Mot-clé (pour le GIF)"
        name="keyword"
        type="text"
        value={formData.keyword}
        error={errors.keyword}
        handleChange={handleChange}
      />
      <Input
        placeholder="Message"
        name="message"
        type="text"
        value={formData.message}
        error={errors.message}
        handleChange={handleChange}
      />

      <div className="h-[1px] w-full bg-white/10 my-4" />

      {!currentAccount ? (
        <button
          type="button"
          onClick={connectWallet}
          className={cn(
            "text-white w-full py-3 rounded-full font-semibold",
            "bg-[#2952e3] hover:bg-[#2546bd] transition-colors"
          )}
        >
          Connecter le wallet
        </button>
      ) : isLoading ? (
        <Loader />
      ) : (
        <button
          type="submit"
          className={cn(
            "flex items-center justify-center gap-2 text-white w-full py-3",
            "border border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full",
            "transition-colors font-semibold",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <Send size={18} />
          Envoyer maintenant
        </button>
      )}

      {success && (
        <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
          <CheckCircle2 size={16} />
          Transaction envoyée avec succès !
        </div>
      )}
    </form>
  );
};

export default TransferForm;