import { useState } from "react";
import { Building2, Briefcase, Users, MapPin, Calendar, Mail, Phone, Globe, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { toast } from "sonner";

interface Profile {
  businessName: string;
  sector: string;
  ownershipType: string;
  businessSize: string;
  region: string;
  yearEstablished: string;
  email: string;
  phone: string;
  website: string;
}

const SMEProfileBuilder = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [formData, setFormData] = useState<Profile>({
    businessName: "",
    sector: "",
    ownershipType: "",
    businessSize: "",
    region: "",
    yearEstablished: "",
    email: "",
    phone: "",
    website: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Replace with API call to Django backend
    // Example: await fetch('/api/profiles', { method: 'POST', body: JSON.stringify(formData) })
    
    setProfiles([...profiles, formData]);
    toast.success("✅ Profile submitted successfully!");
    
    // TODO: Fetch AI-generated summary and recommendations from backend
    // Example: const insights = await fetchProfileInsights(formData)
    
    setFormData({
      businessName: "",
      sector: "",
      ownershipType: "",
      businessSize: "",
      region: "",
      yearEstablished: "",
      email: "",
      phone: "",
      website: "",
    });
  };

  return (
    <div className="space-y-8">
      <Card className="max-w-3xl mx-auto shadow-card">
        <CardHeader className="gradient-hero text-primary-foreground rounded-t-xl">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            📋 SME Profile Details
          </CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Build your business profile to unlock personalized insights
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="businessName" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  Business Name
                </Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  required
                  className="border-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  Sector
                </Label>
                <Select value={formData.sector} onValueChange={(value) => setFormData({ ...formData, sector: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agriculture">Agriculture</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownershipType" className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Ownership Type
                </Label>
                <Select value={formData.ownershipType} onValueChange={(value) => setFormData({ ...formData, ownershipType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sole">Sole Proprietorship</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="limited">Limited Company</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessSize" className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Business Size
                </Label>
                <Select value={formData.businessSize} onValueChange={(value) => setFormData({ ...formData, businessSize: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="micro">Micro (1-9 employees)</SelectItem>
                    <SelectItem value="small">Small (10-49 employees)</SelectItem>
                    <SelectItem value="medium">Medium (50-250 employees)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="region" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Region
                </Label>
                <Select value={formData.region} onValueChange={(value) => setFormData({ ...formData, region: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nairobi">Nairobi</SelectItem>
                    <SelectItem value="mombasa">Mombasa</SelectItem>
                    <SelectItem value="kisumu">Kisumu</SelectItem>
                    <SelectItem value="nakuru">Nakuru</SelectItem>
                    <SelectItem value="eldoret">Eldoret</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearEstablished" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Year Established
                </Label>
                <Input
                  id="yearEstablished"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={formData.yearEstablished}
                  onChange={(e) => setFormData({ ...formData, yearEstablished: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  Contact Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="website" className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  Website (optional)
                </Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
            </div>

            <Button type="submit" className="w-full gradient-hero">
              Submit Profile
            </Button>
          </form>
        </CardContent>
      </Card>

      {profiles.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            📊 Submitted Profiles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile, index) => (
              <Card key={index} className="shadow-card hover:shadow-hover transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    {profile.businessName}
                  </CardTitle>
                  <CardDescription>
                    {profile.sector} • {profile.region}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p><strong>Type:</strong> {profile.ownershipType}</p>
                  <p><strong>Size:</strong> {profile.businessSize}</p>
                  <p><strong>Est:</strong> {profile.yearEstablished}</p>
                  <p><strong>Contact:</strong> {profile.email}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SMEProfileBuilder;
