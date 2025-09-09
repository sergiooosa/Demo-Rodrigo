import { SubCampaign, Ad } from '@/types';

// Generate mock campaigns with complete metrics by dividing proportionally
export const generateCampaignsFromAd = (ad: Ad): SubCampaign[] => {
  const numCampaigns = Math.floor(Math.random() * 3) + 2; // 2-4 campaigns
  const campaigns: SubCampaign[] = [];
  const baseRoas = ad.spend > 0 ? ad.cash / ad.spend : 2.5;
  
  // Generate weights for distribution (random but sum to 1)
  const weights = Array.from({ length: numCampaigns }, () => Math.random());
  const weightSum = weights.reduce((sum, w) => sum + w, 0);
  const normalizedWeights = weights.map(w => w / weightSum);
  
  for (let i = 0; i < numCampaigns; i++) {
    const campaignName = ["H1", "H2", "H3", "H4"][i] as "H1" | "H2" | "H3" | "H4";
    const weight = normalizedWeights[i];
    
    // Distribute metrics proportionally with slight variations
    const spendVariation = 0.8 + Math.random() * 0.4; // 0.8-1.2x multiplier
    const performanceVariation = 0.85 + Math.random() * 0.3; // 0.85-1.15x multiplier
    
    const spend = Math.round(ad.spend * weight * spendVariation);
    const agendasQ = Math.round(ad.agendasQ * weight * performanceVariation);
    const showsQ = Math.round(ad.showsQ * weight * performanceVariation);
    const sales = Math.round(ad.sales * weight * performanceVariation);
    const cash = Math.round(ad.cash * weight * (0.9 + Math.random() * 0.2)); // 0.9-1.1x
    
    const roas = spend > 0 ? +(cash / spend).toFixed(1) : 0;
    
    campaigns.push({
      name: campaignName,
      spend,
      impressions: Math.round(ad.impressions * weight),
      ctr: +(ad.ctr * (0.8 + Math.random() * 0.4)).toFixed(2), // 0.8-1.2x variation
      agendasQ,
      showsQ,
      sales,
      cash,
      roas
    });
  }
  
  // Sort by sales descending
  return campaigns.sort((a, b) => b.sales - a.sales);
};

// Get campaigns for an ad, with fallback to generated data
export const getAdCampaigns = (ad: Ad): SubCampaign[] => {
  if (ad.campaigns && ad.campaigns.length > 0) {
    return ad.campaigns;
  }
  
  return generateCampaignsFromAd(ad);
}; 