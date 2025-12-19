import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { StatCard } from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getStoredMembers } from '@/lib/mockData';
import { YouthMember } from '@/lib/types';
import { format, isThisMonth, isThisWeek, isThisYear, parseISO } from 'date-fns';

export default function Dashboard() {
  const [members, setMembers] = useState<YouthMember[]>([]);

  useEffect(() => {
    setMembers(getStoredMembers());
  }, []);

  const stats = {
    total: members.length,
    thisMonth: members.filter(m => isThisMonth(parseISO(m.registrationDate))).length,
    thisWeek: members.filter(m => isThisWeek(parseISO(m.registrationDate))).length,
    thisYear: members.filter(m => isThisYear(parseISO(m.registrationDate))).length,
  };

  const recentMembers = members.slice(0, 5);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="space-y-2 animate-slide-up">
          <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground">
            Manage your youth group registrations and track growth
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <Link to="/register">
            <Button className="gap-2 gradient-primary hover:opacity-90 shadow-md">
              <UserPlus className="h-4 w-4" />
              Register New Member
            </Button>
          </Link>
          <Link to="/members">
            <Button variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              View All Members
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Members"
            value={stats.total}
            icon={<Users className="h-6 w-6" />}
            variant="primary"
          />
          <StatCard
            title="This Month"
            value={stats.thisMonth}
            icon={<Calendar className="h-6 w-6" />}
            trend={{ value: 12, label: 'vs last month' }}
          />
          <StatCard
            title="This Week"
            value={stats.thisWeek}
            icon={<TrendingUp className="h-6 w-6" />}
          />
          <StatCard
            title="This Year"
            value={stats.thisYear}
            icon={<UserPlus className="h-6 w-6" />}
            variant="accent"
          />
        </div>

        {/* Recent Registrations */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Recent Registrations</CardTitle>
            <Link to="/members">
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMembers.map((member, index) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
                  style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                      {member.firstName[0]}{member.lastName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      {format(parseISO(member.registrationDate), 'MMM d, yyyy')}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">{member.gender}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
