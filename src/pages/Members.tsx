import { useEffect, useState, useMemo } from 'react';
import { Layout } from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getStoredMembers } from '@/lib/mockData';
import { YouthMember } from '@/lib/types';
import { Search, Filter, Users, Calendar, X } from 'lucide-react';
import { format, parseISO, isWithinInterval } from 'date-fns';

export default function Members() {
  const [members, setMembers] = useState<YouthMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    setMembers(getStoredMembers());
  }, []);

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        member.firstName.toLowerCase().includes(searchLower) ||
        member.lastName.toLowerCase().includes(searchLower) ||
        member.email.toLowerCase().includes(searchLower) ||
        member.phone.includes(searchQuery);

      // Gender filter
      const matchesGender = genderFilter === 'all' || member.gender === genderFilter;

      // Date range filter
      let matchesDate = true;
      if (startDate && endDate) {
        const registrationDate = parseISO(member.registrationDate);
        matchesDate = isWithinInterval(registrationDate, {
          start: parseISO(startDate),
          end: parseISO(endDate),
        });
      } else if (startDate) {
        matchesDate = parseISO(member.registrationDate) >= parseISO(startDate);
      } else if (endDate) {
        matchesDate = parseISO(member.registrationDate) <= parseISO(endDate);
      }

      return matchesSearch && matchesGender && matchesDate;
    });
  }, [members, searchQuery, genderFilter, startDate, endDate]);

  const clearFilters = () => {
    setSearchQuery('');
    setGenderFilter('all');
    setStartDate('');
    setEndDate('');
  };

  const hasActiveFilters = searchQuery || genderFilter !== 'all' || startDate || endDate;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-glow">
              <Users className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Members Directory</h1>
              <p className="text-muted-foreground">{filteredMembers.length} of {members.length} members</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Filter className="h-4 w-4" />
                Filters
              </CardTitle>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground">
                  <X className="h-4 w-4" />
                  Clear all
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Gender Filter */}
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              {/* Date Range */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="date"
                  placeholder="Start date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="date"
                  placeholder="End date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Members Table */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50">
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Contact</TableHead>
                    <TableHead className="font-semibold">Birth Date</TableHead>
                    <TableHead className="font-semibold">Gender</TableHead>
                    <TableHead className="font-semibold">Registered</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                        No members found matching your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMembers.map((member) => (
                      <TableRow key={member.id} className="group hover:bg-secondary/30 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                              {member.firstName[0]}{member.lastName[0]}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {member.firstName} {member.lastName}
                              </p>
                              {member.parentName && (
                                <p className="text-xs text-muted-foreground">
                                  Parent: {member.parentName}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-0.5">
                            <p className="text-sm text-foreground">{member.email}</p>
                            <p className="text-xs text-muted-foreground">{member.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-foreground">
                          {format(parseISO(member.dateOfBirth), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              member.gender === 'male'
                                ? 'bg-blue-100 text-blue-700'
                                : member.gender === 'female'
                                ? 'bg-pink-100 text-pink-700'
                                : 'bg-secondary text-secondary-foreground'
                            }
                          >
                            {member.gender}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-foreground">
                          {format(parseISO(member.registrationDate), 'MMM d, yyyy')}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
