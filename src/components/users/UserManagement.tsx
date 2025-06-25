
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, ChevronDown } from 'lucide-react';
import InviteUserModal from './InviteUserModal';

const UserManagement: React.FC = () => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const users = [
    {
      name: 'Sarah Jones',
      email: 'sarah@example.com',
      role: 'Asset Manager',
      property: 'Greenview Apts',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150'
    },
    {
      name: 'Jordan Carter',
      email: 'jordan@example.com',
      role: 'GP',
      property: 'Arlington Heights',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    },
    {
      name: 'LP West Fund',
      email: 'fund@example.com',
      role: 'LP',
      property: 'Greenview Apts',
      status: 'Invite',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">CLIENT PORTAL ACCESS</h1>
        <div className="flex items-center space-x-4 text-lg">
          <span>Total Users: <strong>12</strong></span>
          <span>LPs Invited: <strong>4</strong></span>
          <span>Associates: <strong>2</strong></span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="How can we help?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Filters:</span>
          <Button variant="outline" className="flex items-center space-x-1">
            <span>Role</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="flex items-center space-x-1">
            <span>Property</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border">
        <div className="grid grid-cols-4 gap-4 p-4 border-b bg-gray-50 font-medium">
          <div>Name</div>
          <div>Role</div>
          <div>Assigned Property</div>
          <div>Action</div>
        </div>
        
        {users.map((user, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 p-4 border-b items-center">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
            </div>
            <div>{user.role}</div>
            <div>{user.property}</div>
            <div>
              <Button 
                variant={user.status === 'Active' ? 'outline' : 'default'}
                className={user.status === 'Invite' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
              >
                {user.status}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 mt-6">
        <Button 
          onClick={() => setShowInviteModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Invite User
        </Button>
        <Button variant="outline">
          Manage Roles
        </Button>
      </div>

      <InviteUserModal 
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />
    </div>
  );
};

export default UserManagement;
