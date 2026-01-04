'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Institution, InstitutionGender } from '@/types/db-json.types';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Locale, getDictionary } from '@/app/[lang]/dictionaries';
import React from 'react';

interface InstitutionFiltersProps {
  institutions: Institution[];
  lang: Locale;
  onFilteredChange: (filtered: Institution[]) => void;
}

export function InstitutionFilters({ institutions, lang, onFilteredChange }: InstitutionFiltersProps) {
  const dict = getDictionary(lang).institutions;
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');

  // Get unique locations
  const uniqueLocations = useMemo(() => {
    const locations = new Set<string>();
    institutions.forEach(inst => {
      locations.add(inst.location[lang]);
    });
    return Array.from(locations).sort();
  }, [institutions, lang]);

  // Filter institutions
  const filteredInstitutions = useMemo(() => {
    let filtered = institutions;

    // Search by name
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(inst =>
        inst.name[lang].toLowerCase().includes(query) ||
        inst.name.en.toLowerCase().includes(query) ||
        inst.name.ar.toLowerCase().includes(query)
      );
    }

    // Filter by gender
    if (genderFilter !== 'all') {
      filtered = filtered.filter(inst => inst.gender === genderFilter);
    }

    // Filter by location
    if (locationFilter !== 'all') {
      filtered = filtered.filter(inst => inst.location[lang] === locationFilter);
    }

    return filtered;
  }, [institutions, searchQuery, genderFilter, locationFilter, lang]);

  // Notify parent of filtered results
  React.useEffect(() => {
    onFilteredChange(filteredInstitutions);
  }, [filteredInstitutions, onFilteredChange]);

  const hasFilters = searchQuery.trim() || genderFilter !== 'all' || locationFilter !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setGenderFilter('all');
    setLocationFilter('all');
  };

  return (
    <div className="mb-6 space-y-4 p-4 bg-muted/50 rounded-lg border">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <Label htmlFor="search" className="sr-only">
            {dict.search || 'Search institutions'}
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              type="text"
              placeholder={dict.searchPlaceholder || 'Search by name...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Gender Filter */}
        <div className="w-full md:w-48">
          <Label htmlFor="gender-filter" className="sr-only">
            {dict.filterByGender || 'Filter by gender'}
          </Label>
          <Select value={genderFilter} onValueChange={setGenderFilter}>
            <SelectTrigger id="gender-filter">
              <SelectValue placeholder={dict.filterByGender || 'Gender'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{dict.allGenders || 'All Genders'}</SelectItem>
              <SelectItem value="male">{dict.gender.male}</SelectItem>
              <SelectItem value="female">{dict.gender.female}</SelectItem>
              <SelectItem value="mixed">{dict.gender.mixed}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location Filter */}
        <div className="w-full md:w-48">
          <Label htmlFor="location-filter" className="sr-only">
            {dict.filterByLocation || 'Filter by location'}
          </Label>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger id="location-filter">
              <SelectValue placeholder={dict.filterByLocation || 'Location'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{dict.allLocations || 'All Locations'}</SelectItem>
              {uniqueLocations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        {hasFilters && (
          <div className="flex items-end">
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              {dict.clearFilters || 'Clear'}
            </Button>
          </div>
        )}
      </div>

      {/* Results count */}
      {hasFilters && (
        <div className="text-sm text-muted-foreground">
          {dict.showingResults || 'Showing'} {filteredInstitutions.length} {dict.of || 'of'} {institutions.length} {dict.institutions || 'institutions'}
        </div>
      )}
    </div>
  );
}

