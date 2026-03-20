"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Role } from "@prisma/client";

export function RoleSwitcher() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  
  // Only originalRole SUPERADMIN can use this
  if (session?.user?.originalRole !== "SUPERADMIN" && session?.user?.role !== "SUPERADMIN") return null;

  const handleRoleSwitch = async (role: Role) => {
    await update({ impersonatedRole: role }); // Force session update
    router.refresh();
    setIsOpen(false);
  };

  const handleReset = async () => {
    await update({ clearImpersonation: true });
    router.refresh();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsOpen(!isOpen)}
        className="text-xs bg-amber-100 text-amber-900 border-amber-200 hover:bg-amber-200"
      >
        Impersonate (Current: {session?.user?.role})
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
          <div className="py-1">
            {(Object.keys(Role) as Array<Role>).map((role) => (
              <button
                key={role}
                onClick={() => handleRoleSwitch(role)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {role}
              </button>
            ))}
            <hr className="my-1 border-gray-200" />
            <button
              onClick={handleReset}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Reset to SUPERADMIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}