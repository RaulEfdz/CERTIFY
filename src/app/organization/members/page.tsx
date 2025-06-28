import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { MembersTable } from '@/components/organization/members-table';
import { InviteMemberDialog } from '@/components/organization/invite-member-dialog';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export default async function OrganizationMembersPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Verificar sesión
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    redirect('/login');
  }

  // Obtener la organización actual del usuario
  const { data: membership, error: membershipError } = await supabase
    .from('organization_members')
    .select('organization_id, organizations(name)')
    .eq('user_id', user.id)
    .single();

  if (membershipError || !membership) {
    redirect('/settings/organization');
  }

  const organizationId = membership.organization_id;
  const organizationName = typeof membership.organizations === 'object' ? 
    (membership.organizations as { name: string }).name : '';

  // Obtener los miembros de la organización
  const { data: members, error: membersError } = await supabase
    .from('organization_members')
    .select(`
      id,
      role,
      created_at,
      user_id,
      profiles:profiles(id, full_name, email, avatar_url)
    `)
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });

  // Obtener las invitaciones pendientes
  const { data: pendingInvitations, error: invitationsError } = await supabase
    .from('organization_invitations')
    .select('*')
    .eq('organization_id', organizationId)
    .is('accepted_at', null)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Miembros del equipo</h1>
            <p className="text-muted-foreground">
              Gestiona los miembros de {organizationName}
            </p>
          </div>
          <div className="flex space-x-2">
            <InviteMemberDialog 
              organizationId={organizationId}
              trigger={
                <Button>
                  <Icons.userPlus className="mr-2 h-4 w-4" />
                  Invitar miembro
                </Button>
              }
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <MembersTable 
          members={members || []} 
          pendingInvitations={pendingInvitations || []}
          currentUserId={user.id}
          organizationId={organizationId}
        />
      </div>
    </div>
  );
}
