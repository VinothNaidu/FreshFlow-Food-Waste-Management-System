// src/pages/StaffManagementPage.tsx
import { useEffect, useState } from "react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search, UserPlus, Eye, Edit, Trash2
} from "lucide-react";

interface StaffMember {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastLogin: string;
  created: string;
}

interface FormData {
  name: string;
  email: string;
  password: string; 
  role: string;
  status: 'active' | 'inactive';
}

const emptyForm: FormData = { name: "", email: "", password: "", role: "Staff", status: "active" };

export default function StaffManagementPage() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [staffFilter, setStaffFilter] = useState("");
  const [staffNotification, setStaffNotification] = useState<string | null>(null);

  const [modalType, setModalType] = useState<"create" | "view" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);

  useEffect(() => {
    fetch("http://localhost:3000/staff")
      .then(r => r.json())
      .then((rows: any[]) => {
        const mapped = rows.map(r => ({
          id: r.StaffID,
          name: r.Name,
          email: r.Email,
          role: r.Role,
          status: r.Status,
          lastLogin: r.LastLogin ?? "Never",
          created: new Date(r.CreatedAt).toLocaleDateString("en-MY", {
            day: "2-digit", month: "short", year: "numeric"
          })
        }));
        setStaffMembers(mapped);
      });
  }, []);

  const filtered = staffMembers.filter(s =>
    s.name.toLowerCase().includes(staffFilter.toLowerCase()) ||
    s.email.toLowerCase().includes(staffFilter.toLowerCase())
  );

  const open = (kind: "create" | "view" | "edit" | "delete", staff?: StaffMember) => {
    setModalType(kind);
    setSelected(staff ?? null);
    setFormData(kind === "create"
      ? emptyForm
      : {
        name: staff?.name ?? "",
        email: staff?.email ?? "",
        password: "",
        role: staff?.role ?? "Staff",
        status: staff?.status ?? "active"
      }
    );
  };

  const close = () => {
    setModalType(null);
    setSelected(null);
    setFormData(emptyForm);
  };

  const createStaff = () => {
    const fakeId = Math.max(0, ...staffMembers.map(s => s.id)) + 1;
    const newStaff: StaffMember = {
      id: fakeId,
      ...formData,
      lastLogin: "Never",
      created: new Date().toLocaleDateString("en-MY")
    };
    setStaffMembers([...staffMembers, newStaff]);
    setStaffNotification(`Created ${newStaff.name}`);
    close();
  };

  const updateStaff = () => {
    if (!selected) return;
    setStaffMembers(staffMembers.map(s => s.id === selected.id ? { ...s, ...formData } : s));
    setStaffNotification(`Updated ${formData.name}`);
    close();
  };

  const deleteStaff = () => {
    if (!selected) return;
    setStaffMembers(staffMembers.filter(s => s.id !== selected.id));
    setStaffNotification(`Deleted ${selected.name}`);
    close();
  };

  const handleToggleStatus = (staff: StaffMember) => {
    const newStatus = staff.status === 'active' ? 'inactive' : 'active';

    fetch(`http://localhost:3000/staff/${staff.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to update status');
        return res.json();
      })
      .then(() => {
        setStaffMembers((prev) =>
          prev.map((s) =>
            s.id === staff.id ? { ...s, status: newStatus } : s
          )
        );
        setStaffNotification(
          `Staff member ${newStatus === 'active' ? 'Activated' : 'Deactivated'} for ${staff.name}.`
        );
        setTimeout(() => setStaffNotification(null), 5000);
      })
      .catch((err) => {
        console.error('Status toggle failed:', err);
        alert('Failed to update staff status.');
      });
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle>Staff Management</CardTitle>
            <CardDescription>Manage team member accounts</CardDescription>
          </div>
          <Button onClick={() => open("create")}>
            <UserPlus className="h-4 w-4 mr-1" /> Create Staff
          </Button>
        </CardHeader>

        <CardContent>
          <div className="mb-4 flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-500" />
            <input
              className="flex-1 border rounded px-3 py-2"
              value={staffFilter}
              onChange={e => setStaffFilter(e.target.value)}
              placeholder="Search staff…"
            />
          </div>

          {staffNotification && (
            <div className="mb-4 p-3 bg-green-50 rounded">{staffNotification}</div>
          )}

          <div className="space-y-4">
            {filtered.length ? filtered.map(staff => (
              <div key={staff.id} className="p-4 border rounded">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">{staff.name}</h3>
                    <p className="text-sm text-muted">{staff.email}</p>
                  </div>
                  <Badge>{staff.status}</Badge>
                </div>
                <div className="mt-2 flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline" onClick={() => open("view", staff)}><Eye className="h-4 w-4 mr-1" />View</Button>
                  <Button size="sm" variant="outline" onClick={() => open("edit", staff)}><Edit className="h-4 w-4 mr-1" />Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => open("delete", staff)}><Trash2 className="h-4 w-4 mr-1" />Delete</Button>
                  <Button size="sm" variant="secondary" onClick={() => handleToggleStatus(staff)}>
                    {staff.status === "active" ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>
            )) : <p className="text-center text-muted">No staff found.</p>}
          </div>
        </CardContent>
      </Card>

      {modalType && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 capitalize">{modalType} staff</h2>

            {modalType === "view" ? (
              <>
                <p><b>Name:</b> {selected?.name}</p>
                <p><b>Email:</b> {selected?.email}</p>
                <p><b>Role:</b> {selected?.role}</p>
                <p><b>Status:</b> {selected?.status}</p>
              </>
            ) : (
              <>
                <input className="border w-full mb-2 p-2 rounded"
                  placeholder="Name" value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })} />
                <input className="border w-full mb-2 p-2 rounded"
                  placeholder="Email" value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })} />
                <select className="border w-full mb-4 p-2 rounded"
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}>
                  <option value="Staff">Staff</option>
                  <option value="Manager">Manager</option>
                </select>
              </>
            )}

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={close}>Close</Button>
              {modalType === "create" && <Button onClick={createStaff}>Create</Button>}
              {modalType === "edit" && <Button onClick={updateStaff}>Save</Button>}
              {modalType === "delete" && <Button variant="destructive" onClick={deleteStaff}>Delete</Button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
