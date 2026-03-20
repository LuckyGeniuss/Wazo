"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createCustomerGroup, deleteCustomerGroup } from "../actions/customer-group";
import { Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface CustomerGroupClientProps {
  storeId: string;
  initialGroups: any[];
}

export function CustomerGroupClient({ storeId, initialGroups }: CustomerGroupClientProps) {
  const [groups, setGroups] = useState(initialGroups);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [discount, setDiscount] = useState("0");
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newGroup = await createCustomerGroup(storeId, {
        name,
        discountPercentage: parseFloat(discount),
      });
      setGroups([{ ...newGroup, _count: { users: 0 } }, ...groups]);
      setName("");
      setDiscount("0");
      setIsCreating(false);
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCustomerGroup(storeId, id);
      setGroups(groups.filter((g) => g.id !== id));
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Customer Groups & Discounts</h3>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
          <Plus className="w-4 h-4 mr-2" />
          New Group
        </Button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. VIP Customers"
            />
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
            <input
              type="number"
              required
              min="0"
              max="100"
              step="0.1"
              className="w-full px-3 py-2 border rounded-md"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {groups.map((group) => (
              <tr key={group.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{group.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {group.discountPercentage > 0 ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      -{group.discountPercentage}%
                    </span>
                  ) : (
                    "None"
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{group._count?.users || 0}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(group.id)}
                    className="text-red-600 hover:text-red-900 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {groups.length === 0 && !isCreating && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                  No customer groups found. Create one to offer discounts.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}