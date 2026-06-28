import React, { useState } from "react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input, TextArea } from "../ui/Input";
import { Plus, Edit3, Trash2, Check, X, ShieldAlert, Layers } from "lucide-react";
import api from "../../lib/api";
import { useNotifications } from "../../context/NotificationContext";

interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

interface CategoryManagementPanelProps {
  categories: Category[];
  onRefresh: () => void;
}

export const CategoryManagementPanel: React.FC<CategoryManagementPanelProps> = ({ categories, onRefresh }) => {
  const { addNotification } = useNotifications();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setDescription("");
    setIsActive(true);
    setSelectedCatId(null);
    setIsEditing(false);
  };

  const handleEditClick = (cat: Category) => {
    setSelectedCatId(cat.id);
    setName(cat.name);
    setDescription(cat.description || "");
    setIsActive(cat.isActive !== false);
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name,
        description,
        isActive,
      };

      if (selectedCatId) {
        await api.put(`/admin/categories/${selectedCatId}`, payload);
        addNotification("Category Updated", "Issue Category has been modified.", "success");
      } else {
        await api.post("/admin/categories", payload);
        addNotification("Category Created", "New Incident Category deployed successfully.", "success");
      }
      onRefresh();
      resetForm();
    } catch (err: any) {
      addNotification("Operation Failed", err.response?.data?.message || "Verify your form entries.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!window.confirm(`Are you sure you want to delete the category: ${catName}? Issues mapped to this string will fallback to unclassified.`)) {
      return;
    }

    try {
      await api.delete(`/admin/categories/${id}`);
      addNotification("Category Deleted", "Incident Category purged from system config.", "success");
      onRefresh();
      if (selectedCatId === id) resetForm();
    } catch (err: any) {
      addNotification("Deletion Failed", err.response?.data?.message || "An error occurred", "error");
    }
  };

  return (
    <div id="admin-category-management-panel" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-display font-bold text-zinc-900 dark:text-white text-base">
            Civic Category Taxonomy
          </h3>
          <p className="text-xs text-zinc-500">
            Define system wide municipal classes, organize incoming queues, and manage active categorization labels.
          </p>
        </div>
        {!isEditing && (
          <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsEditing(true)}>
            Add Category
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Overlay sidebar */}
        {isEditing && (
          <Card className="lg:col-span-4 border border-zinc-200/60 dark:border-zinc-800/60 h-fit">
            <CardHeader className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-900 pb-3">
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
                {selectedCatId ? "Edit Category" : "Deploy Category"}
              </span>
              <button onClick={resetForm} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </CardHeader>
            <CardBody className="p-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Category Name
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Sewage Spill"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Classification Details
                  </label>
                  <TextArea
                    placeholder="Describe what kind of civic issues belong in this taxonomy class..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
                  <div>
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">Active Status</span>
                    <span className="text-[10px] text-zinc-400">Controls visibility in reporting fields</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4.5 w-4.5 accent-emerald-500 rounded border-zinc-300 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="secondary" size="xs" onClick={resetForm} type="button" className="w-1/2">
                    Cancel
                  </Button>
                  <Button variant="primary" size="xs" type="submit" disabled={isSubmitting} className="w-1/2">
                    {selectedCatId ? "Save Changes" : "Deploy Class"}
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        )}

        {/* Categories List items */}
        <div className={`${isEditing ? "lg:col-span-8" : "lg:col-span-12"} grid grid-cols-1 md:grid-cols-2 gap-6`}>
          {categories.length === 0 ? (
            <div className="col-span-full py-16 text-center text-xs text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
              No categories deployed yet. Create your first civic taxonomy.
            </div>
          ) : (
            categories.map((cat) => (
              <Card
                key={cat.id}
                className="hover:border-zinc-300 dark:hover:border-zinc-800 transition-all border border-zinc-200/50 dark:border-zinc-800/50 relative overflow-hidden"
              >
                <CardBody className="p-5 space-y-3.5">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-850 text-zinc-500 dark:text-zinc-400">
                        <Layers className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-white">{cat.name}</h4>
                        <span
                          className={`inline-flex items-center gap-1 text-[9px] font-bold rounded-full px-2 py-0.2 border ${
                            cat.isActive !== false
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400"
                              : "bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/20 dark:text-red-400"
                          }`}
                        >
                          {cat.isActive !== false ? "ACTIVE" : "DISABLED"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditClick(cat)}
                        className="p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 border border-zinc-200/50 dark:border-zinc-800/50 transition-colors"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-1.5 rounded-lg bg-red-50/20 dark:bg-red-950/10 text-red-400 hover:text-red-600 transition-colors border border-red-500/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                    {cat.description || "No classification guidelines specified for this incident category."}
                  </p>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
