'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Locale } from '../../../../dictionaries';
import { updateInstitution } from '@/services/institutions';
import { Institution, InstitutionType, InstitutionGender } from '@/types/db-json.types';
import { AlertCircle } from 'lucide-react';

export function EditInstitutionForm({ institution, lang }: { institution: Institution; lang: Locale }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form state initialized with institution data
  const [nameEn, setNameEn] = useState(institution.name.en);
  const [nameAr, setNameAr] = useState(institution.name.ar);
  const [locationEn, setLocationEn] = useState(institution.location.en);
  const [locationAr, setLocationAr] = useState(institution.location.ar);
  const [type, setType] = useState<InstitutionType>(institution.type);
  const [gender, setGender] = useState<InstitutionGender>(institution.gender);
  const [isVisible, setIsVisible] = useState(institution.is_visible);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const institutionData = {
        ...institution,
        name: {
          en: nameEn.trim(),
          ar: nameAr.trim(),
        },
        location: {
          en: locationEn.trim(),
          ar: locationAr.trim(),
        },
        type,
        gender,
        is_visible: isVisible,
      };

      await updateInstitution(institution.id, institutionData);
      
      // Redirect to admin dashboard
      router.push(`/${lang}/admin/dashboard`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to update institution');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Name - English */}
      <div className="space-y-2">
        <Label htmlFor="name_en">Name (English) *</Label>
        <Input
          id="name_en"
          type="text"
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
          required
          placeholder="Enter institution name in English"
          disabled={isLoading}
        />
      </div>

      {/* Name - Arabic */}
      <div className="space-y-2">
        <Label htmlFor="name_ar">Name (Arabic) *</Label>
        <Input
          id="name_ar"
          type="text"
          value={nameAr}
          onChange={(e) => setNameAr(e.target.value)}
          required
          placeholder="أدخل اسم المؤسسة بالعربية"
          disabled={isLoading}
        />
      </div>

      {/* Location - English */}
      <div className="space-y-2">
        <Label htmlFor="location_en">Location (English) *</Label>
        <Input
          id="location_en"
          type="text"
          value={locationEn}
          onChange={(e) => setLocationEn(e.target.value)}
          required
          placeholder="Enter location in English"
          disabled={isLoading}
        />
      </div>

      {/* Location - Arabic */}
      <div className="space-y-2">
        <Label htmlFor="location_ar">Location (Arabic) *</Label>
        <Input
          id="location_ar"
          type="text"
          value={locationAr}
          onChange={(e) => setLocationAr(e.target.value)}
          required
          placeholder="أدخل الموقع بالعربية"
          disabled={isLoading}
        />
      </div>

      {/* Type */}
      <div className="space-y-2">
        <Label htmlFor="type">Type *</Label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as InstitutionType)}
          required
          disabled={isLoading}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        >
          <option value="school">School</option>
          <option value="university">University</option>
        </select>
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <Label htmlFor="gender">Gender *</Label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value as InstitutionGender)}
          required
          disabled={isLoading}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="mixed">Mixed</option>
        </select>
      </div>

      {/* Visibility */}
      <div className="flex items-center gap-3 space-y-0">
        <input
          type="checkbox"
          id="is_visible"
          checked={isVisible}
          onChange={(e) => setIsVisible(e.target.checked)}
          disabled={isLoading}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="is_visible" className="cursor-pointer">
          Visible to users
        </Label>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Update Institution'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/${lang}/admin/dashboard`)}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

