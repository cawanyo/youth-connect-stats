import { useEffect, useState, useMemo } from 'react';
import { Layout } from '@/components/Layout';
import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getStoredMembers } from '@/lib/mockData';
import { YouthMember } from '@/lib/types';
import { Users, TrendingUp, Calendar, UserPlus, BarChart3 } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  format,
  parseISO,
  isThisMonth,
  isThisWeek,
  isThisYear,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  eachWeekOfInterval,
  subMonths,
  differenceInYears,
} from 'date-fns';

const COLORS = ['hsl(175, 60%, 40%)', 'hsl(32, 95%, 55%)', 'hsl(220, 20%, 60%)', 'hsl(142, 70%, 45%)'];

export default function Statistics() {
  const [members, setMembers] = useState<YouthMember[]>([]);

  useEffect(() => {
    setMembers(getStoredMembers());
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    return {
      total: members.length,
      thisMonth: members.filter((m) => isThisMonth(parseISO(m.registrationDate))).length,
      thisWeek: members.filter((m) => isThisWeek(parseISO(m.registrationDate))).length,
      thisYear: members.filter((m) => isThisYear(parseISO(m.registrationDate))).length,
    };
  }, [members]);

  const monthlyData = useMemo(() => {
    const now = new Date();
    const months = eachMonthOfInterval({
      start: subMonths(now, 11),
      end: now,
    });

    return months.map((month) => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      const count = members.filter((m) => {
        const regDate = parseISO(m.registrationDate);
        return regDate >= monthStart && regDate <= monthEnd;
      }).length;

      return {
        month: format(month, 'MMM'),
        fullMonth: format(month, 'MMMM yyyy'),
        count,
      };
    });
  }, [members]);

  const weeklyData = useMemo(() => {
    const now = new Date();
    const weeks = eachWeekOfInterval({
      start: subMonths(now, 2),
      end: now,
    });

    return weeks.slice(-8).map((weekStart, index) => {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const count = members.filter((m) => {
        const regDate = parseISO(m.registrationDate);
        return regDate >= weekStart && regDate <= weekEnd;
      }).length;

      return {
        week: `Week ${index + 1}`,
        fullWeek: `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`,
        count,
      };
    });
  }, [members]);

  const genderData = useMemo(() => {
    const genderCounts = members.reduce((acc, member) => {
      acc[member.gender] = (acc[member.gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(genderCounts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [members]);

  const ageDistribution = useMemo(() => {
    const now = new Date();
    const ageRanges = [
      { range: '10-12', min: 10, max: 12 },
      { range: '13-15', min: 13, max: 15 },
      { range: '16-18', min: 16, max: 18 },
      { range: '19-21', min: 19, max: 21 },
      { range: '22+', min: 22, max: 100 },
    ];

    return ageRanges.map(({ range, min, max }) => {
      const count = members.filter((m) => {
        const age = differenceInYears(now, parseISO(m.dateOfBirth));
        return age >= min && age <= max;
      }).length;

      return { range, count };
    });
  }, [members]);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 animate-slide-up">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-glow">
            <BarChart3 className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Statistics & Analytics</h1>
            <p className="text-muted-foreground">Track your youth group growth</p>
          </div>
        </div>

        {/* Stats Overview */}
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

        {/* Charts */}
        <Tabs defaultValue="monthly" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
          </TabsList>

          {/* Monthly Chart */}
          <TabsContent value="monthly" className="space-y-4">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Monthly Registration Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(175, 60%, 40%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(175, 60%, 40%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        labelFormatter={(label, payload) => payload[0]?.payload?.fullMonth || label}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="hsl(175, 60%, 40%)"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorCount)"
                        name="Registrations"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Weekly Chart */}
          <TabsContent value="weekly" className="space-y-4">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Weekly Registration Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        labelFormatter={(label, payload) => payload[0]?.payload?.fullWeek || label}
                      />
                      <Bar
                        dataKey="count"
                        fill="hsl(175, 60%, 40%)"
                        radius={[4, 4, 0, 0]}
                        name="Registrations"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Demographics */}
          <TabsContent value="demographics" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Gender Distribution */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Gender Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={genderData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {genderData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Age Distribution */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Age Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ageDistribution} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis
                          dataKey="range"
                          type="category"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          width={50}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                        <Bar
                          dataKey="count"
                          fill="hsl(32, 95%, 55%)"
                          radius={[0, 4, 4, 0]}
                          name="Members"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
