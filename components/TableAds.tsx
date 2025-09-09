import React, { useState, Fragment } from 'react';
import { Ad, SubCampaign } from '../types';
import { money0, money2, safeDiv, x } from '../utils/helpers';
import { getAdCampaigns } from '../lib/campaigns';

interface TableAdsProps {
  ads: Ad[];
}

export default function TableAds({ ads }: TableAdsProps) {
  // Filter only Meta Ads
  const metaAds = ads.filter(ad => ad.medium === "Meta Ads");
  
  // Initialize with all Meta Ads expanded by default
  const [expandedAds, setExpandedAds] = useState<Set<string>>(
    new Set(metaAds.map(ad => ad.adId))
  );
  
  // Sort by sales descending
  const sortedAds = [...metaAds].sort((a, b) => b.sales - a.sales);

  const toggleExpanded = (adId: string) => {
    const newExpanded = new Set(expandedAds);
    if (newExpanded.has(adId)) {
      newExpanded.delete(adId);
    } else {
      newExpanded.add(adId);
    }
    setExpandedAds(newExpanded);
  };

  const isExpanded = (adId: string) => expandedAds.has(adId);

  // Calculate metrics for campaigns
  const getCampaignMetrics = (campaign: SubCampaign) => {
    const cpaq = campaign.cpaq ?? safeDiv(campaign.spend, campaign.agendasQ);
    const cpsq = campaign.cpsq ?? safeDiv(campaign.spend, campaign.showsQ);
    const cac = campaign.cac ?? safeDiv(campaign.spend, campaign.sales);
    return { cpaq, cpsq, cac };
  };

  // Calculate totals for an ad (sum of all its campaigns)
  const getAdTotals = (ad: Ad) => {
    const campaigns = getAdCampaigns(ad);
    const totals = campaigns.reduce((acc, campaign) => ({
      spend: acc.spend + campaign.spend,
      impressions: acc.impressions + campaign.impressions,
      agendasQ: acc.agendasQ + campaign.agendasQ,
      showsQ: acc.showsQ + campaign.showsQ,
      sales: acc.sales + campaign.sales,
      cash: acc.cash + campaign.cash,
      reservas: acc.reservas + (campaign.reservas || 0),
      valorReservas: acc.valorReservas + (campaign.valorReservas || 0),
    }), {
      spend: 0,
      impressions: 0,
      agendasQ: 0,
      showsQ: 0,
      sales: 0,
      cash: 0,
      reservas: 0,
      valorReservas: 0,
    });

    // Calculate derived metrics
    const ctr = safeDiv(totals.impressions, totals.spend) * 100; // This would need actual clicks data
    const cpaq = safeDiv(totals.spend, totals.agendasQ);
    const cpsq = safeDiv(totals.spend, totals.showsQ);
    const cac = safeDiv(totals.spend, totals.sales);
    const roas = safeDiv(totals.cash, totals.spend);

    return {
      ...totals,
      ctr: ctr.toFixed(1),
      cpaq,
      cpsq,
      cac,
      roas,
    };
  };

  // Get campaign color based on ad name
  const getCampaignColor = (adName: string) => {
    switch (adName) {
      case 'Testing':
        return '#10B981'; // Verde esmeralda
      case 'Scala':
        return '#3B82F6'; // Azul
      case 'Retargeting':
        return '#8B5CF6'; // Morado
      default:
        return '#6B7280'; // Gris
    }
  };

  return (
    <div 
      className="glass glow rounded-xl p-6 shadow-lg overflow-x-auto transition-all duration-300"
      style={{
        border: '2px solid #3B82F699',
        boxShadow: '0 0 12px #3B82F640',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = '2px solid #3B82F6E6';
        e.currentTarget.style.boxShadow = '0 0 18px #3B82F680';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = '2px solid #3B82F699';
        e.currentTarget.style.boxShadow = '0 0 12px #3B82F640';
      }}
    >
      <h3 className="text-lg font-semibold text-tx1 mb-4">Anuncios por Rendimiento</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-2 text-tx2">Ad / Campaña</th>
            <th className="text-left py-3 px-2 text-tx2">Medio</th>
            <th className="text-right py-3 px-2 text-tx2">Spend</th>
            <th className="text-right py-3 px-2 text-tx2">Impresiones</th>
            <th className="text-right py-3 px-2 text-tx2">CTR</th>
            <th className="text-right py-3 px-2 text-tx2">AgendasQ</th>
            <th className="text-right py-3 px-2 text-tx2">ShowsQ</th>
            <th className="text-right py-3 px-2 text-tx2">Ventas</th>
            <th className="text-right py-3 px-2 text-tx2">Cash</th>
            <th className="text-right py-3 px-2 text-tx2">Reservas</th>
            <th className="text-right py-3 px-2 text-tx2">Valor Reservas</th>
            <th className="text-right py-3 px-2 text-tx2">CPA-Q</th>
            <th className="text-right py-3 px-2 text-tx2">CPS-Q</th>
            <th className="text-right py-3 px-2 text-tx2">CAC</th>
            <th className="text-right py-3 px-2 text-tx2">ROAS</th>
          </tr>
        </thead>
        <tbody>
          {sortedAds.map((ad) => {
            const campaigns = getAdCampaigns(ad);
            const expanded = isExpanded(ad.adId);
            
            return (
              <Fragment key={ad.adId}>
                {/* Parent Row - Ad Name and Medium with Totals */}
                <tr 
                  className="border-t border-white/10 bg-white/4 hover:bg-white/6 cursor-pointer transition-colors"
                  onClick={() => toggleExpanded(ad.adId)}
                  style={{
                    borderLeft: `4px solid ${getCampaignColor(ad.adName)}`,
                  }}
                >
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <svg 
                        className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="font-medium">{ad.adName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-tx2">{ad.medium}</td>
                  {(() => {
                    const totals = getAdTotals(ad);
                    return (
                      <>
                        <td className="py-3 px-2 text-right">{money0(totals.spend)}</td>
                        <td className="py-3 px-2 text-right">{totals.impressions.toLocaleString()}</td>
                        <td className="py-3 px-2 text-right">{totals.ctr}%</td>
                        <td className="py-3 px-2 text-right">{totals.agendasQ}</td>
                        <td className="py-3 px-2 text-right">{totals.showsQ}</td>
                        <td className="py-3 px-2 text-right font-semibold">{totals.sales}</td>
                        <td className="py-3 px-2 text-right">{money0(totals.cash)}</td>
                        <td className="py-3 px-2 text-right">{totals.reservas}</td>
                        <td className="py-3 px-2 text-right">{money0(totals.valorReservas)}</td>
                        <td className="py-3 px-2 text-right">{money2(totals.cpaq)}</td>
                        <td className="py-3 px-2 text-right">{money2(totals.cpsq)}</td>
                        <td className="py-3 px-2 text-right">{money0(totals.cac)}</td>
                        <td className="py-3 px-2 text-right">{x(totals.roas)}</td>
                      </>
                    );
                  })()}
                </tr>
                
                {/* Child Rows - Campaigns */}
                {expanded && campaigns.map((campaign, index) => {
                  const metrics = getCampaignMetrics(campaign);
                  
                  return (
                    <tr 
                      key={`${ad.adId}-${campaign.name}`} 
                      className="border-t border-white/5 hover:bg-white/6 hover:ring-1 hover:ring-white/15 transition-colors"
                      style={{
                        borderLeft: `4px solid ${getCampaignColor(ad.adName)}`,
                        backgroundColor: `${getCampaignColor(ad.adName)}05`, // 5% opacity
                      }}
                    >
                      <td className="py-2 px-2 pl-8">
                        <strong className="text-tx1">{campaign.name}</strong>
                      </td>
                      <td className="py-2 px-2 text-tx2">{ad.medium}</td>
                      <td className="py-2 px-2 text-right">{money0(campaign.spend)}</td>
                      <td className="py-2 px-2 text-right">{campaign.impressions.toLocaleString()}</td>
                      <td className="py-2 px-2 text-right">{campaign.ctr}%</td>
                      <td className="py-2 px-2 text-right">{campaign.agendasQ}</td>
                      <td className="py-2 px-2 text-right">{campaign.showsQ}</td>
                      <td className="py-2 px-2 text-right font-semibold">{campaign.sales}</td>
                      <td className="py-2 px-2 text-right">{money0(campaign.cash)}</td>
                      <td className="py-2 px-2 text-right">{campaign.reservas || 0}</td>
                      <td className="py-2 px-2 text-right">{money0(campaign.valorReservas || 0)}</td>
                      <td className="py-2 px-2 text-right">{money2(metrics.cpaq)}</td>
                      <td className="py-2 px-2 text-right">{money2(metrics.cpsq)}</td>
                      <td className="py-2 px-2 text-right">{money0(metrics.cac)}</td>
                      <td className="py-2 px-2 text-right">{x(campaign.roas)}</td>
                    </tr>
                  );
                })}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
} 