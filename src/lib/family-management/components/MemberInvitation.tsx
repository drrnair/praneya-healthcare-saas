'use client';

import React, { useState } from 'react';
import { UserPlus, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface MemberInvitationProps {
  onInvite?: (email: string, role: string) => void;
}

export function MemberInvitation({ onInvite }: MemberInvitationProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && role) {
      onInvite?.(email, role);
      setEmail('');
      setRole('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <UserPlus className="h-5 w-5 text-blue-600" />
          <span>Invite Family Member</span>
        </CardTitle>
        <CardDescription>
          Send an invitation to join your family health plan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="member@example.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select role</option>
              <option value="parent">Parent</option>
              <option value="adult">Adult</option>
              <option value="teen">Teen</option>
              <option value="child">Child</option>
              <option value="guardian">Guardian</option>
            </select>
          </div>

          <Button type="submit" className="w-full">
            <Mail className="h-4 w-4 mr-2" />
            Send Invitation
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 