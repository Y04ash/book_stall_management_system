import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/Card"
import { Badge } from "@/Components/ui/Badge"
import { MapPin, Book, Library, Tags, IndianRupee, Calendar } from "lucide-react"
 
export default function RecentCampaign({ campaign }) {
  // Derived values
  const totalProducts = campaign.products?.reduce((sum, b) => sum + (b.quantity || 0), 0) || 0;
  const uniqueTitles = campaign.products?.length || 0;
  const categories = new Set(campaign.products?.map(b => b.category));
  const subCategories = new Set(campaign.products?.map(b => b.subCategory));
  const estimatedRevenue = campaign.products?.reduce(
    (sum, b) => sum + (b.price || 0) * (b.quantity || 0), 0
  ) || 0;
  const avgProductPrice = totalProducts ? (estimatedRevenue / totalProducts).toFixed(2) : 0;
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB");
  };
  return (
    <Card className="h-full flex flex-col justify-between shadow-lg rounded-2xl overflow-hidden">
      {/* Header */}
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <CardTitle className="text-2xl font-bold">{campaign.campaignName}</CardTitle>
        <div className="flex justify-between items-center text-sm mt-1">
          <span>{campaign.sellerName}</span>
          <Badge variant={campaign.camp_ended ? "destructive" : "secondary"}>
            {campaign.camp_ended ? "Ended" : "Active"}
          </Badge>
        </div>
        <div className="flex items-center text-xs mt-1">
          <MapPin className="w-3 h-3 mr-1" />
          {campaign.location}
        </div>
        <div className="flex items-center text-xs mt-1">
          <Calendar className="w-3 h-3 mr-1" />
          Started: {formatDate(campaign.startDate)}
        </div>
      </CardHeader>

      {/* Image */}
      <div className="h-40 w-full bg-gray-100 flex items-center justify-center">
        <img
          src="../../images/bookstallimg.jpg" // Placeholder image, replace with actual campaign image
          alt="Campaign visual"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Stats Grid */}
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Book className="w-4 h-4 text-indigo-500" />
            <span>Total Products: <strong>{totalProducts}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Library className="w-4 h-4 text-green-500" />
            <span>Unique Titles: <strong>{uniqueTitles}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Tags className="w-4 h-4 text-orange-500" />
            <span>Categories: <strong>{categories.size}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Tags className="w-4 h-4 text-pink-500" />
            <span>Subcategories: <strong>{subCategories.size}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-yellow-500" />
            <span>Est. Revenue: <strong>₹{estimatedRevenue.toLocaleString()}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-blue-500" />
            <span>Avg Price: <strong>₹{avgProductPrice}</strong></span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
