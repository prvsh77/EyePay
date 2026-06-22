import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type Recipient } from "../lib/api";
import { Plus, Edit2, Trash2, Users, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "../hooks/use-toast";

export default function Recipients() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null);
  const { toast } = useToast();

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch recipients
  const {
    data: recipients = [],
    isLoading,
    error: loadError,
  } = useQuery({
    queryKey: ["recipients"],
    queryFn: api.recipients.list,
  });

  // Create recipient mutation
  const createMutation = useMutation({
    mutationFn: api.recipients.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["recipients"] });
      toast({ title: "Recipient Saved", description: "Successfully added contact to list." });
      closeModal();
    },
    onError: (err: Error) => {
      setFormError(err.message || "Failed to create recipient.");
    },
  });

  // Update recipient mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: any }) =>
      api.recipients.update(id, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["recipients"] });
      toast({ title: "Recipient Updated", description: "Contact details refreshed." });
      closeModal();
    },
    onError: (err: Error) => {
      setFormError(err.message || "Failed to update recipient.");
    },
  });

  // Delete recipient mutation
  const deleteMutation = useMutation({
    mutationFn: api.recipients.delete,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["recipients"] });
      toast({ title: "Recipient Deleted", description: "Contact removed from list." });
    },
    onError: (err: Error) => {
      toast({ variant: "destructive", title: "Action Failed", description: err.message });
    },
  });

  const openAddModal = () => {
    setEditingRecipient(null);
    setName("");
    setEmail("");
    setWalletAddress("");
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (recipient: Recipient) => {
    setEditingRecipient(recipient);
    setName(recipient.name);
    setEmail(recipient.email);
    setWalletAddress(recipient.walletAddress);
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRecipient(null);
    setName("");
    setEmail("");
    setWalletAddress("");
    setFormError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim() || !email.trim() || !walletAddress.trim()) {
      setFormError("All fields are required.");
      return;
    }

    const payload = { name, email, walletAddress };

    if (editingRecipient) {
      updateMutation.mutate({ id: editingRecipient.id, body: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this recipient?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-12 text-center text-foreground">
        <div className="bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 p-6 rounded-2xl max-w-md mx-auto">
          <h2 className="text-lg font-bold mb-2">Error Loading Recipients</h2>
          <p className="text-sm">{loadError.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 relative z-10 text-foreground">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Recipients</h1>
          <p className="text-muted-foreground text-sm">Save your trusted contacts to send funds quickly.</p>
        </div>
        <Button onClick={openAddModal} className="flex items-center gap-1.5 font-semibold w-fit" data-testid="button-add-recipient">
          <Plus className="h-4 w-4" /> Add Recipient
        </Button>
      </div>

      {/* Recipients List */}
      {recipients.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border/40 rounded-3xl bg-muted/10">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-60" />
          <p className="text-muted-foreground text-sm mb-4">No recipients saved yet.</p>
          <Button onClick={openAddModal} variant="outline" className="font-semibold text-xs bg-background/50">
            Add Your First Recipient
          </Button>
        </div>
      ) : (
        <div className="glass-card rounded-3xl overflow-hidden border border-border/50 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-muted/20 border-b border-border/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Wallet Address</th>
                  <th className="px-6 py-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {recipients.map((recipient) => (
                  <tr key={recipient.id} className="hover:bg-muted/30 transition-colors" data-testid={`recipient-${recipient.id}`}>
                    <td className="px-6 py-4 font-bold text-foreground">{recipient.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{recipient.email}</td>
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground break-all">{recipient.walletAddress}</td>
                    <td className="px-6 py-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(recipient)}
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          data-testid={`button-edit-${recipient.id}`}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(recipient.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-red-500"
                          data-testid={`button-delete-${recipient.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl w-full max-w-md p-6 relative border border-border/60 shadow-2xl">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <UserPlus className="h-5 w-5" />
              </div>
              <h2 className="font-extrabold text-xl text-foreground">
                {editingRecipient ? "Edit Recipient" : "Add Recipient"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 text-xs p-2.5 rounded-xl animate-shake">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-semibold bg-background/50 text-foreground"
                  data-testid="input-recipient-name"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background/50 text-foreground"
                  data-testid="input-recipient-email"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase">Wallet Address</label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={e => setWalletAddress(e.target.value)}
                  placeholder="0x1234...5678"
                  className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono text-xs bg-background/50 text-foreground"
                  data-testid="input-recipient-address"
                  required
                />
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={closeModal}
                  className="flex-1 font-semibold border"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 font-bold border-none"
                  data-testid="button-save-recipient"
                >
                  {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
