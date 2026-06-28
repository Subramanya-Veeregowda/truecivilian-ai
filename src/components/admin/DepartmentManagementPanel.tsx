import React, { useState } from "react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input, Select } from "../ui/Input";
import { Plus, Edit2, Trash2, Mail, Phone, User, Landmark, X } from "lucide-react";
import api from "../../lib/api";
import { useNotifications } from "../../context/NotificationContext";

interface Department {
  id: string;
  name: string;
  departmentType: string;
  contactEmail: string;
  contactPhone: string;
  headOfDepartment: string;
}

interface DepartmentManagementPanelProps {
  departments: Department[];
  onRefresh: () => void;
}

export const DepartmentManagementPanel: React.FC<DepartmentManagementPanelProps> = ({ departments, onRefresh }) => {
  const { addNotification } = useNotifications();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [departmentType, setDepartmentType] = useState("ROADS_AND_TRANSPORT");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [headOfDepartment, setHeadOfDepartment] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setDepartmentType("ROADS_AND_TRANSPORT");
    setContactEmail("");
    setContactPhone("");
    setHeadOfDepartment("");
    setSelectedDeptId(null);
    setIsEditing(false);
  };

  const handleEditClick = (dept: Department) => {
    setSelectedDeptId(dept.id);
    setName(dept.name);
    setDepartmentType(dept.departmentType);
    setContactEmail(dept.contactEmail || "");
    setContactPhone(dept.contactPhone || "");
    setHeadOfDepartment(dept.headOfDepartment || "");
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name,
        departmentType,
        contactEmail,
        contactPhone,
        headOfDepartment,
      };

      if (selectedDeptId) {
        await api.put(`/admin/departments/${selectedDeptId}`, payload);
        addNotification("Department Updated", "Department profile saved successfully.", "success");
      } else {
        await api.post("/admin/departments", payload);
        addNotification("Department Created", "A new municipal department has been initialized.", "success");
      }
      onRefresh();
      resetForm();
    } catch (err: any) {
      addNotification("Operation Failed", err.response?.data?.message || "Verify your form parameters.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, deptName: string) => {
    if (!window.confirm(`Are you absolutely sure you want to terminate ${deptName}? This action is irreversible.`)) {
      return;
    }

    try {
      await api.delete(`/admin/departments/${id}`);
      addNotification("Department Terminated", "Department records cleared from system registers.", "success");
      onRefresh();
      if (selectedDeptId === id) resetForm();
    } catch (err: any) {
      addNotification("Decommission Failed", err.response?.data?.message || "An error occurred", "error");
    }
  };

  return (
    <div id="admin-department-management-panel" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-display font-bold text-zinc-900 dark:text-white text-base">
            Departmental Administration
          </h3>
          <p className="text-xs text-zinc-500">
            Provision official public operational branches, appoint executive heads, and update contact details.
          </p>
        </div>
        {!isEditing && (
          <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsEditing(true)}>
            Add Department
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form panel */}
        {isEditing && (
          <Card className="lg:col-span-4 border border-zinc-200/60 dark:border-zinc-800/60 h-fit">
            <CardHeader className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-900 pb-3">
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
                {selectedDeptId ? "Edit Branch" : "Register Branch"}
              </span>
              <button onClick={resetForm} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </CardHeader>
            <CardBody className="p-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Department Name
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Sanitation & Waste Management"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    SLA Operations Type
                  </label>
                  <Select
                    value={departmentType}
                    onChange={(e) => setDepartmentType(e.target.value)}
                  >
                    <option value="ROADS_AND_TRANSPORT">Roads & Transport</option>
                    <option value="WATER_AND_SEWERAGE">Water & Sewerage</option>
                    <option value="WASTE_MANAGEMENT">Waste Management</option>
                    <option value="ELECTRICITY_AND_POWER">Electricity & Power</option>
                    <option value="HEALTH_AND_SANITATION">Health & Sanitation</option>
                    <option value="GENERAL">General Public</option>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Head of Department (Appointed)
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Commissioner Charles Vance"
                    value={headOfDepartment}
                    onChange={(e) => setHeadOfDepartment(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Official Contact Email
                  </label>
                  <Input
                    type="email"
                    placeholder="e.g. helpdesk.waste@city.gov"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Operations Helpline Phone
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. +1 (555) 019-2834"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="secondary" size="xs" onClick={resetForm} type="button" className="w-1/2">
                    Cancel
                  </Button>
                  <Button variant="primary" size="xs" type="submit" disabled={isSubmitting} className="w-1/2">
                    {selectedDeptId ? "Save Changes" : "Deploy Branch"}
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        )}

        {/* List card panel */}
        <div className={`${isEditing ? "lg:col-span-8" : "lg:col-span-12"} grid grid-cols-1 md:grid-cols-2 gap-6`}>
          {departments.length === 0 ? (
            <div className="col-span-full py-16 text-center text-xs text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
              No municipal branches registered yet. Add a department above to initiate dispatch.
            </div>
          ) : (
            departments.map((dept) => (
              <Card
                key={dept.id}
                className="hover:border-zinc-300 dark:hover:border-zinc-800 transition-all border border-zinc-200/50 dark:border-zinc-800/50 relative group overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
                <CardBody className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-zinc-900 dark:text-white font-bold text-sm">
                        <Landmark className="h-4 w-4 text-zinc-400 stroke-[2.2]" />
                        <span>{dept.name}</span>
                      </div>
                      <span className="inline-block text-[9px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded uppercase">
                        {dept.departmentType.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditClick(dept)}
                        className="p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 border border-zinc-200/50 dark:border-zinc-800/50 transition-colors"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(dept.id, dept.name)}
                        className="p-1.5 rounded-lg bg-red-50/20 dark:bg-red-950/10 text-red-400 hover:text-red-600 transition-colors border border-red-500/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-zinc-100 dark:border-zinc-900/50 pt-3">
                    <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                      <User className="h-3.5 w-3.5 text-zinc-400" />
                      <span className="font-semibold text-[11px]">Head:</span>
                      <span className="text-[11px] font-medium">{dept.headOfDepartment || "Not Appointed"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                      <Mail className="h-3.5 w-3.5 text-zinc-400" />
                      <span className="font-semibold text-[11px]">Email:</span>
                      <span className="text-[11px] font-mono">{dept.contactEmail || "No Email"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                      <Phone className="h-3.5 w-3.5 text-zinc-400" />
                      <span className="font-semibold text-[11px]">Phone:</span>
                      <span className="text-[11px] font-mono">{dept.contactPhone || "No Phone"}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
